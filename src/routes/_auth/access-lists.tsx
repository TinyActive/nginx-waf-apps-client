import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { accessListsQueryOptions } from '@/queries/access-lists.query-options';
import { AccessListsContent } from '@/components/access-lists/AccessListsContent';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/_auth/access-lists')({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(accessListsQueryOptions({ page: 1, limit: 10 }));
  },
  component: AccessListsPage,
  pendingComponent: AccessListsPageSkeleton,
});

function AccessListsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Access Lists</h1>
          <p className="text-muted-foreground mt-2">
            Manage IP whitelists and HTTP Basic Authentication for your domains
          </p>
        </div>
      </div>

      <Suspense fallback={<AccessListsPageSkeleton />}>
        <AccessListsContent />
      </Suspense>
    </div>
  );
}

function AccessListsPageSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}
