import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService, CompanySettings, WarehouseSettings, PrintSettings, UserProfile } from "../_services/settingsService";
import { toast } from "sonner";

export function useCompanySettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["settings", "company"],
    queryFn: () => settingsService.getCompanySettings(),
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<CompanySettings>) => settingsService.updateCompanySettings(data),
    onSuccess: (newData) => {
      queryClient.setQueryData(["settings", "company"], newData);
      toast.success("Company settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update company settings");
    },
  });

  return { ...query, update: mutation.mutate, isUpdating: mutation.isPending };
}

export function useWarehouseSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["settings", "warehouse"],
    queryFn: () => settingsService.getWarehouseSettings(),
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<WarehouseSettings>) => settingsService.updateWarehouseSettings(data),
    onSuccess: (newData) => {
      queryClient.setQueryData(["settings", "warehouse"], newData);
      toast.success("Warehouse settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update warehouse settings");
    },
  });

  return { ...query, update: mutation.mutate, isUpdating: mutation.isPending };
}

export function usePrintSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["settings", "print"],
    queryFn: () => settingsService.getPrintSettings(),
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<PrintSettings>) => settingsService.updatePrintSettings(data),
    onSuccess: (newData) => {
      queryClient.setQueryData(["settings", "print"], newData);
      toast.success("Print settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update print settings");
    },
  });

  return { ...query, update: mutation.mutate, isUpdating: mutation.isPending };
}

export function useProfileSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["settings", "profile"],
    queryFn: () => settingsService.getUserProfile(),
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<UserProfile>) => settingsService.updateUserProfile(data),
    onSuccess: (newData) => {
      queryClient.setQueryData(["settings", "profile"], newData);
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  return { ...query, update: mutation.mutate, isUpdating: mutation.isPending };
}
