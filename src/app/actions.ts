'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';

import { Customers, Invoices, Status } from '@/db/schema';
import { db } from '@/db';

/**
 * createInvoice
 */

export async function createInvoice(formData: FormData) {
  const { userId } = auth()

  if ( !userId ) throw new Error('User not found');

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const description = formData.get('description') as string;
  const value = Math.floor(parseFloat(formData.get('value') as string) * 100);

  // Create a customer

  const customer = await db.insert(Customers)
    .values({
      name,
      email,
      user_id: userId,
    }).returning({
      id: Customers.id
    });

  const results = await db.insert(Invoices)
    .values({
      user_id: userId,
      customer_id: customer[0].id,
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

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const id = formData.get('id') as string;
  const status = formData.get('status') as Status;

    // Create a customer

  const customer = await db.insert(Customers)
    .values({
      name,
      email,
      user_id: userId,
    }).returning({
      id: Customers.id
    });

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