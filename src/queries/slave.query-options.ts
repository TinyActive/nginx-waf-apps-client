import { queryOptions } from '@tanstack/react-query';
import { slaveNodeService } from '@/services/slave.service';

export const slaveNodesQueryOptions = {
  all: queryOptions({
    queryKey: ['slave-nodes', 'list'],
    queryFn: () => slaveNodeService.getAll(),
    staleTime: 30 * 1000, // 30 seconds
  }),

  detail: (id: string) =>
    queryOptions({
      queryKey: ['slave-nodes', 'detail', id],
      queryFn: () => slaveNodeService.getById(id),
      staleTime: 30 * 1000,
    }),

  status: (id: string) =>
    queryOptions({
      queryKey: ['slave-nodes', 'status', id],
      queryFn: () => slaveNodeService.getStatus(id),
      staleTime: 10 * 1000, // 10 seconds
    }),

  syncHistory: (id: string, limit: number = 50) =>
    queryOptions({
      queryKey: ['slave-nodes', 'sync-history', id, limit],
      queryFn: () => slaveNodeService.getSyncHistory(id, limit),
      staleTime: 30 * 1000,
    }),
};
