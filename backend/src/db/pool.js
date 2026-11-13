import 'dotenv/config';
import pg from 'pg';

// Les colonnes DATE sont renvoyées telles quelles ("YYYY-MM-DD") pour éviter les décalages de fuseau
pg.types.setTypeParser(1082, (v) => v);

export const pool = new pg.Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

export const query = (text, params) => pool.query(text, params);
