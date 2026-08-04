import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { challanService, ChallanFormData, ChallanStatus } from '../_services/challanService';
import { toast } from 'sonner';

export const CHALLANS_QUERY_KEY = ['challans'];

export function useChallans() {
  return useQuery({
    queryKey: CHALLANS_QUERY_KEY,
    queryFn: () => challanService.getChallans(),
  });
}

export function useChallan(id: string) {
  return useQuery({
    queryKey: [...CHALLANS_QUERY_KEY, id],
    queryFn: () => challanService.getChallan(id),
    enabled: !!id,
  });
}

export function useCreateChallan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChallanFormData) => challanService.createChallan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHALLANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentChallans'] });
      queryClient.invalidateQueries({ queryKey: ['recentActivity'] });
      toast.success('Challan created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create challan');
    },
  });
}

export function useUpdateChallan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChallanFormData }) =>
      challanService.updateChallan(id, data),
    onSuccess: (updatedChallan) => {
      queryClient.invalidateQueries({ queryKey: CHALLANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentChallans'] });
      queryClient.invalidateQueries({ queryKey: ['recentActivity'] });
      queryClient.setQueryData([...CHALLANS_QUERY_KEY, updatedChallan.id], updatedChallan);
      toast.success('Challan updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update challan');
    },
  });
}

export function useUpdateChallanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, dispatchDate }: { id: string; status: ChallanStatus; dispatchDate?: string | null }) =>
      challanService.updateStatus(id, status, dispatchDate),
    onSuccess: (updatedChallan) => {
      queryClient.invalidateQueries({ queryKey: CHALLANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentChallans'] });
      queryClient.invalidateQueries({ queryKey: ['recentActivity'] });
      queryClient.setQueryData([...CHALLANS_QUERY_KEY, updatedChallan.id], updatedChallan);
      toast.success(`Challan marked as ${updatedChallan.status}`);
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });
}

export function useUpdateChallanDispatchInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      dispatchDate,
      transport,
      status,
      transportName,
      vehicleNumber,
    }: {
      id: string;
      dispatchDate: string | null;
      transport: string;
      status?: ChallanStatus;
      transportName?: string;
      vehicleNumber?: string;
    }) => challanService.updateDispatchInfo(id, dispatchDate, transport, status, transportName, vehicleNumber),
    onSuccess: (updatedChallan) => {
      queryClient.invalidateQueries({ queryKey: CHALLANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentChallans'] });
      queryClient.invalidateQueries({ queryKey: ['recentActivity'] });
      queryClient.setQueryData([...CHALLANS_QUERY_KEY, updatedChallan.id], updatedChallan);
      toast.success('Dispatch info updated successfully');
    },
    onError: () => {
      toast.error('Failed to update dispatch info');
    },
  });
}


export function useDeleteChallan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => challanService.deleteChallan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHALLANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentChallans'] });
      queryClient.invalidateQueries({ queryKey: ['recentActivity'] });
      toast.success('Challan deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete challan');
    },
  });
}

export function useDuplicateChallan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => challanService.duplicateChallan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHALLANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentChallans'] });
      queryClient.invalidateQueries({ queryKey: ['recentActivity'] });
      toast.success('Challan duplicated as Draft');
    },
    onError: () => {
      toast.error('Failed to duplicate challan');
    },
  });
}
