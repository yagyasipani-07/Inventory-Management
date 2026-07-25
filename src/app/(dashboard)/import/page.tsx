import { Metadata } from "next";
import { ImportHeader } from "./_components/ImportHeader";
import { ImportTypeCards } from "./_components/ImportTypeCards";
import { ImportDropzone } from "./_components/ImportDropzone";
import { ImportValidationPanel } from "./_components/ImportValidationPanel";
import { ImportPreviewTable } from "./_components/ImportPreviewTable";
import { ImportSummaryCards } from "./_components/ImportSummaryCards";
import { ImportTemplateActions } from "./_components/ImportTemplateActions";

export const metadata: Metadata = {
  title: "Import Data | Paras Plywoods ERP",
  description: "Bulk import inventory using CSV or Excel files.",
};

export default function ImportPage() {
  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <ImportHeader />
      
      <div className="space-y-6">
        <ImportTypeCards />
        <ImportTemplateActions />
        <ImportDropzone />
        <ImportValidationPanel />
        <ImportPreviewTable />
        <ImportSummaryCards />
      </div>
    </div>
  );
}
