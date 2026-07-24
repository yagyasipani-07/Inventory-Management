"use client";

import { Bell, User } from "lucide-react";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { SearchInput } from "@/components/shared/search-input";

export function TopNavbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      <BreadcrumbNav />

      <div className="flex items-center gap-3">
        <SearchInput />

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
