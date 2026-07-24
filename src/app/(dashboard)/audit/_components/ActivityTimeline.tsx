"use client";

import { useTimeline } from "../_hooks/useAudit";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditLog } from "../_services/auditService";
import { Package, Users, FileText, Warehouse, Activity, Settings, CircleDashed } from "lucide-react";

export function ActivityTimeline() {
  const { data: timeline, isLoading } = useTimeline();

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Activity Timeline</h3>
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!timeline || Object.keys(timeline).length === 0) {
    return null;
  }

  const renderIcon = (module: string) => {
    const iconClass = "h-4 w-4 text-primary-foreground";
    switch (module) {
      case "Inventory": return <Package className={iconClass} />;
      case "Customers": return <Users className={iconClass} />;
      case "Challans": return <FileText className={iconClass} />;
      case "Warehouse": return <Warehouse className={iconClass} />;
      case "Settings": return <Settings className={iconClass} />;
      default: return <Activity className={iconClass} />;
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold tracking-tight text-foreground">Recent Activity</h3>
      <div className="space-y-8">
        {Object.entries(timeline).map(([group, logs]) => (
          <div key={group}>
            <h4 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">{group}</h4>
            <div className="space-y-6 border-l-2 border-border ml-4 pl-6 relative">
              {logs.map((log: AuditLog, i: number) => (
                <div key={log.id} className="relative">
                  <div className="absolute -left-[35px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-primary">
                    {renderIcon(log.module)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground text-sm">
                      {log.user} <span className="font-normal text-muted-foreground">performed</span> {log.action} <span className="font-normal text-muted-foreground">in</span> {log.module}
                    </span>
                    <span className="mt-1 text-sm text-muted-foreground">
                      {log.description}
                    </span>
                    <span className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                      <CircleDashed className="h-3 w-3" />
                      {format(new Date(log.timestamp), "MMM dd, hh:mm a")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
