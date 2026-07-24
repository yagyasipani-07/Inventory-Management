'use client';

import { useState, useMemo } from 'react';
import { useChallans } from '../_hooks/useChallans';
import { Challan } from '../_services/challanService';
import { ChallanSummaryCards } from './ChallanSummaryCards';
import { ChallanToolbar } from './ChallanToolbar';
import { ChallanTable } from './ChallanTable';
import { ChallanSkeleton } from './ChallanSkeleton';
import { ChallanEmptyState } from './ChallanEmptyState';
import { ChallanError } from './ChallanError';
import { DeleteChallanDialog } from './DeleteChallanDialog';
import { useRouter } from 'next/navigation';

export function ChallanClient() {
  const router = useRouter();
  const { data: challans, isLoading, error, refetch } = useChallans();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  
  const [challanToDelete, setChallanToDelete] = useState<Challan | null>(null);

  const uniqueCustomers = useMemo(() => {
    if (!challans) return [];
    const customers = new Set(challans.map(c => c.customerName));
    return Array.from(customers).sort();
  }, [challans]);

  const filteredChallans = useMemo(() => {
    if (!challans) return [];

    return challans.filter((challan) => {
      // 1. Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          challan.challanNumber.toLowerCase().includes(query) ||
          challan.customerName.toLowerCase().includes(query) ||
          challan.items.some(item => item.productName.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // 2. Status filter
      if (statusFilter !== 'all') {
        if (challan.status !== statusFilter) return false;
      }

      // 3. Customer filter
      if (customerFilter !== 'all') {
        if (challan.customerName !== customerFilter) return false;
      }

      return true;
    });
  }, [challans, searchQuery, statusFilter, customerFilter]);

  if (isLoading) {
    return <ChallanSkeleton />;
  }

  if (error) {
    return <ChallanError onRetry={() => refetch()} />;
  }

  if (!challans || challans.length === 0) {
    return <ChallanEmptyState />;
  }

  return (
    <div className="space-y-6">
      <ChallanSummaryCards challans={challans} />
      
      <div className="space-y-4">
        <ChallanToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          customerFilter={customerFilter}
          onCustomerFilterChange={setCustomerFilter}
          onRefresh={() => refetch()}
          uniqueCustomers={uniqueCustomers}
        />

        <ChallanTable 
          data={filteredChallans} 
          onDelete={setChallanToDelete}
        />
      </div>

      {challanToDelete && (
        <DeleteChallanDialog
          challanId={challanToDelete.id}
          isOpen={!!challanToDelete}
          onOpenChange={(open) => !open && setChallanToDelete(null)}
        />
      )}
    </div>
  );
}
