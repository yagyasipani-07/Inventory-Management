import { Metadata } from "next";
import { ExportHeader } from "./_components/ExportHeader";
import { ExportCards } from "./_components/ExportCards";
import { ExportConfiguration } from "./_components/ExportConfiguration";
import { ExportPreview } from "./_components/ExportPreview";
import { ExportSummary } from "./_components/ExportSummary";

export const metadata: Metadata = {
  title: "Export Data | Paras Plywoods ERP",
  description: "Securely export your inventory, stock, or customer data.",
};

export default function ExportPage() {
  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <ExportHeader />
      
      <div className="space-y-6">
        <ExportCards />
        <ExportConfiguration />
        <ExportPreview />
        <ExportSummary />
      </div>
    </div>
  );
}
