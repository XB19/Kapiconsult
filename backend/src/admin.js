// API d'administration — toutes les routes exigent un compte « admin »
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from './db/pool.js';

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const slugify = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'element';
const uniqueSuffix = () => Date.now().toString(16).slice(-8);

async function requireAdmin(req, res, next) {
  const h = req.headers.authorization || '';
  try {
    const payload = jwt.verify(h.replace(/^Bearer /, ''), process.env.JWT_SECRET);
    const { rows } = await query('SELECT id, prenom, nom, email, role FROM users WHERE id=$1', [payload.id]);
    if (!rows[0]) return res.status(401).json({ message: 'Non authentifié.' });
    if (rows[0].role !== 'admin') return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
    req.admin = rows[0];
    return next();
  } catch {
    return res.status(401).json({ message: 'Non authentifié.' });
  }
}

// Validation simple : champs obligatoires
function check(body, required) {
  const errors = {};
  for (const k of required) if (body[k] == null || String(body[k]).trim() === '') errors[k] = 'Ce champ est obligatoire.';
  return errors;
}

/**
 * Fabrique un CRUD générique pour une table.
 * fields : colonnes modifiables · required : obligatoires · order : tri · search : colonnes recherchées
 */
function crud(router, { table, fields, required, order, search, slugFrom, keepEmpty = [], transform = (b) => b }) {
  const val = (c, v) => (v === '' && !keepEmpty.includes(c) ? null : v);
  router.get(`/${table}`, wrap(async (req, res) => {
    const params = []; let where = '';
    if (req.query.q && search?.length) {
      params.push(`%${req.query.q}%`);
      where = `WHERE ${search.map((c) => `${c}::text ILIKE $1`).join(' OR ')}`;
    }
    res.json((await query(`SELECT * FROM ${table} ${where} ORDER BY ${order}`, params)).rows);
  }));

  router.post(`/${table}`, wrap(async (req, res) => {
    const body = transform(req.body || {});
    const errors = check(body, required);
    if (Object.keys(errors).length) return res.status(422).json({ errors });
    const cols = fields.filter((f) => body[f] !== undefined);
    const vals = cols.map((c) => val(c, body[c]));
    if (slugFrom) { cols.push('slug'); vals.push(`${slugify(body[slugFrom])}-${uniqueSuffix()}`); }
    const { rows } = await query(
      `INSERT INTO ${table} (${cols.join(',')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(',')}) RETURNING *`, vals,
    );
    res.status(201).json(rows[0]);
  }));

  router.put(`/${table}/:id`, wrap(async (req, res) => {
    const body = transform(req.body || {});
    const errors = check(body, required);
    if (Object.keys(errors).length) return res.status(422).json({ errors });
    const cols = fields.filter((f) => body[f] !== undefined);
    if (!cols.length) return res.status(422).json({ message: 'Aucune donnée.' });
    const vals = cols.map((c) => val(c, body[c]));
    vals.push(req.params.id);
    const { rows } = await query(
      `UPDATE ${table} SET ${cols.map((c, i) => `${c}=$${i + 1}`).join(',')} WHERE id=$${vals.length} RETURNING *`, vals,
    );
    if (!rows[0]) return res.status(404).json({ message: 'Élément introuvable.' });
    res.json(rows[0]);
  }));

  router.delete(`/${table}/:id`, wrap(async (req, res) => {
    const r = await query(`DELETE FROM ${table} WHERE id=$1`, [req.params.id]);
    if (!r.rowCount) return res.status(404).json({ message: 'Élément introuvable.' });
    res.status(204).end();
  }));
}

const bool = (v) => v === true || v === 'true' || v === 1 || v === '1' || v === 'on';
const BADGES = { actualite: 'Actualité', blog: 'Blog', bon_plan: 'Bon Plan' };

