"use client";

import { useExport } from "../_hooks/useExport";
import { ExportDataset } from "../_services/exportService";
import { Package, Warehouse, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const exportTypes: { id: ExportDataset; label: string; icon: any }[] = [
  { id: "Inventory", label: "Inventory", icon: Package },
  { id: "Warehouse Stock", label: "Warehouse Stock", icon: Warehouse },
  { id: "Customers", label: "Customers", icon: Users },
  { id: "Dispatch Challans", label: "Dispatch Challans", icon: FileText },
];

export function ExportCards() {
  const { config, setDataset, loadPreview } = useExport();

  // Reload preview whenever the selected dataset changes
  useEffect(() => {
    loadPreview();
  }, [config.dataset, loadPreview]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {exportTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = config.dataset === type.id;
        
        return (
          <button
            key={type.id}
            onClick={() => setDataset(type.id)}
            className={cn(
              "flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all duration-200",
              isSelected
                ? "border-primary bg-primary/5 text-primary shadow-sm"
                : "border-border bg-card hover:border-primary/50 hover:bg-accent/50",
            )}
          >
            <div className={cn(
              "rounded-full p-3",
              isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-semibold">{type.label}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
