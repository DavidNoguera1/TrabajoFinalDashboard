import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

export const neonPool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false
});

neonPool.on('error', (err: Error) => {
  console.error('Error inesperado en el pool de Neon', err);
});

export const testNeonConnection = async (): Promise<void> => {
  await neonPool.query('SELECT 1');
};
