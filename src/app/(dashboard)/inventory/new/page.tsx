'use client';

import { PageHeader } from '@/src/components/shared/page-header';
import { ProductForm } from '../_components/ProductForm';

export default function NewProductPage() {
  return (
    <div className="max-w-[1600px] mx-auto pb-8 space-y-8">
      <PageHeader
        title="Add New Product"
        description="Create a new product in the inventory."
      />
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <ProductForm />
      </div>
    </div>
  );
}
