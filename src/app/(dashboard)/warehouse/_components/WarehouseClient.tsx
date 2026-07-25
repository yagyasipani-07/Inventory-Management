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
import { printPdfReport } from '@/src/lib/export/printPdf';

export function WarehouseClient() {
  const { data: stock, isLoading: isStockLoading, error: stockError, refetch: refetchStock } = useWarehouseStock();
  const { data: summary, isLoading: isSummaryLoading, error: summaryError, refetch: refetchSummary } = useWarehouseSummary();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<WarehouseItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const filteredStock = useMemo(() => {
    if (!stock) return [];

    return stock.filter((item) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = item.name.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [stock, searchQuery]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const rows = filteredStock.map((item) => ({
        Code: item.code,
        Name: item.name,
        Dimensions: item.size,
        Thickness: item.thickness,
        'Current Stock': item.currentStock,
        'Available Stock': item.availableStock,
        'Minimum Stock': item.minStock,
        Unit: item.unit,
      }));
      printPdfReport('Warehouse Stock Report', rows, `warehouse-stock-${new Date().toISOString().split('T')[0]}`);
      toast.success("Warehouse stock PDF opened.");
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
