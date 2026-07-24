"use client";

import { useImport } from "../_hooks/useImport";
import { Package, Warehouse, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const importTypes = [
  { id: "Inventory", label: "Inventory", icon: Package, disabled: false },
  { id: "Warehouse Stock", label: "Warehouse Stock", icon: Warehouse, disabled: false },
  { id: "Customers", label: "Customers", icon: Users, disabled: true },
  { id: "Challans", label: "Challans", icon: FileText, disabled: true },
];

export function ImportTypeCards() {
  const { importType, setImportType, phase } = useImport();

  if (phase !== "SELECT_FILE") {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {importTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = importType === type.id;
        
        return (
          <button
            key={type.id}
            disabled={type.disabled}
            onClick={() => setImportType(type.id)}
            className={cn(
              "flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all duration-200",
              type.disabled 
                ? "cursor-not-allowed border-dashed border-muted bg-muted/30 opacity-60"
                : isSelected
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
              {type.disabled && <p className="mt-1 text-xs text-muted-foreground">Coming Soon</p>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
