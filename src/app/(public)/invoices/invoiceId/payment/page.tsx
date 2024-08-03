import { Check, CreditCard } from 'lucide-react';

import { cn } from '@/lib/utils';

import Container from '@/components/Container';
import { Badge } from '@/components/ui/Badge';

import { AVAILABLE_STATUSES } from '@/data/invoices';
import { Button } from '@/components/ui/Button';

export default async function Invoice() {
  const invoice = {
    id: 1,
    name: 'Sample Invoice',
    dateCreated: Date.now(),
    value: 1234,
    description: 'This is a sample invoice.',
    status: 'open'
  };
  
  const status = AVAILABLE_STATUSES.find(status => status.id === invoice.status);

  return (
    <Container>
      <div className="flex justify-between items-center w-full mb-8">
        <div>
          <h2 className="flex items-center gap-4 text-3xl font-semibold">
            Invoice { invoice.id }
            <Badge
              className={cn(
                "text-sm",
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
            { new Date(invoice.dateCreated).toLocaleDateString() }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12">
        <div>
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
              <span>{ new Date(invoice.dateCreated).toLocaleDateString() }</span>
            </li>
            <li className="flex gap-4">
              <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Name</strong>
              <span>{ invoice.name }</span>
            </li>
          </ul>
        </div>
        <div>
          {invoice.status === 'open' && (
            <>
              <h2 className="text-xl font-bold mb-4">
                Manage Invoice
              </h2>
              <Button className="flex gap-2 items-center font-bold bg-green-700" type="submit" size="lg">
                <CreditCard className="w-5 h-5" />
                Pay Invoice
              </Button>
            </>
          )}
          {invoice.status === 'paid' && (
            <>
              <h2 className="flex gap-3 items-center text-2xl font-semibold mb-2 -ml-1">
                <Check className="w-8 h-8 rounded-full bg-green-500 text-white p-1" />
                Invoice paid.
              </h2>
              <p>No further action required!</p>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
