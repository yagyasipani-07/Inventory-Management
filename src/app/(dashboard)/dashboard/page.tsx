'use client';

import { DashboardHeader } from './_components/DashboardHeader';
import { DashboardStatCard } from './_components/DashboardStatCard';
import { QuickActions } from './_components/QuickActions';
import { InventoryOverviewChart } from './_components/InventoryOverviewChart';
import { LowStockTable } from './_components/LowStockTable';
import { RecentChallansTable } from './_components/RecentChallansTable';
import { RecentActivityTimeline } from './_components/RecentActivityTimeline';
import { DashboardError } from './_components/DashboardError';
import {
  ChartSkeleton,
  StatCardSkeleton,
  TableSkeleton,
  TimelineSkeleton,
} from './_components/DashboardSkeleton';
import {
  useDashboardStats,
  useInventoryTrend,
  useLowStockProducts,
  useRecentActivity,
  useRecentChallans,
} from './_services/dashboardService';
import { Package, IndianRupee, Truck, TriangleAlert } from 'lucide-react';

export default function DashboardPage() {
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    refetch: refetchStats,
  } = useDashboardStats();

  const {
    data: trend,
    isLoading: isLoadingTrend,
    isError: isErrorTrend,
    refetch: refetchTrend,
  } = useInventoryTrend();

  const {
    data: lowStock,
    isLoading: isLoadingLowStock,
    isError: isErrorLowStock,
    refetch: refetchLowStock,
  } = useLowStockProducts();

  const {
    data: challans,
    isLoading: isLoadingChallans,
    isError: isErrorChallans,
    refetch: refetchChallans,
  } = useRecentChallans();

  const {
    data: activity,
    isLoading: isLoadingActivity,
    isError: isErrorActivity,
    refetch: refetchActivity,
  } = useRecentActivity();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      <DashboardHeader />

      {/* KPI Section */}
      {isErrorStats ? (
        <div className="h-[120px]">
          <DashboardError message="Failed to load KPIs" onRetry={refetchStats} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoadingStats || !stats ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <DashboardStatCard
                index={0}
                title="Total Products"
                value={stats.totalProducts}
                icon={Package}
                trend={stats.totalProductsTrend}
                trendDescription="from last week"
              />
              <DashboardStatCard
                index={1}
                title="Current Stock Value"
                value={`₹${stats.currentStockValue.toLocaleString('en-IN')}`}
                icon={IndianRupee}
                trend={stats.currentStockValueTrend}
                trendDescription="from last month"
              />
              <DashboardStatCard
                index={2}
                title="Today's Dispatch"
                value={`${stats.todaysDispatch} Challans`}
                icon={Truck}
                trend={stats.todaysDispatchTrend}
                trendDescription="from yesterday"
              />
              <DashboardStatCard
                index={3}
                title="Low Stock Items"
                value={stats.lowStockItems}
                icon={TriangleAlert}
                trend={stats.lowStockItemsTrend}
                trendDescription="need attention"
              />
            </>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts & Tables Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Left Column (Chart & Low Stock) */}
        <div className="space-y-6 lg:col-span-4">
          <div className="h-[400px]">
            {isErrorTrend ? (
              <DashboardError message="Failed to load inventory trend chart" onRetry={refetchTrend} />
            ) : isLoadingTrend || !trend ? (
              <ChartSkeleton />
            ) : (
              <InventoryOverviewChart data={trend} />
            )}
          </div>
          
          <div className="min-h-[300px]">
            {isErrorLowStock ? (
              <DashboardError message="Failed to load low stock items" onRetry={refetchLowStock} />
            ) : isLoadingLowStock || !lowStock ? (
              <TableSkeleton />
            ) : (
              <LowStockTable products={lowStock} />
            )}
          </div>
        </div>

        {/* Right Column (Challans & Activity) */}
        <div className="space-y-6 lg:col-span-3">
          <div className="min-h-[350px]">
            {isErrorChallans ? (
              <DashboardError message="Failed to load recent challans" onRetry={refetchChallans} />
            ) : isLoadingChallans || !challans ? (
              <TableSkeleton />
            ) : (
              <RecentChallansTable challans={challans} />
            )}
          </div>
          
          <div className="min-h-[400px]">
            {isErrorActivity ? (
              <DashboardError message="Failed to load recent activity" onRetry={refetchActivity} />
            ) : isLoadingActivity || !activity ? (
              <TimelineSkeleton />
            ) : (
              <RecentActivityTimeline activities={activity} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
