import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Upload } from "lucide-react";

export const metadata = { title: "Import" };

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Import Data"
        description="Bulk import products, customers, and stock data from CSV or Excel files"
      />

      <EmptyState
        icon={Upload}
        title="Import your data"
        description="Upload a CSV or Excel file to bulk import products, customers, or stock adjustments. Supported formats: .csv, .xlsx, .xls"
        action={
          <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90">
            <Upload className="h-4 w-4" strokeWidth={2} />
            Upload File
          </button>
        }
      />
    </div>
  );
}
