import { useState } from 'react';
import { WarehouseItem } from '../_services/warehouseService';
import { useStockMovement } from '../_hooks/useWarehouse';
import { StockMovementTimeline } from './StockMovementTimeline';
import { StockAdjustmentDialog } from '../../inventory/_components/StockAdjustmentDialog';
import { Button } from '@/src/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/src/components/ui/sheet';
import Link from 'next/link';
import { ArrowRightLeft, ExternalLink, Box, Ruler } from 'lucide-react';
import { ScrollArea } from '@/src/components/ui/scroll-area';

interface WarehouseDetailsSheetProps {
  product: WarehouseItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStockAdjusted?: () => void;
}

export function WarehouseDetailsSheet({ product, isOpen, onClose, onStockAdjusted }: WarehouseDetailsSheetProps) {
  const [isAdjustingStock, setIsAdjustingStock] = useState(false);
  const { data: movements, isLoading } = useStockMovement(product?.id || '');

  if (!product) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-md overflow-hidden flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="text-xl">{product.name}</SheetTitle>
            <SheetDescription className="text-base text-muted-foreground">{product.code}</SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-8">
              {/* Warehouse Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Stock Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1 rounded-lg border p-3 bg-muted/30">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Box className="w-4 h-4" /> Available
                    </span>
                    <span className="text-2xl font-bold">{product.availableStock}</span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Product Info</h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Dimensions</span>
                    <span className="font-medium flex items-center gap-2">
                      {product.size} <Ruler className="w-3 h-3 text-muted-foreground" />
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Thickness</span>
                    <span className="font-medium">{product.thickness}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Minimum Stock</span>
                    <span className="font-medium">{product.minStock} {product.unit}</span>
                  </div>
                </div>
              </div>

              {/* Stock Movement */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Recent Activity</h3>
                <StockMovementTimeline movements={movements || []} isLoading={isLoading} />
              </div>
            </div>
          </ScrollArea>

          <div className="px-6 py-4 border-t bg-muted/20 flex gap-2">
            <Button className="flex-1" onClick={() => setIsAdjustingStock(true)}>
              <ArrowRightLeft className="w-4 h-4 mr-2" /> Adjust Stock
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href={`/inventory/${product.id}`}>
                <ExternalLink className="w-4 h-4 mr-2" /> Open Inventory
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {isAdjustingStock && (
        <StockAdjustmentDialog
          productId={product.id}
          productName={product.name}
          currentStock={product.availableStock}
          isOpen={isAdjustingStock}
          onOpenChange={(open) => {
            setIsAdjustingStock(open);
            if (!open && onStockAdjusted) onStockAdjusted();
          }}
        />
      )}
    </>
  );
}
