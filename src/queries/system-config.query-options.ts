import { queryOptions } from '@tanstack/react-query';
import { systemConfigService } from '@/services/system-config.service';

export const systemConfigQueryOptions = {
  all: queryOptions({
    queryKey: ['system-config'],
    queryFn: systemConfigService.getConfig,
    refetchInterval: 30000, // Refetch every 30s
  }),
};
