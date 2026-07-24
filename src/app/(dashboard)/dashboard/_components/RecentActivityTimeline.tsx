'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { RecentActivity } from '../_services/dashboardService';
import { Package, FileText, Upload, User, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentActivityTimelineProps {
  activities: RecentActivity[];
}

export function RecentActivityTimeline({ activities }: RecentActivityTimelineProps) {
  const getIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'Inventory':
        return <Package className="h-4 w-4 text-emerald-600" />;
      case 'Challan':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'System':
        return <Upload className="h-4 w-4 text-indigo-600" />;
      case 'Customer':
        return <User className="h-4 w-4 text-amber-600" />;
      default:
        return <Activity className="h-4 w-4 text-slate-600" />;
    }
  };

  const getIconBg = (type: RecentActivity['type']) => {
    switch (type) {
      case 'Inventory':
        return 'bg-emerald-100 border-emerald-200';
      case 'Challan':
        return 'bg-blue-100 border-blue-200';
      case 'System':
        return 'bg-indigo-100 border-indigo-200';
      case 'Customer':
        return 'bg-amber-100 border-amber-200';
      default:
        return 'bg-slate-100 border-slate-200';
    }
  };

  return (
    <Card className="rounded-xl shadow-sm border border-border h-full">
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center pt-4">No recent activity.</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10", getIconBg(activity.type))}>
                  {getIcon(activity.type)}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-foreground">{activity.title}</h4>
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{activity.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
