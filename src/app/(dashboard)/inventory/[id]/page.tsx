'use client';

import { use } from 'react';
import { PageHeader } from '@/src/components/shared/page-header';
import { ProductDetails } from '../_components/ProductDetails';
import { useProduct } from '../_hooks/useProduct';
import { InventoryFormSkeleton } from '../_components/InventorySkeleton';
import { InventoryError } from '../_components/InventoryError';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import { Edit } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const { data: product, isLoading, isError, refetch } = useProduct(resolvedParams.id);

  if (isError) {
    return (
      <div className="max-w-[1600px] mx-auto pb-8 space-y-6">
        <PageHeader title="Product Details" />
        <InventoryError message="Failed to load product details." onRetry={refetch} />
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="max-w-[1600px] mx-auto pb-8 space-y-6">
        <PageHeader title="Product Details" />
        <InventoryFormSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {product.code}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href={`/inventory/${product.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </Button>
        </div>
      </div>

      <ProductDetails product={product} />
    </div>
  );
}
