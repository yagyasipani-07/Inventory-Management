"use client";

import { useUIStore } from "@/store/ui-store";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div
        className="flex flex-1 flex-col overflow-hidden transition-[margin-left] duration-200 ease-in-out"
        style={{ marginLeft: sidebarCollapsed ? 72 : 240 }}
      >
        <TopNavbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">{children}</main>
      </div>
    </div>
  );
}
