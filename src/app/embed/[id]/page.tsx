'use client';

import { notFound } from 'next/navigation';
import type { Snippet } from '@/lib/definitions';
import { doc } from 'firebase/firestore';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import EmbedPageContent from './embed-page-content';

type Props = {
  params: { id: string };
};

export default function EmbedPage({ params }: Props) {
  const { firestore } = useFirebase();

  const snippetRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'snippets', params.id) : null),
    [firestore, params.id]
  );
  
  const { data: snippet, isLoading, error } = useDoc<Snippet>(snippetRef);
  
  if (isLoading) {
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <Card className="w-full max-w-4xl mx-auto border-2 border-primary/20 shadow-xl">
                <CardHeader>
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
        </div>
    )
  }

  if (error) {
    // This will be caught by the global error boundary
    throw error;
  }

  if (!snippet) {
    notFound();
  }

  return <EmbedPageContent snippet={snippet} id={params.id} />;
}
