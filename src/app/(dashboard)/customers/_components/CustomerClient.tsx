'use client';

import { useState, useMemo } from 'react';
import { useCustomers } from '../_hooks/useCustomers';
import { Customer } from '../_services/customerService';
import { CustomerSummaryCards } from './CustomerSummaryCards';
import { CustomerToolbar } from './CustomerToolbar';
import { CustomerTable } from './CustomerTable';
import { CustomerSkeleton } from './CustomerSkeleton';
import { CustomerEmptyState } from './CustomerEmptyState';
import { CustomerError } from './CustomerError';
import { CustomerDetailsSheet } from './CustomerDetailsSheet';
import { DeleteCustomerDialog } from './DeleteCustomerDialog';
import { useRouter } from 'next/navigation';

export function CustomerClient() {
  const router = useRouter();
  const { data: customers, isLoading, error, refetch } = useCustomers();

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const uniqueCities = useMemo(() => {
    if (!customers) return [];
    const cities = new Set(customers.map(c => c.city));
    return Array.from(cities).sort();
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];

    return customers.filter((customer) => {
      // 1. Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          customer.name.toLowerCase().includes(query) ||
          customer.city.toLowerCase().includes(query) ||
          customer.phone.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      if (cityFilter !== 'all') {
        if (customer.city !== cityFilter) return false;
      }

      return true;
    });
  }, [customers, searchQuery, cityFilter]);

  if (isLoading) {
    return <CustomerSkeleton />;
  }

  if (error) {
    return <CustomerError onRetry={() => refetch()} />;
  }

  if (!customers || customers.length === 0) {
    return <CustomerEmptyState />;
  }

  return (
    <div className="space-y-6">
      <CustomerSummaryCards customers={customers} />
      
      <div className="space-y-4">
        <CustomerToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          cityFilter={cityFilter}
          onCityFilterChange={setCityFilter}
          onRefresh={() => refetch()}
          uniqueCities={uniqueCities}
        />

        <CustomerTable 
          data={filteredCustomers} 
          onViewDetails={setSelectedCustomer}
          onEdit={(c) => router.push(`/customers/${c.id}/edit`)}
          onDelete={setCustomerToDelete}
        />
      </div>

      <CustomerDetailsSheet
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />

      {customerToDelete && (
        <DeleteCustomerDialog
          customerId={customerToDelete.id}
          isOpen={!!customerToDelete}
          onOpenChange={(open) => !open && setCustomerToDelete(null)}
        />
      )}
    </div>
  );
}
