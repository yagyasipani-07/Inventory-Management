import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Settings as SettingsIcon } from "lucide-react";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Application configuration and preferences"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Company Profile" description="Your business details">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Company Name</span>
              <span className="font-medium text-foreground">Paras Plywoods</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Business Type</span>
              <span className="font-medium text-foreground">
                Plywood &amp; Timber Wholesale
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Currency</span>
              <span className="font-medium text-foreground">INR (₹)</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="System Preferences"
          description="Application behavior settings"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Default Page Size</span>
              <span className="font-medium text-foreground">25 rows</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Date Format</span>
              <span className="font-medium text-foreground">DD MMM YYYY</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Auto-save</span>
              <span className="font-medium text-foreground">Enabled</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
