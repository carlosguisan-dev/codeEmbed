'use client';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { DashboardClient } from '@/components/dashboard-client';
import type { Snippet } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { firestore, user, isUserLoading } = useFirebase();

  const snippetsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'snippets'),
      where('userId', '==', user.uid)
    );
  }, [firestore, user]);

  const {
    data: snippets,
    isLoading,
    error,
  } = useCollection<Snippet>(snippetsQuery);

  if (isLoading || isUserLoading) {
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

  if (error) {
      // The error is thrown by the useCollection hook via the FirebaseErrorListener
      // so we don't need to render anything here.
      return null;
  }

  return <DashboardClient snippets={snippets || []} />;
}
