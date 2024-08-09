import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { Invoices, Customers } from './schema';

const pool = new Pool({
  connectionString: process.env.XATA_DATABASE_URL
});

export const db = drizzle(pool, {
  schema: { Invoices, Customers }
});