'use server';

import { redirect } from 'next/navigation';

import { Invoices } from '@/db/schema';
import { db } from '@/db';

/**
 * createInvoice
 */

export async function createInvoice(formData: FormData) {
  const description = formData.get('description') as string;
  const value = Math.floor(parseFloat(formData.get('value') as string) * 100);  

  const results = await db.insert(Invoices)
    .values({
      description,
      status: 'open',
      value,
    }).returning({
      id: Invoices.id,
    });

  redirect(`/invoices/${results[0].id}`);
}