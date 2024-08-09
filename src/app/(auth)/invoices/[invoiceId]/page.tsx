import { notFound } from 'next/navigation';
import { eq, and, isNull } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/db';
import { Customers, Invoices } from '@/db/schema';

import Invoice from './Invoice';

export default async function InvoicePage({ params }: { params: { invoiceId: string } }) {
  const invoiceId = parseInt(params.invoiceId);

  const { userId, orgId } = auth();

  if ( !userId ) return null;

  // Could just 404, but good example
  
  if ( isNaN(invoiceId) ) {
    throw new Error('Invalid invoice ID');
  }

  let result;

  if ( orgId ) {
    [result] = await db.select().from(Invoices)
      .innerJoin(Customers, eq(Invoices.customer_id, Customers.id))
      .where(
        and(
          eq(Invoices.id, parseInt(params.invoiceId)),
          eq(Invoices.organization_id, orgId)
        )
      )
      .limit(1);
  } else {
    [result] = await db.select().from(Invoices)
      .innerJoin(Customers, eq(Invoices.customer_id, Customers.id))
      .where(
        and(
          eq(Invoices.id, parseInt(params.invoiceId)),
          eq(Invoices.user_id, userId),
          isNull(Invoices.organization_id)
        )
      )
      .limit(1);
  }

  if ( !result ) {
    notFound();
  }

  const invoice = {
    ...result.invoices,
    customer: result.customers
  }
  
  return (
    <Invoice invoice={invoice} />
  );
}