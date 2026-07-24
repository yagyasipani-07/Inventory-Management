"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  inventory: "Inventory",
  warehouse: "Warehouse",
  customers: "Customers",
  challans: "Dispatch Challans",
  import: "Import",
  audit: "Audit Logs",
  settings: "Settings",
};

export function BreadcrumbNav() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        href="/dashboard"
        className="flex items-center text-muted-foreground transition-colors duration-150 hover:text-foreground"
      >
        <Home className="h-4 w-4" strokeWidth={1.8} />
      </Link>
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = ROUTE_LABELS[segment] || segment;
        const isLast = index === segments.length - 1;

        return (
          <div key={href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={2} />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link
                href={href}
                className={cn(
                  "text-muted-foreground transition-colors duration-150 hover:text-foreground"
                )}
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
