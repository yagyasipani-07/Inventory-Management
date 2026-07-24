import { create } from "zustand";

interface FilterState {
  filters: Record<string, string | string[]>;
  setFilter: (key: string, value: string | string[]) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  filters: {},
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  removeFilter: (key) =>
    set((state) => {
      const next = { ...state.filters };
      delete next[key];
      return { filters: next };
    }),
  clearFilters: () => set({ filters: {} }),
}));
