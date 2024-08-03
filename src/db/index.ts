import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.XATA_DATABASE_URL
});

export const db = drizzle(pool);