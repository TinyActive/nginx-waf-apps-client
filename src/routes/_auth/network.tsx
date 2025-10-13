import { createFileRoute } from '@tanstack/react-router';
import NetworkLoadBalancer from '@/components/pages/NetworkLoadBalancer';
import { nlbQueryOptions } from '@/queries/nlb.query-options';

export const Route = createFileRoute('/_auth/network')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context;

    // Prefetch NLB data
    queryClient.prefetchQuery(
      nlbQueryOptions.all({
        page: 1,
        limit: 10,
        search: '',
        status: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })
    );
    queryClient.prefetchQuery(nlbQueryOptions.stats);

    return {};
  },
});

function RouteComponent() {
  return <NetworkLoadBalancer />;
}
