import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import * as accessListsService from '@/services/access-lists.service';
import type {
  CreateAccessListInput,
  UpdateAccessListInput,
  ApplyToDomainInput,
} from '@/services/access-lists.service';

/**
 * Query options for getting all access lists
 */
export const accessListsQueryOptions = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  enabled?: boolean;
}) =>
  queryOptions({
    queryKey: ['access-lists', params],
    queryFn: () => accessListsService.getAccessLists(params),
  });

/**
 * Query options for getting single access list
 */
export const accessListQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['access-lists', id],
    queryFn: () => accessListsService.getAccessList(id),
    enabled: !!id,
  });

/**
 * Query options for getting access lists by domain
 */
export const accessListsByDomainQueryOptions = (domainId: string) =>
  queryOptions({
    queryKey: ['access-lists', 'domain', domainId],
    queryFn: () => accessListsService.getAccessListsByDomain(domainId),
    enabled: !!domainId,
  });

/**
 * Query options for getting access lists statistics
 */
export const accessListsStatsQueryOptions = () =>
  queryOptions({
    queryKey: ['access-lists', 'stats'],
    queryFn: () => accessListsService.getAccessListsStats(),
  });

/**
 * Mutation hook for creating access list
 */
export const useCreateAccessList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccessListInput) => accessListsService.createAccessList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access-lists'] });
    },
  });
};

/**
 * Mutation hook for updating access list
 */
export const useUpdateAccessList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccessListInput }) =>
      accessListsService.updateAccessList(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['access-lists'] });
      queryClient.invalidateQueries({ queryKey: ['access-lists', variables.id] });
    },
  });
};

/**
 * Mutation hook for deleting access list
 */
export const useDeleteAccessList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accessListsService.deleteAccessList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access-lists'] });
    },
  });
};

/**
 * Mutation hook for toggling access list
 */
export const useToggleAccessList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      accessListsService.toggleAccessList(id, enabled),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['access-lists'] });
      queryClient.invalidateQueries({ queryKey: ['access-lists', variables.id] });
    },
  });
};

/**
 * Mutation hook for applying access list to domain
 */
export const useApplyToDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApplyToDomainInput) => accessListsService.applyToDomain(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access-lists'] });
      queryClient.invalidateQueries({ queryKey: ['domains'] });
    },
  });
};

/**
 * Mutation hook for removing access list from domain
 */
export const useRemoveFromDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accessListId, domainId }: { accessListId: string; domainId: string }) =>
      accessListsService.removeFromDomain(accessListId, domainId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access-lists'] });
      queryClient.invalidateQueries({ queryKey: ['domains'] });
    },
  });
};
