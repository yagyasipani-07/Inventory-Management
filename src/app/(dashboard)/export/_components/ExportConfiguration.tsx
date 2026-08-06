"use client";

import { useExport } from "../_hooks/useExport";
import { useCategories } from "../_hooks/queries";
import { cn } from "@/lib/utils";
import { FileSpreadsheet, FileJson, FileText, Search, X, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo, useRef, useState } from "react";

export function ExportConfiguration() {
  const config = useExport((state) => state.config);
  const setFormat = useExport((state) => state.setFormat);
  const setStatus = useExport((state) => state.setStatus);
  const setCategory = useExport((state) => state.setCategory);

  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();

  // Local search state (not in Zustand — only controls the dropdown filter)
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search filtering
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

  const filteredCategories = useMemo(() => {
    if (!debouncedQuery) return categories;
    const q = debouncedQuery.toLowerCase();
    return categories.filter((cat) => cat.toLowerCase().includes(q));
  }, [categories, debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  const showCategoryFilter = config.dataset === "Inventory" || config.dataset === "Warehouse Stock";

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight mb-6">Export Configuration</h3>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* Format Selection */}
        <div className="space-y-4">
          <Label className="text-base">Export Format</Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button
              onClick={() => setFormat("excel")}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 transition-colors",
                config.format === "excel"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-border hover:bg-muted"
              )}
            >
              <FileSpreadsheet className={cn("h-5 w-5", config.format === "excel" ? "text-emerald-500" : "text-muted-foreground")} />
              <span className="font-medium">Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => setFormat("csv")}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 transition-colors",
                config.format === "csv"
                  ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                  : "border-border hover:bg-muted"
              )}
            >
              <FileJson className={cn("h-5 w-5", config.format === "csv" ? "text-blue-500" : "text-muted-foreground")} />
              <span className="font-medium">CSV (.csv)</span>
            </button>
            <button
              onClick={() => setFormat("pdf")}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 transition-colors",
                config.format === "pdf"
                  ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400"
                  : "border-border hover:bg-muted"
              )}
            >
              <FileText className={cn("h-5 w-5", config.format === "pdf" ? "text-rose-500" : "text-muted-foreground")} />
              <span className="font-medium">PDF (.pdf)</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <Label className="text-base">Filters</Label>
          <div className="grid grid-cols-2 gap-4">
            {/* Category Filter — only for Inventory / Warehouse Stock */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Category Filter</Label>
              {showCategoryFilter ? (
                <div ref={dropdownRef} className="relative" onKeyDown={handleKeyDown}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={config.category || "All Categories"}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-8 py-1 text-sm shadow-sm transition-colors",
                        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        config.category && "placeholder:text-foreground placeholder:font-medium"
                      )}
                      aria-label="Search categories"
                      aria-expanded={isDropdownOpen}
                      aria-controls="category-listbox"
                      role="combobox"
                    />
                    {(config.category || searchQuery) && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setCategory(null);
                          setIsDropdownOpen(false);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Clear category filter"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md animate-in fade-in-0 zoom-in-95">
                      {isCategoriesLoading ? (
                        <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading categories…
                        </div>
                      ) : (
                        <ul
                          id="category-listbox"
                          className="max-h-[200px] overflow-y-auto py-1"
                          role="listbox"
                        >
                          {/* All Categories option */}
                          <li
                            role="option"
                            aria-selected={config.category === null}
                            className={cn(
                              "relative flex cursor-pointer select-none items-center px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                              config.category === null && "bg-accent text-accent-foreground font-medium"
                            )}
                            onClick={() => {
                              setCategory(null);
                              setSearchQuery("");
                              setIsDropdownOpen(false);
                            }}
                          >
                            All Categories
                          </li>
                          {filteredCategories.length === 0 ? (
                            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                              No matching categories
                            </li>
                          ) : (
                            filteredCategories.map((cat) => (
                              <li
                                key={cat}
                                role="option"
                                aria-selected={config.category === cat}
                                className={cn(
                                  "relative flex cursor-pointer select-none items-center px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                  config.category === cat && "bg-accent text-accent-foreground font-medium"
                                )}
                                onClick={() => {
                                  setCategory(cat);
                                  setSearchQuery("");
                                  setIsDropdownOpen(false);
                                }}
                              >
                                {cat}
                              </li>
                            ))
                          )}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-9 items-center rounded-md border border-dashed px-3 text-xs text-muted-foreground">
                  Not applicable
                </div>
              )}
            </div>

            {/* Status filter */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select
                value={config.status || "all"}
                onValueChange={(val) => setStatus(val === "all" ? null : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active / In Stock</SelectItem>
                  <SelectItem value="inactive">Inactive / Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
