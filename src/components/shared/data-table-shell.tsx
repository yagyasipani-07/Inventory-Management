import { cn } from "@/lib/utils";

interface DataTableShellProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableShell({ children, className }: DataTableShellProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      {children}
    </div>
  );
}
