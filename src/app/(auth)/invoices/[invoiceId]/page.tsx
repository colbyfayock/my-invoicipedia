import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronDown, CreditCard, Ellipsis, Trash } from 'lucide-react';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

import { cn } from '@/lib/utils';
import { db } from '@/db';
import { Invoices } from '@/db/schema';
import { updateStatus } from '@/app/actions';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import Container from '@/components/Container';

import { AVAILABLE_STATUSES } from '@/data/invoices';

export default async function InvoicePage({ params }: { params: { invoiceId: string } }) {
  const invoiceId = parseInt(params.invoiceId);

  const { userId } = auth();

  if ( !userId ) return null;

  // Could just 404, but good example
  
  if ( isNaN(invoiceId) ) {
    throw new Error('Invalid invoice ID');
  }

  const [invoice] = await db.select().from(Invoices)
    .where(
      and(
        eq(Invoices.id, invoiceId),
        eq(Invoices.user_id, userId),
      )
    ).limit(1);

  if ( !invoice ) {
    notFound();
  }

  const status = AVAILABLE_STATUSES.find(status => status.id === invoice.status);
  
  return (
    <Container>
      <p className="text-sm font-semibold text-blue-600 mb-2">
        <Link href="/dashboard">Invoices</Link>
      </p>

      <div className="flex justify-between items-center w-full mb-8">
        <div>
          <h2 className="flex items-center gap-4 text-3xl font-semibold">
            Invoice { invoice.id }
            <Badge
              className={cn(
                'text-sm',
                status?.id === 'open' && 'bg-blue-600',
                status?.id === 'paid' && 'bg-green-600',
                status?.id === 'void' && 'bg-zinc-700',
                status?.id === 'uncollectible' && 'bg-red-600',
              )}
            >
              { status?.label || 'Unknown' }
            </Badge>
          </h2>
          <p className="text-sm">
            { new Date(invoice.create_ts).toLocaleDateString() }
          </p>
        </div>

        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                Change Status
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {AVAILABLE_STATUSES.map(status => {
                return (
                  <DropdownMenuItem key={status.id} className="p-0">
                    <form action={updateStatus} className="w-full h-full">
                      <input type="hidden" name="id" value={invoice.id} />
                      <input type="hidden" name="status" value={status.id} />
                      <button className="block w-full text-left py-1.5 px-2" type="submit">
                        { status.label }
                      </button>
                    </form>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <span className="sr-only">Manage Invoice</span>
                  <Ellipsis className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex gap-2 items-center py-2 px-2.5" asChild>
                  <Link href={`/invoices/${invoice.id}/payment`}>
                    <CreditCard className="w-4 h-4" /> Payment
                  </Link>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="flex gap-2 items-center py-2 px-2.5">
                    <Trash className="w-4 h-4" /> Delete Invoice
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent className="gap-5 py-7 px-8">
              <DialogHeader>
                <DialogTitle className="mb-1 text-xl">
                  Are you sure?
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to <strong>permanently delete this invoice</strong>?
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Delete Invoice</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <p className="text-3xl mb-3">
        ${ invoice.value / 100 }
      </p>

      <p className="text-lg mb-8">
        { invoice.description }
      </p>

      <h2 className="font-bold text-lg mb-4">
        Billing Details
      </h2>

      <ul className="grid gap-2">
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice ID</strong>
          <span>{ invoice.id }</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice Date</strong>
          <span>{ new Date(invoice.create_ts).toLocaleDateString() }</span>
        </li>
        {/* <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Name</strong>
          <span>{ invoice.customer.name }</span>
        </li> */}
        {/* <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Email</strong>
          <span>{ invoice.customer.email }</span>
        </li> */}
      </ul>
    </Container>
  );
}