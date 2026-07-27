"use client";

import { useUIStore } from "@/store/ui-store";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, mobileDrawerOpen, setMobileDrawerOpen } = useUIStore();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar />
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-[margin-left] duration-200 ease-in-out ml-0 ${
          sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[240px]"
        }`}
      >
        <TopNavbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
