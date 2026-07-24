"use client";

import { Bell, User, Search } from "lucide-react";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { CommandPalette } from "@/app/(dashboard)/search/_components/CommandPalette";
import { useGlobalSearch } from "@/app/(dashboard)/search/_hooks/useGlobalSearch";

export function TopNavbar() {
  const setIsSearchOpen = useGlobalSearch((s) => s.setIsOpen);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      <BreadcrumbNav />

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex h-9 w-56 items-center justify-between rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Search...</span>
          </div>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        <CommandPalette />

        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
          aria-label="Profile menu"
        >
          <User className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
