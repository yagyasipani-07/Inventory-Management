import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SectionCard } from "@/components/shared/section-card";
import { Package, Warehouse, FileText, Users, ArrowUpRight } from "lucide-react";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your warehouse operations"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value="—"
          icon={Package}
          description="Across all categories"
          trend={{ value: 0, direction: "neutral" }}
        />
        <StatCard
          title="Warehouse Stock"
          value="—"
          icon={Warehouse}
          description="Items in storage"
          trend={{ value: 0, direction: "neutral" }}
        />
        <StatCard
          title="Active Challans"
          value="—"
          icon={FileText}
          description="This month"
          trend={{ value: 0, direction: "neutral" }}
        />
        <StatCard
          title="Customers"
          value="—"
          icon={Users}
          description="Total registered"
          trend={{ value: 0, direction: "neutral" }}
        />
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard
          title="Recent Challans"
          description="Latest dispatch activities"
          action={
            <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          }
        >
          <p className="text-sm text-muted-foreground">
            No recent challans to display. Create your first dispatch challan to get
            started.
          </p>
        </SectionCard>

        <SectionCard
          title="Low Stock Alerts"
          description="Products below minimum threshold"
          action={
            <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          }
        >
          <p className="text-sm text-muted-foreground">
            No low stock alerts. All products are within safe stock levels.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