export function adminRouter({ UPLOADS }) {
  const router = express.Router();
  router.use(requireAdmin);

  // ── Tableau de bord
  router.get('/stats', wrap(async (_req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const { rows: [c] } = await query(`SELECT
      (SELECT count(*) FROM articles)::int AS articles,
      (SELECT count(*) FROM articles WHERE NOT published)::int AS brouillons,
      (SELECT count(*) FROM produits)::int AS produits,
      (SELECT count(*) FROM offres)::int AS offres,
      (SELECT count(*) FROM offres WHERE date_limite IS NULL OR date_limite >= $1)::int AS offres_actives,
      (SELECT count(*) FROM faqs)::int AS faqs,
      (SELECT count(*) FROM contacts)::int AS messages,
      (SELECT count(*) FROM contacts WHERE NOT lu)::int AS messages_non_lus,
      (SELECT count(*) FROM candidatures)::int AS candidatures,
      (SELECT count(*) FROM candidatures WHERE statut='en_cours')::int AS candidatures_en_cours,
      (SELECT count(*) FROM users)::int AS utilisateurs`, [today]);
    const messages = await query('SELECT id, prenom, nom, email, sujet, lu, created_at FROM contacts ORDER BY created_at DESC LIMIT 5');
    const candidatures = await query('SELECT id, prenom, nom, domaine, statut, created_at FROM candidatures ORDER BY created_at DESC LIMIT 5');
    const parMois = await query(`SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS mois, count(*)::int AS n
      FROM candidatures WHERE created_at > now() - interval '6 months' GROUP BY 1 ORDER BY 1`);
    res.json({ counts: c, messages: messages.rows, candidatures: candidatures.rows, parMois: parMois.rows });
  }));

  // ── Contenus
  crud(router, {
    table: 'articles',
    fields: ['type', 'badge', 'category', 'title', 'content', 'image', 'card_image', 'author', 'position', 'published', 'published_at'],
    required: ['type', 'title', 'content'],
    order: 'published_at DESC NULLS LAST, id DESC',
    search: ['title', 'author', 'type'],
    slugFrom: 'title',
    keepEmpty: ['category'],
    transform: (b) => ({
      ...b,
      badge: b.badge || BADGES[b.type],
      category: b.category ?? '',
      card_image: b.card_image || b.image || null,
      published: b.published === undefined ? undefined : bool(b.published),
      position: b.position === '' ? null : b.position,
    }),
  });
  crud(router, {
    table: 'produits',
    fields: ['categorie', 'nom', 'description', 'image', 'prix', 'contact_tel', 'contact_email', 'position', 'actif'],
    required: ['categorie', 'nom', 'description'],
    order: 'position, id',
    search: ['nom', 'categorie'],
    slugFrom: 'nom',
    transform: (b) => ({ ...b, actif: b.actif === undefined ? undefined : bool(b.actif), position: b.position === '' || b.position == null ? 0 : b.position }),
  });
  crud(router, {
    table: 'offres',
    fields: ['titre', 'type_contrat', 'lieu', 'experience', 'description', 'published_at', 'date_limite'],
    required: ['titre', 'type_contrat', 'lieu'],
    order: 'published_at DESC, id DESC',
    search: ['titre', 'lieu', 'type_contrat'],
  });
  crud(router, {
    table: 'faqs',
    fields: ['categorie', 'question', 'reponse', 'position'],
    required: ['categorie', 'question', 'reponse'],
    order: 'position, id',
    search: ['question', 'categorie'],
    transform: (b) => ({ ...b, position: b.position === '' || b.position == null ? 0 : b.position }),
  });

  // ── Messages de contact
  router.get('/contacts', wrap(async (req, res) => {
    const params = []; let where = '';
    if (req.query.q) { params.push(`%${req.query.q}%`); where = 'WHERE prenom ILIKE $1 OR nom ILIKE $1 OR email ILIKE $1 OR sujet ILIKE $1 OR message ILIKE $1'; }
    res.json((await query(`SELECT * FROM contacts ${where} ORDER BY created_at DESC`, params)).rows);
  }));
  router.patch('/contacts/:id', wrap(async (req, res) => {
    const { rows } = await query('UPDATE contacts SET lu=$1 WHERE id=$2 RETURNING *', [bool(req.body?.lu), req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Message introuvable.' });
    res.json(rows[0]);
  }));
  router.delete('/contacts/:id', wrap(async (req, res) => { await query('DELETE FROM contacts WHERE id=$1', [req.params.id]); res.status(204).end(); }));

  // ── Candidatures
  const STATUTS = ['en_cours', 'retenu', 'rejete'];
  router.get('/candidatures', wrap(async (req, res) => {
    const params = []; const cond = [];
    if (req.query.q) { params.push(`%${req.query.q}%`); cond.push(`(prenom ILIKE $${params.length} OR nom ILIKE $${params.length} OR email ILIKE $${params.length} OR domaine ILIKE $${params.length})`); }
    if (STATUTS.includes(req.query.statut)) { params.push(req.query.statut); cond.push(`statut=$${params.length}`); }
    res.json((await query(`SELECT * FROM candidatures ${cond.length ? `WHERE ${cond.join(' AND ')}` : ''} ORDER BY created_at DESC`, params)).rows);
  }));
  router.patch('/candidatures/:id', wrap(async (req, res) => {
    if (!STATUTS.includes(req.body?.statut)) return res.status(422).json({ message: 'Statut invalide.' });
    const { rows } = await query('UPDATE candidatures SET statut=$1 WHERE id=$2 RETURNING *', [req.body.statut, req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Candidature introuvable.' });
    res.json(rows[0]);
  }));
  router.get('/candidatures/:id/fichier/:kind', wrap(async (req, res) => {
    const col = req.params.kind === 'lettre' ? 'lettre_path' : 'cv_path';
    const { rows } = await query(`SELECT ${col} AS f, nom, prenom FROM candidatures WHERE id=$1`, [req.params.id]);
    const f = rows[0]?.f;
    if (!f) return res.status(404).json({ message: 'Fichier introuvable.' });
    const full = path.join(UPLOADS, path.basename(f));
    if (!fs.existsSync(full)) return res.status(404).json({ message: 'Fichier introuvable.' });
    res.download(full, `${req.params.kind}-${rows[0].prenom}-${rows[0].nom}${path.extname(f)}`);
  }));
  router.delete('/candidatures/:id', wrap(async (req, res) => {
    const { rows } = await query('DELETE FROM candidatures WHERE id=$1 RETURNING cv_path, lettre_path', [req.params.id]);
    for (const f of [rows[0]?.cv_path, rows[0]?.lettre_path]) if (f) fs.rm(path.join(UPLOADS, path.basename(f)), { force: true }, () => {});
    res.status(204).end();
  }));

  // ── Utilisateurs
  router.get('/users', wrap(async (req, res) => {
    const params = []; let where = '';
    if (req.query.q) { params.push(`%${req.query.q}%`); where = 'WHERE prenom ILIKE $1 OR nom ILIKE $1 OR email ILIKE $1'; }
    res.json((await query(`SELECT id, prenom, nom, email, telephone, role, created_at,
      (SELECT count(*) FROM candidatures c WHERE c.user_id=u.id)::int AS candidatures FROM users u ${where} ORDER BY created_at DESC`, params)).rows);
  }));
  router.post('/users', wrap(async (req, res) => {
    const b = req.body || {};
    const errors = check(b, ['prenom', 'nom', 'email', 'password']);
    if (b.password && b.password.length < 8) errors.password = '8 caractères minimum.';
    if (Object.keys(errors).length) return res.status(422).json({ errors });
    const exists = await query('SELECT 1 FROM users WHERE lower(email)=lower($1)', [b.email]);
    if (exists.rowCount) return res.status(422).json({ errors: { email: 'Cette adresse email est déjà utilisée.' } });
    const { rows } = await query('INSERT INTO users (prenom,nom,email,telephone,password_hash,role) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, prenom, nom, email, telephone, role, created_at',
      [b.prenom.trim(), b.nom.trim(), b.email.trim().toLowerCase(), b.telephone || null, await bcrypt.hash(b.password, 10), b.role === 'admin' ? 'admin' : 'candidat']);
    res.status(201).json(rows[0]);
  }));
  router.patch('/users/:id', wrap(async (req, res) => {
    const role = req.body?.role === 'admin' ? 'admin' : 'candidat';
    if (Number(req.params.id) === req.admin.id && role !== 'admin') return res.status(422).json({ message: 'Vous ne pouvez pas retirer vos propres droits administrateur.' });
    const { rows } = await query('UPDATE users SET role=$1 WHERE id=$2 RETURNING id, role', [role, req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    res.json(rows[0]);
  }));
  router.delete('/users/:id', wrap(async (req, res) => {
    if (Number(req.params.id) === req.admin.id) return res.status(422).json({ message: 'Vous ne pouvez pas supprimer votre propre compte.' });
    await query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.status(204).end();
  }));

  // ── Envoi d'images (articles, produits)
  const MEDIA = path.join(UPLOADS, 'media');
  fs.mkdirSync(MEDIA, { recursive: true });
  const upload = multer({
    storage: multer.diskStorage({
      destination: MEDIA,
      filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname).toLowerCase()}`),
    }),
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => cb(null, /^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)),
  });
  router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(422).json({ message: 'Image invalide (PNG, JPG, WEBP ou GIF, max 8 Mo).' });
    res.status(201).json({ url: `/uploads/media/${req.file.filename}` });
  });

  return router;
}
