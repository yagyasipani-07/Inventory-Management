'use client';

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ChallanForm } from "../../_components/ChallanForm";
import { useQuery } from "@tanstack/react-query";
import { challanService } from "../../_services/challanService";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditChallanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  
  const { data: challan, isLoading } = useQuery({
    queryKey: ["challan", id],
    queryFn: () => challanService.getChallan(id),
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!challan) {
    return <div>Challan not found</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Challan ${challan.challanNumber}`}
        description="Modify an existing draft challan."
      >
        <Button variant="outline" asChild>
          <Link href={`/challans/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </PageHeader>
      <div className="max-w-5xl">
        <ChallanForm initialData={challan} isEdit />
      </div>
    </div>
  );
}
