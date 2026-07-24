import { Metadata } from "next";
import { AuditHeader } from "./_components/AuditHeader";
import { AuditSummaryCards } from "./_components/AuditSummaryCards";
import { AuditFilters } from "./_components/AuditFilters";
import { AuditTable } from "./_components/AuditTable";
import { ActivityTimeline } from "./_components/ActivityTimeline";
import { AuditDetailsSheet } from "./_components/AuditDetailsSheet";

export const metadata: Metadata = {
  title: "Audit Logs | Paras Plywoods ERP",
  description: "Track every important action performed across the ERP.",
};

export default function AuditPage() {
  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <AuditHeader />
      
      <div className="space-y-6">
        <AuditSummaryCards />
        <AuditFilters />
        
        <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
          <div className="min-w-0">
            <AuditTable />
          </div>
          <div className="hidden xl:block">
            <ActivityTimeline />
          </div>
        </div>
      </div>

      <AuditDetailsSheet />
    </div>
  );
}
