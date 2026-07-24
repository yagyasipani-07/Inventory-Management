'use client';

import { useState, useMemo } from 'react';
import { useWarehouseStock, useWarehouseSummary } from '../_hooks/useWarehouse';
import { warehouseService, WarehouseItem } from '../_services/warehouseService';
import { WarehouseSummaryCards } from './WarehouseSummaryCards';
import { WarehouseToolbar } from './WarehouseToolbar';
import { WarehouseTable } from './WarehouseTable';
import { WarehouseSkeleton } from './WarehouseSkeleton';
import { WarehouseEmptyState } from './WarehouseEmptyState';
import { WarehouseError } from './WarehouseError';
import { WarehouseDetailsSheet } from './WarehouseDetailsSheet';
import { toast } from 'sonner';

export function WarehouseClient() {
  const { data: stock, isLoading: isStockLoading, error: stockError, refetch: refetchStock } = useWarehouseStock();
  const { data: summary, isLoading: isSummaryLoading, error: summaryError, refetch: refetchSummary } = useWarehouseSummary();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  
  const [selectedProduct, setSelectedProduct] = useState<WarehouseItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const filteredStock = useMemo(() => {
    if (!stock) return [];

    return stock.filter((item) => {
      // 1. Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          item.code.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.size.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // 2. Status filter
      if (statusFilter !== 'all') {
        const isOutOfStock = item.availableStock === 0;
        const isCritical = !isOutOfStock && item.availableStock < item.minStock;
        const isWarning = item.availableStock === item.minStock;
        const isHealthy = item.availableStock > item.minStock;

        if (statusFilter === 'out_of_stock' && !isOutOfStock) return false;
        if (statusFilter === 'critical' && !isCritical) return false;
        if (statusFilter === 'warning' && !isWarning) return false;
        if (statusFilter === 'healthy' && !isHealthy) return false;
      }

      // 3. Zone filter
      if (zoneFilter !== 'all') {
        if (!item.location.toLowerCase().startsWith(zoneFilter.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [stock, searchQuery, statusFilter, zoneFilter]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await warehouseService.exportWarehouse(filteredStock);
      toast.success("Warehouse stock data exported to Excel.");
    } catch (error) {
      toast.error("There was an error exporting the warehouse data.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    refetchStock();
    refetchSummary();
  };

  const handleStockAdjusted = () => {
    handleRefresh();
  };

  if (isStockLoading || isSummaryLoading) {
    return <WarehouseSkeleton />;
  }

  if (stockError || summaryError) {
    return <WarehouseError onRetry={handleRefresh} />;
  }

  if (!stock || stock.length === 0) {
    return <WarehouseEmptyState />;
  }

  return (
    <div className="space-y-6">
      {summary && <WarehouseSummaryCards summary={summary} />}
      
      <div className="space-y-4">
        <WarehouseToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          zoneFilter={zoneFilter}
          onZoneFilterChange={setZoneFilter}
          onExport={handleExport}
          onRefresh={handleRefresh}
          isExporting={isExporting}
        />

        <WarehouseTable 
          data={filteredStock} 
          onViewDetails={setSelectedProduct} 
        />
      </div>

      <WarehouseDetailsSheet
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onStockAdjusted={handleStockAdjusted}
      />
    </div>
  );
}
