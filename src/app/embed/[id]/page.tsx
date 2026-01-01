
'use client';

import { notFound, useSearchParams } from 'next/navigation';
import type { Snippet } from '@/lib/definitions';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useEffect } from 'react';
import { SnippetEmbedView } from '@/components/snippet-embed-view';
import { useTranslation } from '@/hooks/use-translation';


type Props = {
  params: { id: string };
};

function PrivateSnippetNotice() {
    const { t } = useTranslation();
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <h2 className="text-2xl font-bold font-headline">{t('private_snippet_warning_title')}</h2>
          </CardHeader>
          <CardContent>
            <p>{t('private_snippet_embed_warning')}</p>
          </CardContent>
        </Card>
      </div>
    );
}


export default function EmbedPage({ params }: Props) {
  const { firestore } = useFirebase();
  const searchParams = useSearchParams();

  // Determine view type. If showTitle is present, it's the iframe view.
  const showTitle = searchParams.get('showTitle') === 'true';
  
  const snippetRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'snippets', params.id) : null),
    [firestore, params.id]
  );
  
  const { data: snippet, isLoading, error } = useDoc<Snippet>(snippetRef);
  
  /*
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
  */


  if (isLoading) {
    return (
        <div className="w-full h-full p-4 sm:p-6 md:p-8 bg-transparent">
            <Card className="w-full h-full max-w-4xl mx-auto border-2 border-primary/20 shadow-xl rounded-lg flex flex-col">
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                    <Skeleton className="h-full w-full rounded-none" />
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
      return <PrivateSnippetNotice />;
  }

  if (!snippet) {
      return null;
  }

  return <SnippetEmbedView snippet={snippet} showTitle={showTitle} />
}
