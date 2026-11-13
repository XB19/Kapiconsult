// Crée la base (si besoin), le schéma et charge le contenu du site : `npm run db:setup`
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const dir = path.dirname(fileURLToPath(import.meta.url));
const cfg = {
  host: process.env.PGHOST, port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER, password: process.env.PGPASSWORD,
};
const dbName = process.env.PGDATABASE;

async function ensureDatabase() {
  const admin = new pg.Client({ ...cfg, database: 'postgres' });
  await admin.connect();
  const { rowCount } = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
  if (!rowCount) {
    await admin.query(`CREATE DATABASE "${dbName.replace(/"/g, '')}" ENCODING 'UTF8'`);
    console.log(`Base « ${dbName} » créée`);
  }
  await admin.end();
}

async function main() {
  await ensureDatabase();
  const db = new pg.Client({ ...cfg, database: dbName });
  await db.connect();
  await db.query(fs.readFileSync(path.join(dir, 'schema.sql'), 'utf8'));

  // Administrateur initial (Docker) : créé seulement si aucun admin n'existe
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const { rowCount } = await db.query("SELECT 1 FROM users WHERE role='admin'");
    if (!rowCount) {
      const bcrypt = (await import('bcryptjs')).default;
      await db.query(
        "INSERT INTO users (prenom, nom, email, password_hash, role) VALUES ('Administrateur', 'Kapi Consult', lower($1), $2, 'admin') ON CONFLICT (email) DO UPDATE SET role='admin'",
        [process.env.ADMIN_EMAIL, await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)],
      );
      console.log(`Administrateur initial créé : ${process.env.ADMIN_EMAIL}`);
    }
  }

  // Le contenu d'origine n'est chargé que dans une base vide (ou avec --force),
  // pour ne jamais écraser les modifications faites depuis l'administration.
  const force = process.argv.includes('--force');
  const { rows: [{ n }] } = await db.query('SELECT count(*)::int AS n FROM articles');
  if (n > 0 && !force) {
    console.log('Base déjà remplie : contenu conservé (utilisez --force pour réinitialiser).');
    await db.end();
    return;
  }

  const data = JSON.parse(fs.readFileSync(path.join(dir, 'seed-data.json'), 'utf8'));
  await db.query('BEGIN');
  try {
    await db.query('TRUNCATE articles, produits, offres, faqs RESTART IDENTITY CASCADE');
    for (const a of data.articles) {
      await db.query(
        `INSERT INTO articles (slug,type,badge,category,title,content,image,card_image,author,position,published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [a.slug, a.type, a.badge, a.category || '', a.title, a.content, a.image, a.card_image, a.author, a.position ?? null, a.published_at],
      );
    }
    for (const p of data.produits) {
      await db.query(
        `INSERT INTO produits (slug,categorie,nom,description,image,prix,contact_tel,contact_email,position)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [p.slug, p.categorie, p.nom, p.description, p.image, p.prix, p.contact_tel, p.contact_email, p.position],
      );
    }
    for (const o of data.offres) {
      await db.query(
        `INSERT INTO offres (titre,type_contrat,lieu,experience,published_at,date_limite) VALUES ($1,$2,$3,$4,$5,$6)`,
        [o.titre, o.type_contrat, o.lieu, o.experience, o.published_at, o.date_limite],
      );
    }
    for (const f of data.faqs) {
      await db.query('INSERT INTO faqs (categorie,question,reponse,position) VALUES ($1,$2,$3,$4)', [f.categorie, f.question, f.reponse, f.position]);
    }
    await db.query('COMMIT');
  } catch (e) {
    await db.query('ROLLBACK');
    throw e;
  }
  const counts = await db.query(`SELECT (SELECT count(*) FROM articles) a, (SELECT count(*) FROM produits) p,
                                        (SELECT count(*) FROM offres) o, (SELECT count(*) FROM faqs) f`);
  console.log('Contenu chargé :', counts.rows[0]);
  await db.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
