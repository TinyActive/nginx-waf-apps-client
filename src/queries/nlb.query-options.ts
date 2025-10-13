import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as nlbService from '@/services/nlb.service';
import { createQueryKeys } from '@/lib/query-client';
import type { CreateNLBInput, UpdateNLBInput, NetworkLoadBalancer } from '@/types';

// Create query keys for NLB operations
export const nlbQueryKeys = createQueryKeys('nlb');

// Query options for NLBs
export const nlbQueryOptions = {
  // Get all NLBs with pagination and search
  all: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    protocol?: string;
    enabled?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => ({
    queryKey: [...nlbQueryKeys.lists(), params],
    queryFn: () => nlbService.getNLBs(params),
  }),

  // Get NLB by ID
  byId: (id: string) => ({
    queryKey: nlbQueryKeys.detail(id),
    queryFn: () => nlbService.getNLBById(id),
  }),

  // Get NLB statistics
  stats: {
    queryKey: [...nlbQueryKeys.lists(), 'stats'],
    queryFn: nlbService.getNLBStats,
  },
};

// Mutation options for NLBs
export const nlbMutationOptions = {
  // Create NLB
  create: {
    mutationFn: (data: CreateNLBInput) => nlbService.createNLB(data),
    onSuccess: () => {
      console.log('NLB created successfully');
    },
    onError: (error: any) => {
      console.error('NLB creation failed:', error);
    },
  },

  // Update NLB
  update: {
    mutationFn: ({ id, data }: { id: string; data: UpdateNLBInput }) =>
      nlbService.updateNLB(id, data),
    onSuccess: () => {
      console.log('NLB updated successfully');
    },
    onError: (error: any) => {
      console.error('NLB update failed:', error);
    },
  },

  // Delete NLB
  delete: {
    mutationFn: (id: string) => nlbService.deleteNLB(id),
    onSuccess: () => {
      console.log('NLB deleted successfully');
    },
    onError: (error: any) => {
      console.error('NLB deletion failed:', error);
    },
  },

  // Toggle NLB enabled status
  toggle: {
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      nlbService.toggleNLB(id, enabled),
    onSuccess: (data: NetworkLoadBalancer) => {
      console.log(`NLB ${data.enabled ? 'enabled' : 'disabled'} successfully`);
    },
    onError: (error: any) => {
      console.error('NLB toggle failed:', error);
    },
  },

  // Perform health check
  healthCheck: {
    mutationFn: (id: string) => nlbService.performHealthCheck(id),
    onSuccess: () => {
      console.log('Health check completed successfully');
    },
    onError: (error: any) => {
      console.error('Health check failed:', error);
    },
  },
};

// Hooks for using queries
export const useNLBs = (params?: Parameters<typeof nlbQueryOptions.all>[0]) => {
  return useQuery(nlbQueryOptions.all(params));
};

export const useNLB = (id: string) => {
  return useQuery(nlbQueryOptions.byId(id));
};

export const useNLBStats = () => {
  return useQuery(nlbQueryOptions.stats);
};

// Hooks for using mutations
export const useCreateNLB = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...nlbMutationOptions.create,
    onSuccess: () => {
      nlbMutationOptions.create.onSuccess();
      queryClient.invalidateQueries({ queryKey: nlbQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: [...nlbQueryKeys.lists(), 'stats'] });
    },
  });
};

export const useUpdateNLB = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...nlbMutationOptions.update,
    onSuccess: (data) => {
      nlbMutationOptions.update.onSuccess();
      queryClient.invalidateQueries({ queryKey: nlbQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: nlbQueryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: [...nlbQueryKeys.lists(), 'stats'] });
    },
  });
};

export const useDeleteNLB = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...nlbMutationOptions.delete,
    onSuccess: () => {
      nlbMutationOptions.delete.onSuccess();
      queryClient.invalidateQueries({ queryKey: nlbQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: [...nlbQueryKeys.lists(), 'stats'] });
    },
  });
};

export const useToggleNLB = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...nlbMutationOptions.toggle,
    onSuccess: (data) => {
      nlbMutationOptions.toggle.onSuccess(data);
      queryClient.invalidateQueries({ queryKey: nlbQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: nlbQueryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: [...nlbQueryKeys.lists(), 'stats'] });
    },
  });
};

export const useHealthCheck = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...nlbMutationOptions.healthCheck,
    onSuccess: (_data, variables) => {
      nlbMutationOptions.healthCheck.onSuccess();
      queryClient.invalidateQueries({ queryKey: nlbQueryKeys.detail(variables) });
    },
  });
};
