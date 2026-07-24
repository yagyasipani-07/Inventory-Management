"use client";

import { useImport } from "../_hooks/useImport";
import { CheckCircle2, XCircle, AlertTriangle, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImportValidationPanel() {
  const { summary, phase } = useImport();

  if (!summary || phase === "SELECT_FILE" || phase === "PARSING") return null;

  const panels = [
    {
      title: "Total Rows",
      value: summary.totalRows,
      icon: FileSpreadsheet,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Valid Rows",
      value: summary.validRows,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Invalid Rows",
      value: summary.invalidRows,
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      title: "Missing Fields",
      value: summary.missingFields,
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {panels.map((panel) => {
        const Icon = panel.icon;
        return (
          <div key={panel.title} className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
            <div className={cn("rounded-full p-3", panel.bg, panel.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{panel.value}</p>
              <p className="text-sm text-muted-foreground">{panel.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
