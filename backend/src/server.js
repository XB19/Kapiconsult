import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db/pool.js';
import { adminRouter } from './admin.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS = path.join(dir, '..', 'uploads');
fs.mkdirSync(UPLOADS, { recursive: true });

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true }));
app.use(express.json());

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const today = () => new Date().toISOString().slice(0, 10);

// ───────── Auth
const sign = (u) => jwt.sign({ id: u.id, email: u.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = (u) => ({ id: u.id, prenom: u.prenom, nom: u.nom, email: u.email, telephone: u.telephone, role: u.role });
function optionalAuth(req, _res, next) {
  const h = req.headers.authorization || '';
  if (h.startsWith('Bearer ')) {
    try { req.user = jwt.verify(h.slice(7), process.env.JWT_SECRET); } catch { /* jeton invalide : ignoré */ }
  }
  next();
}
const requireAuth = (req, res, next) => optionalAuth(req, res, () => (req.user ? next() : res.status(401).json({ message: 'Non authentifié.' })));

app.post('/api/auth/register', wrap(async (req, res) => {
  const { prenom, name, email, telephone, password, password_confirmation } = req.body || {};
  const errors = {};
  if (!prenom?.trim()) errors.prenom = 'Le prénom est obligatoire.';
  if (!name?.trim()) errors.name = 'Le nom est obligatoire.';
  if (!/^\S+@\S+\.\S+$/.test(email || '')) errors.email = "L'adresse email n'est pas valide.";
  if (!password || password.length < 8) errors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
  else if (password !== password_confirmation) errors.password = 'La confirmation du mot de passe ne correspond pas.';
  if (Object.keys(errors).length) return res.status(422).json({ errors });
  const exists = await query('SELECT 1 FROM users WHERE lower(email)=lower($1)', [email]);
  if (exists.rowCount) return res.status(422).json({ errors: { email: 'Cette adresse email est déjà utilisée.' } });
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await query(
    'INSERT INTO users (prenom,nom,email,telephone,password_hash) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [prenom.trim(), name.trim(), email.trim().toLowerCase(), telephone || null, hash],
  );
  res.status(201).json({ token: sign(rows[0]), user: publicUser(rows[0]) });
}));

app.post('/api/auth/login', wrap(async (req, res) => {
  const { email, password } = req.body || {};
  const { rows } = await query('SELECT * FROM users WHERE lower(email)=lower($1)', [email || '']);
  if (!rows[0] || !(await bcrypt.compare(password || '', rows[0].password_hash))) {
    return res.status(422).json({ errors: { email: 'Ces identifiants ne correspondent à aucun compte.' } });
  }
  res.json({ token: sign(rows[0]), user: publicUser(rows[0]) });
}));

app.get('/api/auth/me', requireAuth, wrap(async (req, res) => {
  const { rows } = await query('SELECT * FROM users WHERE id=$1', [req.user.id]);
  if (!rows[0]) return res.status(401).json({ message: 'Non authentifié.' });
  const cands = await query('SELECT id,domaine,statut,created_at FROM candidatures WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
  res.json({ user: publicUser(rows[0]), candidatures: cands.rows });
}));

// ───────── Articles (actualités, blog, bons plans)
const ARTICLE_COLS = 'id,slug,type,badge,category,title,content,image,card_image,author,position,published_at';
app.get('/api/articles', wrap(async (req, res) => {
  const { type, limit } = req.query;
  const params = []; let where = 'WHERE published';
  if (type) { params.push(type); where += ` AND type=$${params.length}`; }
  const order = type === 'bon_plan' ? 'position NULLS LAST, published_at DESC' : 'published_at DESC, id DESC';
  let sql = `SELECT ${ARTICLE_COLS} FROM articles ${where} ORDER BY ${order}`;
  if (limit) { params.push(Number(limit)); sql += ` LIMIT $${params.length}`; }
  res.json((await query(sql, params)).rows);
}));

app.get('/api/articles/:slug', wrap(async (req, res) => {
  const { rows } = await query(`SELECT ${ARTICLE_COLS} FROM articles WHERE slug=$1 AND published`, [req.params.slug]);
  if (!rows[0]) return res.status(404).json({ message: 'Article introuvable.' });
  const similaires = await query(
    `SELECT ${ARTICLE_COLS} FROM articles WHERE type=$1 AND id<>$2 AND published ORDER BY published_at DESC, id LIMIT 3`,
    [rows[0].type, rows[0].id],
  );
  res.json({ article: rows[0], similaires: similaires.rows });
}));

// ───────── Produits
app.get('/api/produits', wrap(async (req, res) => {
  const params = []; let where = 'WHERE actif';
  if (req.query.categorie) { params.push(req.query.categorie); where += ` AND categorie=$1`; }
  const produits = await query(`SELECT * FROM produits ${where} ORDER BY position, id`, params);
  const cats = await query('SELECT categorie FROM produits WHERE actif GROUP BY categorie ORDER BY min(position)');
  res.json({ produits: produits.rows, categories: cats.rows.map((r) => r.categorie) });
}));

app.get('/api/produits/:slug', wrap(async (req, res) => {
  const { rows } = await query('SELECT * FROM produits WHERE slug=$1 AND actif', [req.params.slug]);
  if (!rows[0]) return res.status(404).json({ message: 'Produit introuvable.' });
  const sim = await query('SELECT * FROM produits WHERE categorie=$1 AND id<>$2 AND actif ORDER BY position LIMIT 3', [rows[0].categorie, rows[0].id]);
  res.json({ produit: rows[0], similaires: sim.rows });
}));

// ───────── Offres d'emploi
app.get('/api/offres', wrap(async (req, res) => {
  const { q, type, statut } = req.query;
  const params = []; const cond = [];
  if (q) { params.push(`%${q}%`); cond.push(`(titre ILIKE $${params.length} OR lieu ILIKE $${params.length})`); }
  if (type) { params.push(type); cond.push(`type_contrat=$${params.length}`); }
  params.push(today());
  const t = `$${params.length}`;
  if (statut === 'active') cond.push(`(date_limite IS NULL OR date_limite >= ${t})`);
  if (statut === 'expiree') cond.push(`date_limite < ${t}`);
  const sql = `SELECT *, (date_limite IS NOT NULL AND date_limite < ${t}) AS expiree FROM offres
               ${cond.length ? 'WHERE ' + cond.join(' AND ') : ''} ORDER BY published_at DESC, id`;
  res.json((await query(sql, params)).rows);
}));

// ───────── FAQ
app.get('/api/faqs', wrap(async (_req, res) => {
  res.json((await query('SELECT * FROM faqs ORDER BY position, id')).rows);
}));

// ───────── Contact
app.post('/api/contact', wrap(async (req, res) => {
  const { prenom, nom, email, telephone, sujet, message } = req.body || {};
  const errors = {};
  for (const [k, v] of Object.entries({ prenom, nom, sujet, message })) if (!v?.trim()) errors[k] = 'Ce champ est obligatoire.';
  if (!/^\S+@\S+\.\S+$/.test(email || '')) errors.email = "L'adresse email n'est pas valide.";
  if (Object.keys(errors).length) return res.status(422).json({ errors });
  await query('INSERT INTO contacts (prenom,nom,email,telephone,sujet,message) VALUES ($1,$2,$3,$4,$5,$6)',
    [prenom.trim(), nom.trim(), email.trim(), telephone || null, sujet, message.trim()]);
  res.status(201).json({ message: 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.' });
}));

// ───────── Candidature spontanée (CV + lettre)
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS,
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, ['.pdf', '.doc', '.docx'].includes(path.extname(file.originalname).toLowerCase())),
});

app.post('/api/candidatures', optionalAuth, upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'lettre', maxCount: 1 }]), wrap(async (req, res) => {
  const b = req.body || {};
  const errors = {};
  for (const k of ['prenom', 'nom', 'telephone', 'domaine', 'experience', 'message']) if (!b[k]?.trim()) errors[k] = 'Ce champ est obligatoire.';
  if (!/^\S+@\S+\.\S+$/.test(b.email || '')) errors.email = "L'adresse email n'est pas valide.";
  const cv = req.files?.cv?.[0];
  if (!cv) errors.cv = 'Le CV est obligatoire (PDF, DOC ou DOCX, max 5 Mo).';
  if (Object.keys(errors).length) return res.status(422).json({ errors });
  const lettre = req.files?.lettre?.[0];
  await query(
    `INSERT INTO candidatures (user_id,prenom,nom,email,telephone,domaine,experience,message,cv_path,lettre_path)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [req.user?.id ?? null, b.prenom.trim(), b.nom.trim(), b.email.trim(), b.telephone.trim(), b.domaine, b.experience,
      b.message.trim(), cv.filename, lettre?.filename ?? null],
  );
  res.status(201).json({ message: 'Votre candidature a bien été envoyée. Nous vous contacterons dès qu’une opportunité correspondra à votre profil.' });
}));

// ───────── Administration (réservée aux comptes admin)
app.use('/uploads/media', express.static(path.join(UPLOADS, 'media'), { maxAge: '7d' }));
app.use('/api/admin', adminRouter({ UPLOADS }));

// ───────── Erreurs
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) return res.status(422).json({ errors: { cv: 'Fichier trop volumineux (max 5 Mo).' } });
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur.' });
});

// En production : sert le build React
const dist = path.join(dir, '..', '..', 'frontend', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const port = Number(process.env.PORT || 4100);
app.listen(port, () => console.log(`API Kapi Consult sur http://localhost:${port}`));
