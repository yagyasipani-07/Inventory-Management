import { Product } from '../_services/inventoryService';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Package, MapPin, Tag, Activity, History } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
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
              <span className="text-muted-foreground">Current Stock</span>
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
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
              <p>Stock movement history will be available soon.</p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
