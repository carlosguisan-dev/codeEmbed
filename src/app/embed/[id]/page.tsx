'use client';
import { notFound } from 'next/navigation';
import { CodePreview } from '@/components/code-preview';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { FirebaseClientProvider, useDoc, useFirebase, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import type { Snippet } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';

function EmbedPageContent({ id }: { id: string }) {
  const { firestore } = useFirebase();
  const snippetRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'snippets', id) : null),
    [firestore, id]
  );
  const { data: snippet, isLoading } = useDoc<Snippet>(snippetRef);

  useEffect(() => {
    if (snippet && firestore) {
      const docRef = doc(firestore, 'snippets', snippet.id);
      // Use the non-blocking update function to increment the view count
      // Errors will be caught and emitted by the global error handler
      updateDocumentNonBlocking(docRef, {
        viewCount: increment(1),
      });
    }
  }, [snippet, firestore]);


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

  if (!snippet) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-4xl mx-auto border-2 border-primary/20 shadow-xl">
        <CardHeader>
          <div className="flex items-start gap-4">
            <FileText className="w-8 h-8 text-primary mt-1" />
            <div>
              <CardTitle className="font-headline text-2xl">
                {snippet.title}
              </CardTitle>
              <CardDescription>{snippet.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CodePreview
            code={snippet.code}
            language={snippet.language}
            theme={snippet.theme}
            showLineNumbers={snippet.lineNumbers}
            isEmbed={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}


export default function EmbedPage({ params }: { params: { id: string } }) {
    return (
        <FirebaseClientProvider>
            <EmbedPageContent id={params.id} />
        </FirebaseClientProvider>
    )
}
