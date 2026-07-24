import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-9 w-32 animate-pulse rounded-lg bg-muted" />
      </div>
      {/* Table skeleton */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-muted"
                style={{ width: `${80 + Math.random() * 60}px` }}
              />
            ))}
          </div>
        </div>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex gap-4 border-b border-border px-4 py-3 last:border-0"
          >
            {[...Array(5)].map((_, j) => (
              <div
                key={j}
                className="h-4 animate-pulse rounded bg-muted"
                style={{
                  width: `${60 + Math.random() * 80}px`,
                  animationDelay: `${(i * 5 + j) * 50}ms`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
