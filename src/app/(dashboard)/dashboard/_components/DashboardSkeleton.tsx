'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';

export function StatCardSkeleton() {
  return (
    <Card className="rounded-xl shadow-sm border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <Skeleton className="h-8 w-[80px] mb-2" />
        <Skeleton className="h-3 w-[120px]" />
      </CardContent>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card className="rounded-xl shadow-sm border border-border h-[400px]">
      <CardHeader className="pb-0 px-6 pt-6">
        <CardTitle className="text-base font-semibold">
          <Skeleton className="h-5 w-[200px]" />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4 h-[320px] flex items-end justify-between space-x-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="w-full bg-muted/50" style={{ height: `${Math.max(20, Math.random() * 100)}%` }} />
        ))}
      </CardContent>
    </Card>
  );
}

export function TableSkeleton() {
  return (
    <Card className="rounded-xl shadow-sm border border-border h-full">
      <CardHeader className="pb-3 px-6 pt-6">
        <CardTitle className="text-base font-semibold">
          <Skeleton className="h-5 w-[150px]" />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <div className="space-y-4 mt-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function TimelineSkeleton() {
  return (
    <Card className="rounded-xl shadow-sm border border-border h-full">
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="text-base font-semibold">
          <Skeleton className="h-5 w-[120px]" />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-2 flex-1 pt-1">
                <Skeleton className="h-4 w-[60%]" />
                <Skeleton className="h-3 w-[80%]" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
