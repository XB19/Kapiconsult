// Crée (ou réinitialise) un compte administrateur.
// Usage : npm run admin:create -- <email> [motDePasse] [prénom] [nom]
// Sans mot de passe fourni, un mot de passe aléatoire est généré et affiché une seule fois.
import 'dotenv/config';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { pool } from './pool.js';

const [email = 'admin@kapiconsult.tg', given, prenom = 'Administrateur', nom = 'Kapi Consult'] = process.argv.slice(2);
const password = given || crypto.randomBytes(9).toString('base64url');

if (password.length < 8) { console.error('Le mot de passe doit contenir au moins 8 caractères.'); process.exit(1); }

const hash = await bcrypt.hash(password, 10);
const { rows } = await pool.query(
  `INSERT INTO users (prenom, nom, email, password_hash, role) VALUES ($1,$2,lower($3),$4,'admin')
   ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin'
   RETURNING id, email`,
  [prenom, nom, email, hash],
);
await pool.end();
console.log(`Compte administrateur prêt : ${rows[0].email}`);
if (!given) console.log(`Mot de passe généré : ${password}  (à changer après la première connexion)`);
