'use client';

import { useState } from 'react';
import { InventoryHeader } from './_components/InventoryHeader';
import { InventoryTable } from './_components/InventoryTable';
import { InventoryEmptyState } from './_components/InventoryEmptyState';
import { InventoryError } from './_components/InventoryError';
import { InventoryTableSkeleton } from './_components/InventorySkeleton';
import { useProducts } from './_hooks/useProducts';
import { StockAdjustmentDialog } from './_components/StockAdjustmentDialog';
import { DeleteProductDialog } from './_components/DeleteProductDialog';
import { Product } from './_services/inventoryService';

export default function InventoryPage() {
  const { data: products, isLoading, isError, refetch } = useProducts();

  const [stockDialogProduct, setStockDialogProduct] = useState<Product | null>(null);
  const [deleteDialogProduct, setDeleteDialogProduct] = useState<Product | null>(null);

  if (isError) {
    return (
      <div className="max-w-[1600px] mx-auto pb-8 space-y-6">
        <InventoryHeader />
        <InventoryError onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-8 space-y-6">
      <InventoryHeader />

      {isLoading ? (
        <InventoryTableSkeleton />
      ) : products?.length === 0 ? (
        <InventoryEmptyState />
      ) : (
        <InventoryTable 
          data={products || []} 
          onAdjustStock={(p) => setStockDialogProduct(p)}
          onDelete={(p) => setDeleteDialogProduct(p)}
        />
      )}

      {/* Dialogs */}
      <StockAdjustmentDialog
        productId={stockDialogProduct?.id || null}
        productName={stockDialogProduct?.name || ''}
        currentStock={stockDialogProduct?.currentStock || 0}
        isOpen={!!stockDialogProduct}
        onOpenChange={(open) => !open && setStockDialogProduct(null)}
      />

      <DeleteProductDialog
        productId={deleteDialogProduct?.id || null}
        productName={deleteDialogProduct?.name || ''}
        isOpen={!!deleteDialogProduct}
        onOpenChange={(open) => !open && setDeleteDialogProduct(null)}
      />
    </div>
  );
}
