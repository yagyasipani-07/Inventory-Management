import { Users } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';

export function CustomerEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-card border-dashed">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Users className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">No Customers Found</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm">
        Create your first customer to begin dispatch operations.
      </p>
      <Button asChild>
        <Link href="/customers/new">
          Add Customer
        </Link>
      </Button>
    </div>
  );
}
