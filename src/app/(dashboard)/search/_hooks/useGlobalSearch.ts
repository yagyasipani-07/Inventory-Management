import { create } from "zustand";
import { searchService, SearchCategory, SearchResult } from "../_services/searchService";

interface GlobalSearchState {
  isOpen: boolean;
  query: string;
  results: Record<SearchCategory, SearchResult[]> | null;
  isLoading: boolean;
  
  // Actions
  setIsOpen: (isOpen: boolean) => void;
  setQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  reset: () => void;
}

export const useGlobalSearch = create<GlobalSearchState>((set, get) => ({
  isOpen: false,
  query: "",
  results: null,
  isLoading: false,

  setIsOpen: (isOpen) => {
    set({ isOpen });
    // Load recent searches when opened without a query
    if (isOpen && !get().query && !get().results) {
      get().performSearch("");
    }
  },

  setQuery: (query) => {
    set({ query });
  },

  performSearch: async (query) => {
    set({ isLoading: true });
    try {
      const results = await searchService.searchGlobal(query);
      set({ results, isLoading: false });
    } catch (error) {
      console.error("Search failed:", error);
      set({ isLoading: false, results: null });
    }
  },

  reset: () => set({ query: "", results: null, isLoading: false }),
}));
