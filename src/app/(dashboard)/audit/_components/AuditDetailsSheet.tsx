"use client";

import { useAuditStore } from "../_hooks/useAudit";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function AuditDetailsSheet() {
  const { selectedLog, setSelectedLog } = useAuditStore();

  return (
    <Sheet open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Audit Log Details</SheetTitle>
          <SheetDescription>
            {selectedLog && format(new Date(selectedLog.timestamp), "MMM dd, yyyy 'at' hh:mm:ss a")}
          </SheetDescription>
        </SheetHeader>

        {selectedLog && (
          <div className="mt-6 space-y-6">
            {/* Overview */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Overview</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-muted-foreground mb-1">User</span>
                  <span className="font-medium">{selectedLog.user}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground mb-1">Module</span>
                  <Badge variant="secondary" className="font-normal">{selectedLog.module}</Badge>
                </div>
                <div>
                  <span className="block text-muted-foreground mb-1">Action</span>
                  <Badge variant="outline" className="font-normal">{selectedLog.action}</Badge>
                </div>
                <div>
                  <span className="block text-muted-foreground mb-1">Status</span>
                  <span className={`font-semibold ${
                    selectedLog.status === "Success" ? "text-green-500" :
                    selectedLog.status === "Warning" ? "text-yellow-500" :
                    selectedLog.status === "Failed" ? "text-red-500" : "text-blue-500"
                  }`}>
                    {selectedLog.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-muted-foreground mb-1">Entity</span>
                  <span className="font-medium">{selectedLog.entity}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-muted-foreground mb-1">Description</span>
                  <span className="font-medium">{selectedLog.description}</span>
                </div>
              </div>
            </div>

            {/* Changes (if any) */}
            {(selectedLog.oldValue || selectedLog.newValue) && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Changes</h4>
                <div className="rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs overflow-x-auto">
                  {selectedLog.oldValue && (
                    <div className="mb-4">
                      <span className="text-red-500 block mb-1">- Old Value</span>
                      <pre className="text-muted-foreground">
                        {JSON.stringify(selectedLog.oldValue, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedLog.newValue && (
                    <div>
                      <span className="text-green-500 block mb-1">+ New Value</span>
                      <pre className="text-foreground">
                        {JSON.stringify(selectedLog.newValue, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            {selectedLog.metadata && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Metadata</h4>
                <div className="rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs overflow-x-auto">
                  <pre className="text-muted-foreground">
                    {JSON.stringify({ ...selectedLog.metadata, ipAddress: selectedLog.ipAddress }, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
