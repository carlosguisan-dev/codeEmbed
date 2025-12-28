'use client';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { DashboardClient } from '@/components/dashboard-client';
import type { Snippet } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardLoading() {
  return (
    <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-10 w-36" />
        </div>
         <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
    </div>
  );
}

function DashboardData({ userId }: { userId: string }) {
  const { firestore } = useFirebase();

  const snippetsQuery = useMemoFirebase(() => {
    // This query will only be built when both firestore and userId are available.
    if (!firestore || !userId) return null;
    return query(
      collection(firestore, 'snippets'),
      where('userId', '==', userId)
    );
  }, [firestore, userId]);

  const {
    data: snippets,
    isLoading,
    error,
  } = useCollection<Snippet>(snippetsQuery);

  // Show loading skeleton while the query is running.
  // The query will only run when snippetsQuery is not null.
  if (isLoading) {
    return <DashboardLoading />;
  }

  // The FirebaseErrorListener will catch and throw the error, so we don't need to render an error message here.
  if (error) {
    return null;
  }

  // Render the client component with the fetched data (or an empty array if there's none).
  return <DashboardClient snippets={snippets || []} />;
}

export default function DashboardPage() {
  const { user, isUserLoading } = useFirebase();

  // Show the loading skeleton while the user authentication state is being determined.
  if (isUserLoading) {
    return <DashboardLoading />;
  }

  // If there's no user, we can show a message or redirect, but for now, we'll show the loading state
  // as the layout should handle the redirect to login.
  if (!user) {
    return <DashboardLoading />;
  }

  // Once we have a user, render the DashboardData component with the user's ID.
  return <DashboardData userId={user.uid} />;
}
