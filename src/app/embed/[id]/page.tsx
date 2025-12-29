
'use client';

import { notFound, useSearchParams } from 'next/navigation';
import type { Snippet } from '@/lib/definitions';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CodePreview } from '@/components/code-preview';
import { useEffect } from 'react';
import { Logo } from '@/components/icons';
import { useTranslation } from '@/hooks/use-translation';
import Link from 'next/link';

type Props = {
  params: { id: string };
};

export default function EmbedPage({ params }: Props) {
  const { firestore } = useFirebase();
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  // Correctly read search params. Default to true if param is not 'false'.
  const showTitle = searchParams.get('showTitle') !== 'false';
  const showDescription = searchParams.get('showDescription') !== 'false';

  const snippetRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'snippets', params.id) : null),
    [firestore, params.id]
  );
  
  const { data: snippet, isLoading, error } = useDoc<Snippet>(snippetRef);
  
  useEffect(() => {
    // This effect handles incrementing the view count once per session.
    if (snippet && firestore) {
      const sessionStorageKey = `viewed-snippet-${params.id}`;
      // Use client-side sessionStorage
      if (typeof window !== 'undefined') {
        const hasViewed = sessionStorage.getItem(sessionStorageKey);

        // Only increment if the user hasn't viewed this snippet in this session.
        if (!hasViewed) {
          const docRef = doc(firestore, 'snippets', params.id);
          
          updateDoc(docRef, {
            viewCount: increment(1),
          })
          .then(() => {
            // Once the view is successfully recorded, mark it in session storage.
            sessionStorage.setItem(sessionStorageKey, 'true');
          })
          .catch(err => {
            // Silently fail on view count increment error.
            console.error("Failed to increment view count:", err);
          });
        }
      }
    }
  }, [snippet, firestore, params.id]);


  if (isLoading) {
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <Card className="w-full max-w-4xl mx-auto border-2 border-primary/20 shadow-xl rounded-lg">
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

  // A snippet is not found if data is null after loading and there's no error.
  if (!isLoading && !snippet) {
    notFound();
  }
  
  // A public snippet is required for embedding
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
      return null; // Should be covered by isLoading or notFound, but as a fallback.
  }

  const embedUrl = `/embed/${snippet.id}`;

  return (
    <Card id="embed-root" className="w-full max-w-4xl mx-auto border-2 border-primary/20 shadow-xl overflow-hidden text-left rounded-lg flex flex-col">
        {(showTitle || (showDescription && snippet.description)) && (
            <CardHeader id="embed-header">
                {showTitle && <CardTitle className="font-headline text-2xl">{snippet.title}</CardTitle>}
                {showDescription && snippet.description && <CardDescription className="mt-1">{snippet.description}</CardDescription>}
            </CardHeader>
        )}
        
        <CardContent id="embed-code-content" className="p-0 flex-grow">
          <CodePreview
            code={snippet.code}
            language={snippet.language}
            theme={snippet.theme}
            showLineNumbers={snippet.lineNumbers}
            isEmbed={true}
          />
        </CardContent>
        
        <CardFooter className="bg-muted/50 px-4 py-2 mt-auto">
            <Link href={embedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                <span>{t('powered_by')}</span>
                <Logo width={100} height={25} />
            </Link>
        </CardFooter>
    </Card>
  );
}
