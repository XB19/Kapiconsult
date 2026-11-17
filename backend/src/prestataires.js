// Annuaire des prestataires : recherche publique, fiche, avis, et profil du professionnel connecté
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import crypto from 'node:crypto';
import multer from 'multer';
import { query } from './db/pool.js';

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Comparaison sans accents ni majuscules (« mecanicien » trouve « Mécanicien »)
const FROM = 'àáâäãåèéêëìíîïòóôöõùúûüýÿçñœ';
const TO = 'aaaaaaeeeeiiiiooooouuuuyycno';
const fold = (sql) => `translate(lower(${sql}), '${FROM}', '${TO}')`;
const foldJs = (s) => String(s || '').toLowerCase().split('').map((c) => { const i = FROM.indexOf(c); return i < 0 ? c : TO[i]; }).join('');

// Distance en km entre le point recherché ($lat, $lng) et le prestataire
const distanceSql = (lat, lng) => `CASE WHEN p.latitude IS NULL THEN NULL ELSE
  6371 * acos(least(1, cos(radians(${lat})) * cos(radians(p.latitude)) * cos(radians(p.longitude) - radians(${lng}))
  + sin(radians(${lat})) * sin(radians(p.latitude)))) END`;

const PUBLIC_COLS = `p.id, p.nom_affiche, p.metier, p.specialites, p.description, p.experience, p.pays, p.ville, p.quartier,
  p.rayon_km, p.deplacement, p.disponibilite, p.photo, p.verifie, p.created_at,
  p.qualif_type, p.qualif_intitule, (p.verifie AND p.qualif_fichier IS NOT NULL) AS qualif_verifiee`;
const NOTE_JOIN = `LEFT JOIN (SELECT prestataire_id, round(avg(note)::numeric, 1)::float AS note, count(*)::int AS nb_avis
  FROM avis WHERE visible GROUP BY prestataire_id) a ON a.prestataire_id = p.id`;

const num = (v) => (v === '' || v == null || Number.isNaN(Number(v)) ? null : Number(v));
const clean = (v, max = 255) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Version des conditions d'utilisation de Quotidien : la changer oblige chaque membre à les accepter de nouveau
export const CONDITIONS_VERSION = '2026-11-17';

// Types de justificatif de qualification acceptés
export const QUALIF_TYPES = ['diplome', 'attestation', 'certificat'];

// Colonnes ajoutées aux bases déjà installées (exécuté au démarrage, sans effet si elles existent)
export const QUOTIDIEN_MIGRATION = `
  ALTER TABLE users ADD COLUMN IF NOT EXISTS quotidien_conditions_version VARCHAR(20);
  ALTER TABLE users ADD COLUMN IF NOT EXISTS quotidien_accepte_le TIMESTAMPTZ;
  ALTER TABLE prestataires ADD COLUMN IF NOT EXISTS cni_numero VARCHAR(60);
  ALTER TABLE prestataires ADD COLUMN IF NOT EXISTS cni_recto VARCHAR(255);
  ALTER TABLE prestataires ADD COLUMN IF NOT EXISTS cni_verso VARCHAR(255);
  ALTER TABLE prestataires ADD COLUMN IF NOT EXISTS cni_transmise_le TIMESTAMPTZ;
  ALTER TABLE prestataires ADD COLUMN IF NOT EXISTS identite_verifiee_le TIMESTAMPTZ;
  ALTER TABLE prestataires ADD COLUMN IF NOT EXISTS verifie_par INTEGER REFERENCES users(id) ON DELETE SET NULL;
  ALTER TABLE prestataires ADD COLUMN IF NOT EXISTS motif_refus TEXT;
  ALTER TABLE prestataires ADD COLUMN IF NOT EXISTS conditions_acceptees_le TIMESTAMPTZ;
  ALTER TABLE prestataires ADD COLUMN IF NOT EXISTS qualif_type VARCHAR(20);
  ALTER TABLE prestataires ADD COLUMN IF NOT EXISTS qualif_intitule VARCHAR(200);
  ALTER TABLE prestataires ADD COLUMN IF NOT EXISTS qualif_fichier VARCHAR(255);
  ALTER TABLE prestataires ADD COLUMN IF NOT EXISTS qualif_transmise_le TIMESTAMPTZ;`;

// Documents privés (pièce d'identité, diplôme / attestation) : stockés hors des dossiers publics, lus uniquement par l'administration
export const cniDir = (UPLOADS) => path.join(UPLOADS, 'cni');
export const removeCni = (UPLOADS, f) => { if (f) fs.rm(path.join(cniDir(UPLOADS), path.basename(f)), { force: true }, () => {}); };

