"use client";

import { Settings } from "lucide-react";

export function SettingsHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-border pb-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <Settings className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your ERP system and company information.
        </p>
      </div>
    </div>
  );
}
