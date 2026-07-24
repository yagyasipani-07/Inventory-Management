"use client";

import { useQueryState } from "nuqs";
import {
  Building2,
  Warehouse,
  Printer,
  Paintbrush,
  User,
  Shield,
  Info,
  Users,
  Bell,
  Plug,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    title: "Organization",
    items: [
      { id: "company", label: "Company", icon: Building2 },
      { id: "warehouse", label: "Warehouse", icon: Warehouse },
      { id: "printing", label: "Printing", icon: Printer },
    ],
  },
  {
    title: "Preferences",
    items: [
      { id: "profile", label: "Profile", icon: User },
      { id: "appearance", label: "Appearance", icon: Paintbrush },
      { id: "security", label: "Security", icon: Shield },
      { id: "about", label: "About", icon: Info },
    ],
  },
  {
    title: "Future (Coming Soon)",
    items: [
      { id: "users", label: "Users & Roles", icon: Users, disabled: true },
      { id: "notifications", label: "Notifications", icon: Bell, disabled: true },
      { id: "integrations", label: "Integrations", icon: Plug, disabled: true },
    ],
  },
];

export function SettingsSidebar() {
  const [activeTab, setActiveTab] = useQueryState("tab", { defaultValue: "company" });

  return (
    <aside className="sticky top-6 flex w-full flex-col gap-6 lg:w-64">
      {SECTIONS.map((section) => (
        <div key={section.title} className="flex flex-col gap-2">
          <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </h3>
          <nav className="flex flex-col gap-1">
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => !item.disabled && setActiveTab(item.id)}
                disabled={item.disabled}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-100",
                  activeTab === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  item.disabled && "cursor-not-allowed opacity-50 hover:bg-transparent"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    activeTab === item.id ? "text-primary" : "text-muted-foreground"
                  )}
                />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      ))}
    </aside>
  );
}
