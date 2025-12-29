
'use client';

import { notFound } from 'next/navigation';
import type { Snippet } from '@/lib/definitions';
import { doc } from 'firebase/firestore';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { SnippetLinkView } from '@/components/snippet-link-view';
import { useTranslation } from '@/hooks/use-translation';


type Props = {
  params: { id: string };
};

function PrivateSnippetNotice() {
    const { t } = useTranslation();
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Card className="w-full max-w-lg text-center p-8">
            <CardContent>
                <h2 className="text-2xl font-bold font-headline mb-4">{t('private_snippet_warning_title')}</h2>
                <p>{t('private_snippet_warning')}</p>
            </CardContent>
        </Card>
      </div>
    );
}

export default function SnippetPage({ params }: Props) {
  const { firestore } = useFirebase();

  const snippetRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'snippets', params.id) : null),
    [firestore, params.id]
  );
  
  const { data: snippet, isLoading, error } = useDoc<Snippet>(snippetRef);

  if (isLoading) {
    return (
        <div className="container mx-auto p-8 space-y-8">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[150px] w-full" />
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

  return <SnippetLinkView snippet={snippet} />
}
