"use client";

import { useAuditStore } from "../_hooks/useAudit";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { AuditModule, AuditAction, AuditStatus } from "../_services/auditService";

const MODULES: (AuditModule | "All")[] = ["All", "Inventory", "Warehouse", "Customers", "Challans", "Import", "Export", "Settings", "Authentication"];
const ACTIONS: (AuditAction | "All")[] = ["All", "Create", "Update", "Delete", "Import", "Export", "Print", "Dispatch", "Login", "Logout", "Approve", "Cancel"];
const STATUSES: (AuditStatus | "All")[] = ["All", "Success", "Warning", "Failed", "Pending"];

export function AuditFilters() {
  const { filters, updateFilter, clearFilters } = useAuditStore();

  const hasActiveFilters = filters.module !== "All" || filters.action !== "All" || filters.status !== "All" || filters.search !== "";

  return (
    <div className="sticky top-0 z-10 rounded-xl border bg-card p-4 shadow-sm flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.8} />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="Search audit logs..."
            className="h-9 w-full sm:w-[300px] rounded-lg border border-border bg-background pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter("search", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Select value={filters.module} onValueChange={(v) => updateFilter("module", v as any)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            {MODULES.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.action} onValueChange={(v) => updateFilter("action", v as any)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            {ACTIONS.map(a => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(v) => updateFilter("status", v as any)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
