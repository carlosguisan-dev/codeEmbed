
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
                <CardFooter className="p-4">
                     <Skeleton className="h-6 w-1/4 ml-auto" />
                </CardFooter>
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

  const embedUrl = `/embed/${snippet.id}`;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-transparent">
        <Card id="embed-root" className="w-full max-w-4xl mx-auto border-2 border-primary/20 shadow-xl overflow-hidden text-left rounded-lg flex flex-col">
            <CardContent id="embed-code-content" className="p-0 flex-grow">
            <CodePreview
                code={snippet.code}
                language={snippet.language}
                theme={snippet.theme}
                showLineNumbers={snippet.lineNumbers}
                isEmbed={true}
                className="rounded-none shadow-none border-0"
            />
            </CardContent>

             <CardHeader className="block sm:hidden">
                <CardTitle className="font-headline text-2xl">{snippet.title}</CardTitle>
                 {snippet.description && <CardDescription className="mt-1">{snippet.description}</CardDescription>}
            </CardHeader>
            
            <CardFooter className="bg-muted/50 px-4 py-3 flex items-center justify-between">
                {showTitleInFooter && (
                    <span className="text-sm font-semibold truncate pr-4 hidden sm:block">{snippet.title}</span>
                )}
                <Link href={embedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                    <span>{t('powered_by')}</span>
                    <Logo width={100} height={25} />
                </Link>
            </CardFooter>
        </Card>
        <Card className="w-full max-w-4xl mx-auto mt-6 hidden sm:block">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{snippet.title}</CardTitle>
                {snippet.description && <CardDescription className="mt-1">{snippet.description}</CardDescription>}
            </CardHeader>
        </Card>
    </div>
  );
}

