'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';

import { Invoices, Status } from '@/db/schema';
import { db } from '@/db';

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

/**
 * updateStatus
 */

export async function updateStatus(formData: FormData) {
  const { userId } = auth()

  if ( !userId ) throw new Error('User not found');

  const id = formData.get('id') as string;
  const status = formData.get('status') as Status;

  await db.update(Invoices)
    .set({ status })
    .where(
      and(
        eq(Invoices.id, parseInt(id)),
        eq(Invoices.user_id, userId)
      )
    );

  revalidatePath(`/invoices/${id}`, 'page');
}

/**
 * deleteInvoice
 */

export async function deleteInvoice(formData: FormData) {
  const { userId } = auth()

  if ( !userId ) throw new Error('User not found');

  const id = formData.get('id') as string;

  await db.delete(Invoices)
    .where(
      and(
        eq(Invoices.id, parseInt(id)),
        eq(Invoices.user_id, userId)
      )
    );

  redirect('/dashboard');
}