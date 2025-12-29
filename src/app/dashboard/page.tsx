'use client';

import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Snippet } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import Link from 'next/link';
import { PlusCircle, Loader2 } from 'lucide-react';
import { SnippetCard } from '@/components/snippet-card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { isUserLoading, firestore, user } = useFirebase();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Query for snippets created by the current user.
  const snippetsQuery = useMemoFirebase(() => {
    if (!firestore || !user) {
      return null;
    }
    return query(collection(firestore, 'snippets'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: snippets, isLoading: areSnippetsLoading } =
    useCollection<Snippet>(snippetsQuery);
    
  const handleSnippetClick = (snippetId: string) => {
    setIsNavigating(true);
    router.push(`/snippets/${snippetId}/edit`);
  };


  // Show a loading state while auth or data fetching is in progress.
  if (isUserLoading || areSnippetsLoading || isNavigating) {
    return <DashboardLoading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold font-headline">{t('my_snippets_title')}</h1>
        <Button asChild>
          <Link href="/snippets/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            {t('create_snippet_button')}
          </Link>
        </Button>
      </div>

      {snippets && snippets.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {snippets.map(snippet => (
            <div key={snippet.id} onClick={() => handleSnippetClick(snippet.id)} className="cursor-pointer">
                <SnippetCard snippet={snippet} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">{t('no_snippets_found_title')}</h3>
            <p className="text-muted-foreground mt-2">{t('no_snippets_found_desc')}</p>
            <Button asChild className="mt-4">
                <Link href="/snippets/new">{t('create_first_snippet_button')}</Link>
            </Button>
        </div>
      )}
    </div>
  );
}
