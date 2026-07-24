"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useGlobalSearch } from "../_hooks/useGlobalSearch";
import { SearchCategory, SearchResult } from "../_services/searchService";
import { Package, Users, FileText, Warehouse, Activity, Settings, Loader2 } from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, setIsOpen, query, setQuery, performSearch, results, isLoading } = useGlobalSearch();

  // Toggle palette with Ctrl+K / Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) {
        performSearch(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen, performSearch]);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const renderIcon = (iconName?: string) => {
    const iconClass = "mr-2 h-4 w-4 text-muted-foreground";
    switch (iconName) {
      case "box": return <Package className={iconClass} />;
      case "users": return <Users className={iconClass} />;
      case "fileText": return <FileText className={iconClass} />;
      case "warehouse": return <Warehouse className={iconClass} />;
      case "activity": return <Activity className={iconClass} />;
      case "settings": return <Settings className={iconClass} />;
      default: return null;
    }
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput 
        placeholder="Search products, customers, challans, or audit logs..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isLoading && (
          <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </div>
        )}
        
        {!isLoading && results && Object.keys(results).length === 0 && (
          <CommandEmpty>No matching results.</CommandEmpty>
        )}
        
        {!isLoading && results && Object.entries(results).map(([category, items]) => (
          <CommandGroup key={category} heading={category}>
            {items.map((item) => (
              <CommandItem 
                key={item.id} 
                onSelect={() => handleSelect(item.href)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  {renderIcon(item.icon)}
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                  </div>
                </div>
                {item.shortcut && (
                  <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    {item.shortcut}
                  </kbd>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
