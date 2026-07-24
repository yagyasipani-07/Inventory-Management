import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                "flex items-center gap-0.5 font-medium",
                trend.direction === "up" && "text-success",
                trend.direction === "down" && "text-danger",
                trend.direction === "neutral" && "text-muted-foreground"
              )}
            >
              {trend.direction === "up" && <ArrowUp className="h-3 w-3" />}
              {trend.direction === "down" && <ArrowDown className="h-3 w-3" />}
              {trend.direction === "neutral" && <Minus className="h-3 w-3" />}
              {trend.value}%
            </span>
          )}
          {description && (
            <span className="text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
