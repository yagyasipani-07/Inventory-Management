'use client';

import { PageHeader } from "@/components/shared/page-header";
import { ChallanForm } from "../../_components/ChallanForm";
import { useChallan } from "../../_hooks/useChallans";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditChallanPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: challan, isLoading } = useChallan(id);

  if (isLoading) {
    return <div>Loading...</div>;
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
