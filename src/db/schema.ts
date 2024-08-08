import { pgTable, serial, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['open', 'paid', 'void', 'uncollectible']);

export const Invoices = pgTable('invoices', {
  id: serial('id').primaryKey().notNull(),
  create_ts: timestamp('create_ts').defaultNow().notNull(),
  user_id: text('user_id').notNull(),
  description: text('description').notNull(),
  status: statusEnum('status').notNull(),
  value: integer('value').notNull(),
});