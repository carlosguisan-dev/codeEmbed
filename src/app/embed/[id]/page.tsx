
'use client';

import { notFound, useSearchParams } from 'next/navigation';
import type { Snippet } from '@/lib/definitions';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useEffect } from 'react';
import { SnippetEmbedView } from '@/components/snippet-embed-view';
import { SnippetLinkView } from '@/components/snippet-link-view';


type Props = {
  params: { id: string };
};

export default function EmbedPage({ params }: Props) {
  const { firestore } = useFirebase();
  const searchParams = useSearchParams();

  // Determine view type. If showTitle is present, it's the iframe view.
  const isIframeView = searchParams.has('showTitle');
  const showTitleInFooter = searchParams.get('showTitle') !== 'false';
  
  const snippetRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'snippets', params.id) : null),
    [firestore, params.id]
  );
  
  const { data: snippet, isLoading, error } = useDoc<Snippet>(snippetRef);
  
  useEffect(() => {
    if (snippet && firestore) {
      const sessionStorageKey = `viewed-snippet-${params.id}`;
      if (typeof window !== 'undefined') {
        const hasViewed = sessionStorage.getItem(sessionStorageKey);

        if (!hasViewed) {
          const docRef = doc(firestore, 'snippets', params.id);
          
          updateDoc(docRef, {
            viewCount: increment(1),
          })
          .then(() => {
            sessionStorage.setItem(sessionStorageKey, 'true');
          })
          .catch(err => {
            console.error("Failed to increment view count:", err);
          });
        }
      }
    }
  }, [snippet, firestore, params.id]);


  if (isLoading) {
    return (
        <div className="p-4 sm:p-6 md:p-8 bg-transparent">
            <Card className="w-full max-w-4xl mx-auto border-2 border-primary/20 shadow-xl rounded-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                </CardHeader>
                <CardContent className="p-0">
                    <Skeleton className="h-64 w-full rounded-none" />
                </CardContent>
            </Card>
        </div>
    )
  }

  if (error) {
    throw error;
  }

  if (!isLoading && !snippet) {
    notFound();
  }
  
  if (snippet && !snippet.isPublic) {
      return (
          <div className="flex items-center justify-center h-full p-4">
              <Card className="w-full max-w-lg text-center">
                  <CardHeader>
                      <CardTitle>Snippet Privado</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p>Este snippet es privado y no puede ser incrustado.</p>
                  </CardContent>
              </Card>
          </div>
      );
  }

  if (!snippet) {
      return null;
  }

  if (isIframeView) {
      return <SnippetEmbedView snippet={snippet} showTitle={showTitleInFooter} />
  }

  return <SnippetLinkView snippet={snippet} />
}

