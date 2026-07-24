"use client";

import { Moon, Sun, MonitorSmartphone, LayoutPanelLeft, List } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Appearance</h2>
        <p className="text-sm text-muted-foreground">
          Customize how the ERP looks and feels on your device.
        </p>
      </div>

      <SectionCard title="Theme">
        <RadioGroup defaultValue="light" className="grid gap-4 md:grid-cols-3">
          <div>
            <RadioGroupItem value="light" id="light" className="peer sr-only" />
            <Label
              htmlFor="light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Sun className="mb-3 h-6 w-6" />
              Light
            </Label>
          </div>
          <div>
            <RadioGroupItem value="dark" id="dark" className="peer sr-only" disabled />
            <Label
              htmlFor="dark"
              className="flex cursor-not-allowed flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 opacity-50 hover:bg-accent hover:text-accent-foreground"
            >
              <Moon className="mb-3 h-6 w-6" />
              Dark (Soon)
            </Label>
          </div>
          <div>
            <RadioGroupItem value="system" id="system" className="peer sr-only" disabled />
            <Label
              htmlFor="system"
              className="flex cursor-not-allowed flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 opacity-50 hover:bg-accent hover:text-accent-foreground"
            >
              <MonitorSmartphone className="mb-3 h-6 w-6" />
              System (Soon)
            </Label>
          </div>
        </RadioGroup>
      </SectionCard>

      <SectionCard title="Density">
        <RadioGroup defaultValue="comfortable" className="grid gap-4 md:grid-cols-2">
          <div>
            <RadioGroupItem value="comfortable" id="comfortable" className="peer sr-only" />
            <Label
              htmlFor="comfortable"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <LayoutPanelLeft className="mb-3 h-6 w-6" />
              Comfortable
              <span className="mt-1 text-xs text-muted-foreground font-normal">More spacing between elements</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="compact" id="compact" className="peer sr-only" />
            <Label
              htmlFor="compact"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <List className="mb-3 h-6 w-6" />
              Compact
              <span className="mt-1 text-xs text-muted-foreground font-normal">Fit more data on screen</span>
            </Label>
          </div>
        </RadioGroup>
      </SectionCard>
    </div>
  );
}
