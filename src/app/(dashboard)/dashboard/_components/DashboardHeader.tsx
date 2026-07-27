'use client';

import { PageHeader } from '@/src/components/shared/page-header';
import { Button } from '@/src/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export function DashboardHeader() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries();
    setTimeout(() => setIsRefreshing(false), 800); // UI feedback
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <PageHeader
      title="Dashboard"
      description="Warehouse Inventory Overview"
    >
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden sm:inline-block" suppressHydrationWarning>
          {currentDate}
        </span>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-12 w-12 px-0 sm:h-9 sm:w-auto sm:px-3"
        >
          <RefreshCcw className={`h-5 w-5 sm:h-4 sm:w-4 sm:mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh Data</span>
        </Button>
      </div>
    </PageHeader>
  );
}
