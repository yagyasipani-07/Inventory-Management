"use client";

import { Activity, Box, Truck, Upload, Download } from "lucide-react";
import { useAuditSummary } from "../_hooks/useAudit";
import { Skeleton } from "@/components/ui/skeleton";

export function AuditSummaryCards() {
  const { data: summary, isLoading } = useAuditSummary();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-8 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Today's Activities",
      value: summary?.todayActivities || 0,
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Inventory Changes",
      value: summary?.inventoryChanges || 0,
      icon: Box,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Dispatch Operations",
      value: summary?.dispatchOperations || 0,
      icon: Truck,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Imports",
      value: summary?.imports || 0,
      icon: Upload,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Exports",
      value: summary?.exports || 0,
      icon: Download,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, i) => (
        <div key={i} className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.bgColor}`}>
            <card.icon className={`h-6 w-6 ${card.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
            <h3 className="text-2xl font-bold">{card.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
