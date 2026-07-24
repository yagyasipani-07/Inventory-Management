import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { auditService, AuditFilters, AuditLog } from "../_services/auditService";

interface AuditStore {
  filters: Partial<AuditFilters>;
  setFilters: (filters: Partial<AuditFilters>) => void;
  updateFilter: <K extends keyof AuditFilters>(key: K, value: AuditFilters[K]) => void;
  clearFilters: () => void;
  
  selectedLog: AuditLog | null;
  setSelectedLog: (log: AuditLog | null) => void;
}

const defaultFilters: Partial<AuditFilters> = {
  search: "",
  module: "All",
  action: "All",
  status: "All",
};

export const useAuditStore = create<AuditStore>((set) => ({
  filters: defaultFilters,
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  clearFilters: () => set({ filters: defaultFilters }),
  
  selectedLog: null,
  setSelectedLog: (log) => set({ selectedLog: log }),
}));

export function useAuditLogs() {
  const filters = useAuditStore((state) => state.filters);
  
  return useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () => auditService.getAuditLogs(filters),
  });
}

export function useAuditSummary() {
  return useQuery({
    queryKey: ["audit-summary"],
    queryFn: () => auditService.getAuditSummary(),
  });
}

export function useTimeline() {
  return useQuery({
    queryKey: ["audit-timeline"],
    queryFn: () => auditService.getTimeline(),
  });
}
