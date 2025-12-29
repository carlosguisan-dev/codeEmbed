
'use client';
import { notFound, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CodePreview } from '@/components/code-preview';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import type { Snippet } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { Logo } from '@/components/icons';
import { useTranslation } from '@/hooks/use-translation';


export default function EmbedPageContent({ snippet: initialSnippet, id }: { snippet: Snippet, id: string }) {
  const { firestore } = useFirebase();
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const showTitle = searchParams.get('showTitle') !== 'false';
  const showDescription = searchParams.get('showDescription') !== 'false';

  const snippetRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'snippets', id) : null),
    [firestore, id]
  );
  
  const { data: snippet, isLoading } = useDoc<Snippet>(snippetRef, {
      initialData: initialSnippet
  });

  const displaySnippet = snippet || initialSnippet;

  useEffect(() => {
    // This effect handles incrementing the view count once per session.
    if (displaySnippet && firestore) {
      const sessionStorageKey = `viewed-snippet-${id}`;
      const hasViewed = sessionStorage.getItem(sessionStorageKey);

      // Only increment if the user hasn't viewed this snippet in this session.
      if (!hasViewed) {
        const docRef = doc(firestore, 'snippets', id);
        
        updateDoc(docRef, {
          viewCount: increment(1),
        })
        .then(() => {
          // Once the view is successfully recorded, mark it in session storage.
          sessionStorage.setItem(sessionStorageKey, 'true');
        })
        .catch(err => {
          // Silently fail on view count increment error.
          // It's not critical for the user experience on the embed page.
          console.error("Failed to increment view count:", err);
        });
      }
    }
  }, [displaySnippet, firestore, id]);


  if (isLoading && !displaySnippet) {
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

  if (!displaySnippet) {
    notFound();
  }
  
  const embedUrl = `/embed/${displaySnippet.id}`;
  const isCompact = !showTitle && !showDescription;

  return (
    <div id="embed-root" className="min-h-0">
      <Card className="w-full max-w-4xl mx-auto border-0 shadow-none overflow-hidden rounded-none">
        {(showTitle || showDescription) && !isCompact && (
            <CardHeader id="embed-header">
              <div className="flex items-start gap-4">
                {(showTitle || showDescription) && <FileText className="w-8 h-8 text-primary mt-1 flex-shrink-0" />}
                <div className="flex-grow">
                  {showTitle && <CardTitle className="font-headline text-2xl">{displaySnippet.title}</CardTitle>}
                  {showDescription && <CardDescription className="mt-1">{displaySnippet.description}</CardDescription>}
                </div>
              </div>
            </CardHeader>
        )}
        
        <CardContent id="embed-code-content" className={isCompact ? 'p-0' : ''}>
          <CodePreview
            code={displaySnippet.code}
            language={displaySnippet.language}
            theme={displaySnippet.theme}
            showLineNumbers={displaySnippet.lineNumbers}
            isEmbed={true}
          />
        </CardContent>
        
        <CardFooter id="embed-footer" className="bg-muted/50 p-2">
            <Link href={embedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                <span>{t('powered_by')}</span>
                <Logo width={100} height={25} />
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
