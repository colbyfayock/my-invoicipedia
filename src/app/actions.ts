'use server';

import { redirect } from 'next/navigation';

import { Invoices } from '@/db/schema';
import { db } from '@/db';
import { auth } from '@clerk/nextjs/server';

/**
 * createInvoice
 */

export async function createInvoice(formData: FormData) {
  const { userId } = auth()

  if ( !userId ) throw new Error('User not found');

  const description = formData.get('description') as string;
  const value = Math.floor(parseFloat(formData.get('value') as string) * 100);  

  const results = await db.insert(Invoices)
    .values({
      user_id: userId,
      description,
      status: 'open',
      value,
    }).returning({
      id: Invoices.id,
    });

  redirect(`/invoices/${results[0].id}`);
}