export function prestatairesRouter({ UPLOADS, requireAuth, optionalAuth }) {
  const router = express.Router();
  const PHOTOS = path.join(UPLOADS, 'prestataires');
  const CNI = cniDir(UPLOADS);
  fs.mkdirSync(PHOTOS, { recursive: true });
  fs.mkdirSync(CNI, { recursive: true });
  const isCni = (f) => ['cni_recto', 'cni_verso', 'qualif_fichier'].includes(f.fieldname);
  const upload = multer({
    storage: multer.diskStorage({
      destination: (_req, file, cb) => cb(null, isCni(file) ? CNI : PHOTOS),
      filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname).toLowerCase()}`),
    }),
    limits: { fileSize: 6 * 1024 * 1024, files: 4 },
    fileFilter: (_req, file, cb) => cb(null, isCni(file)
      ? /^(image\/(png|jpe?g|webp)|application\/pdf)$/.test(file.mimetype)
      : /^image\/(png|jpe?g|webp)$/.test(file.mimetype)),
  });
  const fields = upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'cni_recto', maxCount: 1 }, { name: 'cni_verso', maxCount: 1 }, { name: 'qualif_fichier', maxCount: 1 }]);
  const removePhoto = (p) => { if (p?.startsWith('/uploads/prestataires/')) fs.rm(path.join(PHOTOS, path.basename(p)), { force: true }, () => {}); };
  const dropUploads = (files) => Object.values(files || {}).flat().forEach((f) => fs.rm(f.path, { force: true }, () => {}));

  // ── Accès à Quotidien : compte obligatoire + conditions d'utilisation acceptées (les administrateurs sont dispensés)
  const accessOf = async (userId) => (await query('SELECT role, quotidien_conditions_version, quotidien_accepte_le FROM users WHERE id = $1', [userId])).rows[0];
  const requireQuotidien = (req, res, next) => requireAuth(req, res, async () => {
    try {
      const u = await accessOf(req.user.id);
      if (!u) return res.status(401).json({ message: 'Non authentifié.' });
      if (u.role !== 'admin' && u.quotidien_conditions_version !== CONDITIONS_VERSION) {
        return res.status(403).json({ code: 'conditions', message: 'Vous devez accepter les conditions d’utilisation de Quotidien.' });
      }
      return next();
    } catch (e) { return next(e); }
  });

  router.get('/quotidien/acces', requireAuth, wrap(async (req, res) => {
    const u = await accessOf(req.user.id);
    if (!u) return res.status(401).json({ message: 'Non authentifié.' });
    res.json({ version: CONDITIONS_VERSION, accepte: u.role === 'admin' || u.quotidien_conditions_version === CONDITIONS_VERSION, accepte_le: u.quotidien_accepte_le });
  }));

  router.post('/quotidien/conditions', requireAuth, wrap(async (req, res) => {
    if (req.body?.accepte !== true) return res.status(422).json({ errors: { accepte: 'Vous devez cocher la case pour accepter les conditions.' } });
    const { rows } = await query(`UPDATE users SET quotidien_conditions_version = $1, quotidien_accepte_le = now() WHERE id = $2
      RETURNING quotidien_accepte_le`, [CONDITIONS_VERSION, req.user.id]);
    if (!rows[0]) return res.status(401).json({ message: 'Non authentifié.' });
    res.json({ version: CONDITIONS_VERSION, accepte: true, accepte_le: rows[0].quotidien_accepte_le });
  }));

  // ── Recherche (réservée aux membres)
  router.get('/prestataires', requireQuotidien, wrap(async (req, res) => {
    const { q, metier, ville, tri } = req.query;
    const lat = num(req.query.lat); const lng = num(req.query.lng);
    const rayon = num(req.query.rayon); const noteMin = num(req.query.note);
    const page = Math.max(1, num(req.query.page) || 1); const PER = 12;
    const params = []; const where = ["p.statut = 'valide'"];
    const add = (v) => { params.push(v); return `$${params.length}`; };
    if (metier) where.push(`p.metier = ${add(metier)}`);
    if (ville) where.push(`${fold('p.ville')} = ${add(foldJs(ville))}`);
    if (q) {
      const words = foldJs(q).split(/\s+/).filter(Boolean).slice(0, 6);
      for (const w of words) {
        const k = add(`%${w}%`);
        where.push(`${fold(`concat_ws(' ', p.nom_affiche, p.metier, p.description, array_to_string(p.specialites, ' '), p.ville, p.quartier)`)} LIKE ${k}`);
      }
    }
    const geo = lat != null && lng != null;
    const dist = geo ? distanceSql(add(lat), add(lng)) : 'NULL';
    const outer = [];
    if (noteMin) outer.push(`coalesce(note, 0) >= ${add(noteMin)}`);
    if (geo && rayon) outer.push(`distance IS NOT NULL AND distance <= ${add(rayon)}`);
    const order = {
      note: 'coalesce(note,0) DESC, nb_avis DESC',
      recent: 'created_at DESC',
      distance: geo ? 'distance ASC NULLS LAST' : 'verifie DESC, coalesce(note,0) DESC',
    }[tri] || (geo ? 'distance ASC NULLS LAST, verifie DESC' : 'verifie DESC, coalesce(note,0) DESC, nb_avis DESC, created_at DESC');

    const base = `SELECT * FROM (SELECT ${PUBLIC_COLS}, a.note, coalesce(a.nb_avis, 0) AS nb_avis, ${dist} AS distance
      FROM prestataires p ${NOTE_JOIN} WHERE ${where.join(' AND ')}) t ${outer.length ? `WHERE ${outer.join(' AND ')}` : ''}`;
    const total = (await query(`SELECT count(*)::int AS n FROM (${base}) c`, params)).rows[0].n;
    const items = (await query(`${base} ORDER BY ${order} LIMIT ${PER} OFFSET ${(page - 1) * PER}`, params)).rows;
    res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / PER)) });
  }));

  // Filtres disponibles (métiers et villes ayant au moins un prestataire visible)
  router.get('/prestataires/filtres', requireQuotidien, wrap(async (_req, res) => {
    const metiers = await query("SELECT metier, count(*)::int AS n FROM prestataires WHERE statut='valide' GROUP BY metier ORDER BY n DESC, metier");
    const villes = await query("SELECT ville, count(*)::int AS n FROM prestataires WHERE statut='valide' GROUP BY ville ORDER BY n DESC, ville");
    const total = await query("SELECT count(*)::int AS n FROM prestataires WHERE statut='valide'");
    res.json({ metiers: metiers.rows, villes: villes.rows, total: total.rows[0].n });
  }));

  // ── Profil du professionnel connecté
  // Les chemins des fichiers d'identité ne sortent jamais : seul leur état est renvoyé
  const ownProfile = ({ cni_recto: r, cni_verso: v, qualif_fichier: q, verifie_par: _vp, ...p }) => ({ ...p, cni_recto_ok: !!r, cni_verso_ok: !!v, qualif_ok: !!q });

  router.get('/mon-profil-prestataire', requireAuth, wrap(async (req, res) => {
    const { rows } = await query(`SELECT p.*, a.note, coalesce(a.nb_avis, 0) AS nb_avis FROM prestataires p ${NOTE_JOIN} WHERE p.user_id = $1`, [req.user.id]);
    res.json({ profil: rows[0] ? ownProfile(rows[0]) : null });
  }));

  router.post('/mon-profil-prestataire', requireAuth, (req, res, next) => fields(req, res, (err) => {
    if (!err) return next();
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Fichier trop volumineux (6 Mo maximum).' : 'Fichier refusé.';
    return res.status(422).json({ errors: { cni_recto: message } });
  }), wrap(async (req, res) => {
    const b = req.body || {};
    const files = req.files || {};
    const file = (k) => files[k]?.[0];
    const prev = (await query('SELECT id, photo, statut, cni_recto, cni_verso, qualif_fichier, conditions_acceptees_le FROM prestataires WHERE user_id = $1', [req.user.id])).rows[0];

    const errors = {};
    const need = { nom_affiche: 'Le nom affiché', metier: 'Le métier', description: 'La présentation', telephone: 'Le téléphone', ville: 'La ville' };
    for (const [k, l] of Object.entries(need)) if (!clean(b[k])) errors[k] = `${l} est obligatoire.`;
    if (clean(b.description, 3000).length && clean(b.description, 3000).length < 30) errors.description = 'Décrivez votre activité en au moins 30 caractères.';
    if (b.email && !/^\S+@\S+\.\S+$/.test(b.email)) errors.email = "L'adresse email n'est pas valide.";
    // Vérification d'identité : numéro + recto et verso de la CNI
    if (!clean(b.cni_numero, 60) || clean(b.cni_numero, 60).length < 4) errors.cni_numero = 'Indiquez le numéro de votre carte nationale d’identité.';
    if (!file('cni_recto') && !prev?.cni_recto) errors.cni_recto = 'La photo du recto de votre CNI est obligatoire.';
    if (!file('cni_verso') && !prev?.cni_verso) errors.cni_verso = 'La photo du verso de votre CNI est obligatoire.';
    // Preuve de qualification : diplôme, attestation de formation / d'apprentissage ou certificat
    if (!QUALIF_TYPES.includes(b.qualif_type)) errors.qualif_type = 'Choisissez le type de document.';
    if (clean(b.qualif_intitule, 200).length < 3) errors.qualif_intitule = 'Indiquez l’intitulé du diplôme ou de la formation.';
    if (!file('qualif_fichier') && !prev?.qualif_fichier) errors.qualif_fichier = 'Le diplôme ou l’attestation est obligatoire.';
    if (b.accepte_conditions !== '1') errors.accepte_conditions = 'Vous devez accepter les conditions d’utilisation de Quotidien.';
    if (b.attestation !== '1') errors.attestation = 'Vous devez certifier l’exactitude de vos informations.';
    if (Object.keys(errors).length) { dropUploads(files); return res.status(422).json({ errors }); }

    const specialites = clean(b.specialites, 600).split(',').map((s) => s.trim()).filter(Boolean).slice(0, 10);
    const lat = num(b.latitude); const lng = num(b.longitude);
    const v = {
      nom_affiche: clean(b.nom_affiche, 160), metier: clean(b.metier, 80), specialites, description: clean(b.description, 3000),
      experience: Math.max(0, Math.min(60, num(b.experience) || 0)), telephone: clean(b.telephone, 40), whatsapp: clean(b.whatsapp, 40) || null,
      email: clean(b.email, 190) || null, pays: clean(b.pays, 60) || 'Togo', ville: clean(b.ville, 80), quartier: clean(b.quartier, 120) || null,
      latitude: lat != null && Math.abs(lat) <= 90 ? lat : null, longitude: lng != null && Math.abs(lng) <= 180 ? lng : null,
      rayon_km: Math.max(1, Math.min(500, num(b.rayon_km) || 10)), deplacement: b.deplacement !== 'false',
      // Pas de tarif affiché : le prix se négocie entre client et prestataire selon la tâche
      disponibilite: clean(b.disponibilite, 160) || null, tarif: null,
      cni_numero: clean(b.cni_numero, 60).toUpperCase(),
      qualif_type: b.qualif_type, qualif_intitule: clean(b.qualif_intitule, 200),
    };
    let photo = prev?.photo ?? null;
    if (file('photo')) { removePhoto(photo); photo = `/uploads/prestataires/${file('photo').filename}`; }
    if (b.retirer_photo === '1' && !file('photo')) { removePhoto(photo); photo = null; }

    // Nouveau document (CNI ou qualification) : l'ancien fichier est supprimé et le profil doit être revérifié
    const newCni = !!(file('cni_recto') || file('cni_verso'));
    const newQualif = !!file('qualif_fichier');
    const newDoc = newCni || newQualif;
    let cniRecto = prev?.cni_recto ?? null; let cniVerso = prev?.cni_verso ?? null; let qualif = prev?.qualif_fichier ?? null;
    if (file('cni_recto')) { removeCni(UPLOADS, cniRecto); cniRecto = file('cni_recto').filename; }
    if (file('cni_verso')) { removeCni(UPLOADS, cniVerso); cniVerso = file('cni_verso').filename; }
    if (newQualif) { removeCni(UPLOADS, qualif); qualif = file('qualif_fichier').filename; }

    const cols = [...Object.keys(v), 'photo', 'cni_recto', 'cni_verso', 'qualif_fichier'];
    const vals = [...Object.values(v), photo, cniRecto, cniVerso, qualif];
    const extra = ['conditions_acceptees_le=now()'];
    if (newCni) extra.push('cni_transmise_le=now()');
    if (newQualif) extra.push('qualif_transmise_le=now()');

    let row;
    if (prev) {
      // Profil refusé modifié, ou document changé : retour en validation
      const statut = prev.statut === 'refuse' || (newDoc && prev.statut !== 'suspendu') ? 'en_attente' : prev.statut;
      if (newDoc) extra.push('verifie=false', 'identite_verifiee_le=NULL', 'verifie_par=NULL');
      if (statut === 'en_attente') extra.push('motif_refus=NULL');
      row = (await query(`UPDATE prestataires SET ${cols.map((c, i) => `${c}=$${i + 1}`).join(', ')}, statut=$${cols.length + 1}, ${extra.join(', ')}, updated_at=now()
        WHERE id=$${cols.length + 2} RETURNING *`, [...vals, statut, prev.id])).rows[0];
    } else {
      row = (await query(`INSERT INTO prestataires (user_id, ${cols.join(', ')}, conditions_acceptees_le, cni_transmise_le, qualif_transmise_le)
        VALUES ($1, ${cols.map((_, i) => `$${i + 2}`).join(', ')}, now(), now(), now()) RETURNING *`, [req.user.id, ...vals])).rows[0];
    }
    // L'inscription vaut aussi acceptation des conditions côté client
    await query('UPDATE users SET quotidien_conditions_version = $1, quotidien_accepte_le = now() WHERE id = $2', [CONDITIONS_VERSION, req.user.id]);
    const message = row.statut === 'valide'
      ? 'Votre profil a bien été mis à jour.'
      : 'Votre profil a bien été enregistré. Notre équipe va vérifier votre pièce d’identité et votre diplôme ou attestation : votre profil sera visible dès sa validation.';
    res.status(prev ? 200 : 201).json({ message, profil: ownProfile(row) });
  }));

  router.delete('/mon-profil-prestataire', requireAuth, wrap(async (req, res) => {
    const { rows } = await query('DELETE FROM prestataires WHERE user_id = $1 RETURNING photo, cni_recto, cni_verso, qualif_fichier', [req.user.id]);
    removePhoto(rows[0]?.photo);
    removeCni(UPLOADS, rows[0]?.cni_recto); removeCni(UPLOADS, rows[0]?.cni_verso); removeCni(UPLOADS, rows[0]?.qualif_fichier);
    res.status(204).end();
  }));

  // ── Fiche publique d'un prestataire (+ coordonnées et avis)
  router.get('/prestataires/:id', requireQuotidien, wrap(async (req, res) => {
    const id = num(req.params.id);
    if (!id) return res.status(404).json({ message: 'Prestataire introuvable.' });
    const { rows } = await query(`SELECT ${PUBLIC_COLS}, p.telephone, p.whatsapp, p.email, p.latitude, p.longitude, p.user_id, p.statut,
      a.note, coalesce(a.nb_avis, 0) AS nb_avis FROM prestataires p ${NOTE_JOIN} WHERE p.id = $1`, [id]);
    const p = rows[0];
    // Un profil non validé n'est visible que par son propriétaire
    if (!p || (p.statut !== 'valide' && p.user_id !== req.user?.id)) return res.status(404).json({ message: 'Prestataire introuvable.' });
    if (p.user_id !== req.user?.id) query('UPDATE prestataires SET vues = vues + 1 WHERE id = $1', [id]).catch(() => {});
    const avis = await query(`SELECT a.id, a.note, a.commentaire, a.created_at, a.user_id, u.prenom, left(u.nom, 1) AS initiale
      FROM avis a JOIN users u ON u.id = a.user_id WHERE a.prestataire_id = $1 AND a.visible ORDER BY a.created_at DESC`, [id]);
    const repartition = [5, 4, 3, 2, 1].map((n) => ({ note: n, n: avis.rows.filter((x) => x.note === n).length }));
    const proprietaire = p.user_id === req.user?.id;
    delete p.user_id;
    res.json({ prestataire: p, avis: avis.rows.map(({ user_id: uid, ...x }) => ({ ...x, mien: uid === req.user?.id })), repartition, proprietaire });
  }));

  // ── Laisser (ou modifier) un avis
  router.post('/prestataires/:id/avis', requireQuotidien, wrap(async (req, res) => {
    const id = num(req.params.id);
    const note = num(req.body?.note);
    const commentaire = clean(req.body?.commentaire, 1500);
    const errors = {};
    if (!note || note < 1 || note > 5) errors.note = 'Choisissez une note de 1 à 5 étoiles.';
    if (commentaire.length < 10) errors.commentaire = 'Décrivez votre expérience en quelques mots (10 caractères minimum).';
    if (Object.keys(errors).length) return res.status(422).json({ errors });
    const { rows } = await query("SELECT user_id FROM prestataires WHERE id = $1 AND statut = 'valide'", [id]);
    if (!rows[0]) return res.status(404).json({ message: 'Prestataire introuvable.' });
    if (rows[0].user_id === req.user.id) return res.status(422).json({ errors: { note: 'Vous ne pouvez pas noter votre propre profil.' } });
    await query(`INSERT INTO avis (prestataire_id, user_id, note, commentaire) VALUES ($1, $2, $3, $4)
      ON CONFLICT (prestataire_id, user_id) DO UPDATE SET note = EXCLUDED.note, commentaire = EXCLUDED.commentaire, created_at = now()`,
    [id, req.user.id, note, commentaire]);
    res.status(201).json({ message: 'Merci ! Votre avis a bien été publié.' });
  }));

  return router;
}
