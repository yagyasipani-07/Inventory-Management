'use client';

import { use } from 'react';
import { PageHeader } from '@/src/components/shared/page-header';
import { ProductForm } from '../../_components/ProductForm';
import { useProduct } from '../../_hooks/useProduct';
import { InventoryFormSkeleton } from '../../_components/InventorySkeleton';
import { InventoryError } from '../../_components/InventoryError';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = use(params);
  const { data: product, isLoading, isError, refetch } = useProduct(resolvedParams.id);

  if (isError) {
    return (
      <div className="max-w-[1600px] mx-auto pb-8 space-y-6">
        <PageHeader title="Edit Product" />
        <InventoryError message="Failed to load product details for editing." onRetry={refetch} />
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="max-w-[1600px] mx-auto pb-8 space-y-6">
        <PageHeader title="Edit Product" />
        <InventoryFormSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-8 space-y-8">
      <PageHeader
        title={`Edit ${product.name}`}
        description="Modify product details and stock settings."
      />
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}
