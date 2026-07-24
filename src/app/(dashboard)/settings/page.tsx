"use client";

import { Suspense } from "react";
import { useQueryState } from "nuqs";
import { SettingsHeader } from "./_components/SettingsHeader";
import { SettingsSidebar } from "./_components/SettingsSidebar";
import { CompanySettings } from "./_components/CompanySettings";
import { WarehouseSettings } from "./_components/WarehouseSettings";
import { PrintSettings } from "./_components/PrintSettings";
import { AppearanceSettings } from "./_components/AppearanceSettings";
import { ProfileSettings } from "./_components/ProfileSettings";
import { SecuritySettings } from "./_components/SecuritySettings";
import { AboutSettings } from "./_components/AboutSettings";

function SettingsContent() {
  const [activeTab] = useQueryState("tab", { defaultValue: "company" });

  const renderContent = () => {
    switch (activeTab) {
      case "company":
        return <CompanySettings />;
      case "warehouse":
        return <WarehouseSettings />;
      case "printing":
        return <PrintSettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "profile":
        return <ProfileSettings />;
      case "security":
        return <SecuritySettings />;
      case "about":
        return <AboutSettings />;
      default:
        return <CompanySettings />;
    }
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      <SettingsSidebar />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-4xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <SettingsHeader />
      <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-lg bg-muted" />}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}
