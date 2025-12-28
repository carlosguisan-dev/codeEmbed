'use client';

import { SnippetForm } from '@/components/snippet-form';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import type { Snippet } from '@/lib/definitions';
import { doc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditSnippetPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { firestore } = useFirebase();

  const snippetRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'snippets', id) : null),
    [firestore, id]
  );

  const { data: snippet, isLoading, error } = useDoc<Snippet>(snippetRef);

  if (isLoading) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-96 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
  }
  
  if (error) {
    // The error is thrown by the useDoc hook via the FirebaseErrorListener
    // so we don't need to render anything here.
    return null;
  }

  // useDoc returns null if the document doesn't exist
  if (!snippet) {
    notFound();
  }

  return <SnippetForm snippet={snippet} />;
}
