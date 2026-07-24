import { PageHeader } from "@/components/shared/page-header";
import { ChallanDetails } from "../_components/ChallanDetails";
import { BackButton } from "../_components/BackButton";

export const metadata = { title: "Challan Details | Paras Plywoods ERP" };

export default async function ChallanDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Challan Details"
        description="View and manage dispatch challan details."
      >
        <BackButton href="/challans" />
      </PageHeader>
      <div className="max-w-6xl">
        <ChallanDetails id={id} />
      </div>
    </div>
  );
}
