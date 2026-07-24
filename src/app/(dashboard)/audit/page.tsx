import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ScrollText } from "lucide-react";

export const metadata = { title: "Audit Logs" };

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track all system activities, changes, and user actions"
      />

      <EmptyState
        icon={ScrollText}
        title="No audit logs"
        description="System activity logs will appear here as users interact with the application. All changes to inventory, challans, and customer data are automatically recorded."
      />
    </div>
  );
}
