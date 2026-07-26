import { Product } from '../_services/inventoryService';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Package, MapPin, Tag, Activity, History, FileText } from 'lucide-react';
import { useProductMovements } from '../_hooks/useProductMovements';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { data: movements = [], isLoading: isLoadingMovements } = useProductMovements(product.id);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Left Column: Product Info & Specs */}
      <div className="xl:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.photoUrl && (
              <div className="md:col-span-2">
                <img
                  src={product.photoUrl}
                  alt={product.name}
                  className="h-48 w-full rounded-lg border object-cover"
                />
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Product Code</p>
              <p className="text-base font-semibold">{product.code}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Product Name</p>
              <p className="text-base font-semibold">{product.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-base">
                {new Date(product.lastUpdated).toLocaleDateString()} {new Date(product.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
            {product.description && (
              <div className="md:col-span-2 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-base">{product.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Tag className="h-5 w-5 text-muted-foreground" />
              Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Thickness</p>
              <p className="text-base font-medium">{product.thickness}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Size</p>
              <p className="text-base font-medium">{product.size} ft</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Unit</p>
              <p className="text-base font-medium">{product.unit}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              Audit Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
              <p>Audit logging will be implemented in a future phase.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Stock Status & Movement */}
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              Stock Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Stock (All Warehouses)</span>
              <span className="text-2xl font-bold">{product.currentStock}</span>
            </div>
            <div className="pt-4 border-t flex items-center justify-between">
              <span className="font-semibold">Available to Dispatch</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {product.availableStock}
              </span>
            </div>
            
            <div className="pt-4 border-t flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Minimum Stock Level</span>
              <span className="font-medium">{product.minStock}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-muted-foreground" />
              Recent Movement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingMovements ? (
              <div className="text-center py-6 text-sm text-muted-foreground">Loading movements...</div>
            ) : movements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                <p>No stock movements recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {movements.map((movement: any) => (
                  <div key={movement.id} className="border rounded-lg p-3 text-sm space-y-1">
                    <div className="flex items-center justify-between font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            movement.quantity_change > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {movement.movement_type || 'Adjustment'}
                      </span>
                      <span
                        className={
                          movement.quantity_change > 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'
                        }
                      >
                        {movement.quantity_change > 0 ? `+${movement.quantity_change}` : movement.quantity_change}
                      </span>
                    </div>
                    {movement.purchase_bill_number && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium bg-muted/50 px-2 py-0.5 rounded w-fit">
                        <FileText className="h-3 w-3" />
                        <span>Bill #: {movement.purchase_bill_number}</span>
                      </div>
                    )}
                    {movement.remarks && (
                      <p className="text-xs text-muted-foreground">{movement.remarks}</p>
                    )}
                    <p className="text-[11px] text-muted-foreground/70">
                      {new Date(movement.created_at).toLocaleDateString()} {new Date(movement.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
