// Annuaire des prestataires : recherche publique, fiche, avis, et profil du professionnel connecté
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
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
  p.rayon_km, p.deplacement, p.disponibilite, p.tarif, p.photo, p.verifie, p.created_at`;
const NOTE_JOIN = `LEFT JOIN (SELECT prestataire_id, round(avg(note)::numeric, 1)::float AS note, count(*)::int AS nb_avis
  FROM avis WHERE visible GROUP BY prestataire_id) a ON a.prestataire_id = p.id`;

const num = (v) => (v === '' || v == null || Number.isNaN(Number(v)) ? null : Number(v));
const clean = (v, max = 255) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function prestatairesRouter({ UPLOADS, requireAuth, optionalAuth }) {
  const router = express.Router();
  const PHOTOS = path.join(UPLOADS, 'prestataires');
  fs.mkdirSync(PHOTOS, { recursive: true });
  const upload = multer({
    storage: multer.diskStorage({
      destination: PHOTOS,
      filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname).toLowerCase()}`),
    }),
    limits: { fileSize: 4 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => cb(null, /^image\/(png|jpe?g|webp)$/.test(file.mimetype)),
  });
  const removePhoto = (p) => { if (p?.startsWith('/uploads/prestataires/')) fs.rm(path.join(PHOTOS, path.basename(p)), { force: true }, () => {}); };

  // ── Recherche publique
  router.get('/prestataires', wrap(async (req, res) => {
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
  router.get('/prestataires/filtres', wrap(async (_req, res) => {
    const metiers = await query("SELECT metier, count(*)::int AS n FROM prestataires WHERE statut='valide' GROUP BY metier ORDER BY n DESC, metier");
    const villes = await query("SELECT ville, count(*)::int AS n FROM prestataires WHERE statut='valide' GROUP BY ville ORDER BY n DESC, ville");
    const total = await query("SELECT count(*)::int AS n FROM prestataires WHERE statut='valide'");
    res.json({ metiers: metiers.rows, villes: villes.rows, total: total.rows[0].n });
  }));

  // ── Profil du professionnel connecté
  router.get('/mon-profil-prestataire', requireAuth, wrap(async (req, res) => {
    const { rows } = await query(`SELECT p.*, a.note, coalesce(a.nb_avis, 0) AS nb_avis FROM prestataires p ${NOTE_JOIN} WHERE p.user_id = $1`, [req.user.id]);
    res.json({ profil: rows[0] || null });
  }));

  router.post('/mon-profil-prestataire', requireAuth, upload.single('photo'), wrap(async (req, res) => {
    const b = req.body || {};
    const errors = {};
    const need = { nom_affiche: 'Le nom affiché', metier: 'Le métier', description: 'La présentation', telephone: 'Le téléphone', ville: 'La ville' };
    for (const [k, l] of Object.entries(need)) if (!clean(b[k])) errors[k] = `${l} est obligatoire.`;
    if (clean(b.description, 3000).length && clean(b.description, 3000).length < 30) errors.description = 'Décrivez votre activité en au moins 30 caractères.';
    if (b.email && !/^\S+@\S+\.\S+$/.test(b.email)) errors.email = "L'adresse email n'est pas valide.";
    if (Object.keys(errors).length) { if (req.file) removePhoto(`/uploads/prestataires/${req.file.filename}`); return res.status(422).json({ errors }); }

    const specialites = clean(b.specialites, 600).split(',').map((s) => s.trim()).filter(Boolean).slice(0, 10);
    const lat = num(b.latitude); const lng = num(b.longitude);
    const v = {
      nom_affiche: clean(b.nom_affiche, 160), metier: clean(b.metier, 80), specialites, description: clean(b.description, 3000),
      experience: Math.max(0, Math.min(60, num(b.experience) || 0)), telephone: clean(b.telephone, 40), whatsapp: clean(b.whatsapp, 40) || null,
      email: clean(b.email, 190) || null, pays: clean(b.pays, 60) || 'Togo', ville: clean(b.ville, 80), quartier: clean(b.quartier, 120) || null,
      latitude: lat != null && Math.abs(lat) <= 90 ? lat : null, longitude: lng != null && Math.abs(lng) <= 180 ? lng : null,
      rayon_km: Math.max(1, Math.min(500, num(b.rayon_km) || 10)), deplacement: b.deplacement !== 'false',
      disponibilite: clean(b.disponibilite, 160) || null, tarif: clean(b.tarif, 160) || null,
    };
    const prev = (await query('SELECT id, photo, statut FROM prestataires WHERE user_id = $1', [req.user.id])).rows[0];
    let photo = prev?.photo ?? null;
    if (req.file) { removePhoto(photo); photo = `/uploads/prestataires/${req.file.filename}`; }
    if (b.retirer_photo === '1' && !req.file) { removePhoto(photo); photo = null; }
    const cols = [...Object.keys(v), 'photo'];
    const vals = [...Object.values(v), photo];

    let row;
    if (prev) {
      // Un profil refusé repasse en validation après modification
      const statut = prev.statut === 'refuse' ? 'en_attente' : prev.statut;
      row = (await query(`UPDATE prestataires SET ${cols.map((c, i) => `${c}=$${i + 1}`).join(', ')}, statut=$${cols.length + 1}, updated_at=now()
        WHERE id=$${cols.length + 2} RETURNING *`, [...vals, statut, prev.id])).rows[0];
    } else {
      row = (await query(`INSERT INTO prestataires (user_id, ${cols.join(', ')}) VALUES ($1, ${cols.map((_, i) => `$${i + 2}`).join(', ')}) RETURNING *`,
        [req.user.id, ...vals])).rows[0];
    }
    const message = row.statut === 'valide'
      ? 'Votre profil a bien été mis à jour.'
      : 'Votre profil a bien été enregistré. Il sera visible dans l’annuaire dès sa validation par notre équipe.';
    res.status(prev ? 200 : 201).json({ message, profil: row });
  }));

  router.delete('/mon-profil-prestataire', requireAuth, wrap(async (req, res) => {
    const { rows } = await query('DELETE FROM prestataires WHERE user_id = $1 RETURNING photo', [req.user.id]);
    removePhoto(rows[0]?.photo);
    res.status(204).end();
  }));

  // ── Fiche publique d'un prestataire (+ coordonnées et avis)
  router.get('/prestataires/:id', optionalAuth, wrap(async (req, res) => {
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
  router.post('/prestataires/:id/avis', requireAuth, wrap(async (req, res) => {
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
