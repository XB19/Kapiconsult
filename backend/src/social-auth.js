// Connexion / inscription avec un compte Google ou Apple (iCloud).
// Le navigateur obtient un jeton d'identité (JWT signé par Google ou Apple) ; on vérifie ici
// sa signature avec les clés publiques du fournisseur, son audience et son émetteur.
import crypto from 'node:crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import { query } from './db/pool.js';

export const SOCIAL_MIGRATION = `
  ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS google_sub VARCHAR(255) UNIQUE;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS apple_sub VARCHAR(255) UNIQUE;
`;

const PROVIDERS = {
  google: {
    jwks: 'https://www.googleapis.com/oauth2/v3/certs',
    issuer: ['accounts.google.com', 'https://accounts.google.com'],
    audience: () => process.env.GOOGLE_CLIENT_ID,
    column: 'google_sub',
  },
  apple: {
    jwks: 'https://appleid.apple.com/auth/keys',
    issuer: 'https://appleid.apple.com',
    audience: () => process.env.APPLE_CLIENT_ID,
    column: 'apple_sub',
  },
};

// Clés publiques mises en cache ; rechargées si un jeton cite une clé inconnue (rotation)
const keyCache = {};
async function publicKey(provider, kid) {
  const cached = keyCache[provider];
  if (cached?.keys[kid] && Date.now() - cached.at < 6 * 3600e3) return cached.keys[kid];
  const res = await fetch(PROVIDERS[provider].jwks);
  if (!res.ok) throw new Error(`Clés ${provider} indisponibles (${res.status})`);
  const { keys } = await res.json();
  keyCache[provider] = { at: Date.now(), keys: Object.fromEntries(keys.map((k) => [k.kid, crypto.createPublicKey({ key: k, format: 'jwk' })])) };
  return keyCache[provider].keys[kid];
}

async function verifyIdToken(provider, token) {
  const conf = PROVIDERS[provider];
  const header = jwt.decode(token || '', { complete: true })?.header;
  const key = header?.kid && (await publicKey(provider, header.kid));
  if (!key) return null;
  try {
    return jwt.verify(token, key, { algorithms: ['RS256'], audience: conf.audience(), issuer: conf.issuer });
  } catch { return null; }
}

const clean = (s, max = 120) => (typeof s === 'string' ? s.trim().slice(0, max) : '');

export function socialAuthRouter({ sign, publicUser, wrap }) {
  const router = express.Router();

  // Configuration publique lue par le frontend (identifiants client, pas de secret)
  router.get('/auth/providers', (_req, res) => {
    res.json({
      google: process.env.GOOGLE_CLIENT_ID || null,
      apple: process.env.APPLE_CLIENT_ID && process.env.APPLE_REDIRECT_URI
        ? { clientId: process.env.APPLE_CLIENT_ID, redirectURI: process.env.APPLE_REDIRECT_URI } : null,
    });
  });

  router.post('/auth/:provider(google|apple)', wrap(async (req, res) => {
    const { provider } = req.params;
    const conf = PROVIDERS[provider];
    const label = provider === 'google' ? 'Google' : 'Apple';
    if (!conf.audience()) return res.status(503).json({ message: `La connexion ${label} n'est pas encore configurée.` });

    const claims = await verifyIdToken(provider, req.body?.credential);
    const verified = claims && (claims.email_verified === true || claims.email_verified === 'true');
    if (!claims?.sub || !claims.email || !verified) {
      return res.status(401).json({ message: `La connexion avec ${label} a échoué, merci de réessayer.` });
    }
    const email = claims.email.toLowerCase();

    // 1. Compte déjà lié à ce fournisseur  2. Compte existant avec le même email (vérifié) : on le lie
    let user = (await query(`SELECT * FROM users WHERE ${conf.column}=$1`, [claims.sub])).rows[0];
    if (!user) {
      user = (await query(`UPDATE users SET ${conf.column}=$1 WHERE lower(email)=$2 AND ${conf.column} IS NULL RETURNING *`, [claims.sub, email])).rows[0];
    }
    // 3. Nouveau compte. Apple ne transmet le nom qu'à la toute première connexion, depuis le navigateur.
    if (!user) {
      const n = req.body?.name || {};
      const prenom = clean(claims.given_name) || clean(n.firstName) || email.split('@')[0];
      const nom = clean(claims.family_name) || clean(n.lastName) || '';
      user = (await query(
        `INSERT INTO users (prenom, nom, email, ${conf.column}) VALUES ($1,$2,$3,$4) RETURNING *`,
        [prenom, nom, email, claims.sub],
      )).rows[0];
      return res.status(201).json({ token: sign(user), user: publicUser(user), created: true });
    }
    res.json({ token: sign(user), user: publicUser(user) });
  }));

  return router;
}
