import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { eq, and, isNull } from 'drizzle-orm';

import { cn } from '@/lib/utils';
import { AVAILABLE_STATUSES } from '@/data/invoices';

import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import Container from '@/components/Container';
import { db } from '@/db';
import { Customers, Invoices } from '@/db/schema';

export default async function Dashboard() {
  const { userId, orgId } = auth();

  if ( !userId ) return null;

  let results;

  if ( orgId ) {
    results = await db.select().from(Invoices)
      .innerJoin(Customers, eq(Invoices.customer_id, Customers.id))
      .where(eq(Invoices.organization_id, orgId));
  } else {
    results = await db.select().from(Invoices)
      .innerJoin(Customers, eq(Invoices.customer_id, Customers.id))
      .where(
        and(
          eq(Invoices.user_id, userId),
          isNull(Invoices.organization_id)
        )
      );
  }

  const invoices = results?.map(({ invoices, customers}) => {
    return {
      ...invoices,
      customer: customers
    }
  });

  return (
    <Container>
      <div className="flex justify-between items-center w-full mb-6">
        <h2 className="text-3xl font-semibold">
          Invoices
        </h2>
        <ul>
          <li>
            <Link href="/invoices/new" className="flex items-center gap-2 text-sm hover:text-blue-500">
              <PlusCircle className="w-4 h-4" />
              Create Invoice
            </Link>
          </li>
        </ul>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.map(invoice => {
            const status = AVAILABLE_STATUSES.find(status => status.id === invoice.status);
            return (
              <TableRow key={invoice.id}>
                <TableCell className="hidden md:table-cell p-0">
                  <Link href={`/invoices/${invoice.id}`} className="block p-4">
                    { new Date(invoice.create_ts).toLocaleDateString() }
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link href={`/invoices/${invoice.id}`} className="block p-4">
                    <p className="font-medium">
                      { invoice.customer.name }
                    </p>
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link href={`/invoices/${invoice.id}`} className="block p-4">
                    <p className="text-muted-foreground">
                      { invoice.customer.email }
                    </p>
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell p-0">
                  <Link href={`/invoices/${invoice.id}`} className="block p-4">
                    <Badge
                      className={cn(
                        "text-xs",
                        status?.id === 'open' && 'bg-blue-600',
                        status?.id === 'paid' && 'bg-green-600',
                        status?.id === 'void' && 'bg-zinc-700',
                        status?.id === 'uncollectible' && 'bg-red-600',
                      )}
                    >
                      { status?.label || 'Unknown' }
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className="text-right p-0">
                  <Link href={`/invoices/${invoice.id}`} className="block p-4">
                    ${ invoice.value / 100 }
                  </Link>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Container>
  );
}
