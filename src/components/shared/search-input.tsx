"use client";

import { Search, X } from "lucide-react";
import { useSearchStore } from "@/store/search-store";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({ placeholder = "Search...", className }: SearchInputProps) {
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const clearQuery = useSearchStore((s) => s.clearQuery);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.8} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-56 rounded-lg border border-border bg-background pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background transition-all duration-150"
      />
      {query && (
        <button
          onClick={clearQuery}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
