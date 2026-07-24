import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  description,
  children,
  action,
  className,
}: SectionCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
