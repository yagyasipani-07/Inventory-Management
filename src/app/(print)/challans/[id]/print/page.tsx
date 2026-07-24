'use client';

import { useChallan } from '@/src/app/(dashboard)/challans/_hooks/useChallans';
import { PrintableTemplate } from './_components/PrintableTemplate';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function PrintChallanPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: challan, isLoading, error } = useChallan(id);

  // Auto print when loaded
  useEffect(() => {
    if (challan && !isLoading) {
      // Optional: Auto trigger print dialog after a short delay
      // const timer = setTimeout(() => window.print(), 500);
      // return () => clearTimeout(timer);
    }
  }, [challan, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading document...
      </div>
    );
  }

  if (error || !challan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <h2 className="text-xl font-bold mb-2">Error Loading Document</h2>
        <p>The challan could not be found or loaded.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 print:py-0 print:bg-white">
      <div className="max-w-[210mm] mx-auto shadow-xl print:shadow-none bg-white">
        <PrintableTemplate challan={challan} />
      </div>
    </div>
  );
}
