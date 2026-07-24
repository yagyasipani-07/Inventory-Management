'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { motion } from 'framer-motion';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendDescription?: string;
  index: number;
}

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDescription,
  index,
}: DashboardStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.05 }}
    >
      <Card className="rounded-xl shadow-sm border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="text-2xl font-bold">{value}</div>
          {(trend !== undefined || trendDescription) && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              {trend !== undefined && (
                <span
                  className={cn(
                    "flex items-center mr-1 font-medium",
                    trend > 0 ? "text-emerald-600" : trend < 0 ? "text-rose-600" : "text-muted-foreground"
                  )}
                >
                  {trend > 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  ) : trend < 0 ? (
                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                  ) : null}
                  {Math.abs(trend)}%
                </span>
              )}
              {trendDescription}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
