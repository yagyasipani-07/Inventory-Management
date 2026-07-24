import { PageHeader } from "@/components/shared/page-header";
import { ChallanForm } from "../_components/ChallanForm";
import { BackButton } from "../_components/BackButton";

export const metadata = { title: "New Challan | Paras Plywoods ERP" };

export default function NewChallanPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Challan"
        description="Create a new dispatch challan for a customer."
      >
        <BackButton href="/challans" />
      </PageHeader>
      <div className="max-w-5xl">
        <ChallanForm />
      </div>
    </div>
  );
}
