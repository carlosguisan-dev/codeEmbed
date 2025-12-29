
'use client';

import { useState } from 'react';
import Script from 'next/script';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Snippet } from '@/lib/definitions';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

// Define a type for your Web Component's props if it accepts them
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'code-embed': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                'snippet-id': string;
            };
        }
    }
}


export default function DebugEmbedsPage() {
  const { t } = useTranslation();
  const { isUserLoading, firestore, user } = useFirebase();
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null);

  const snippetsQuery = useMemoFirebase(() => {
    if (!firestore || !user) {
      return null;
    }
    return query(collection(firestore, 'snippets'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: snippets, isLoading: areSnippetsLoading } = useCollection<Snippet>(snippetsQuery);

  const isLoading = isUserLoading || areSnippetsLoading;

  return (
    <>
      {/* This script is essential for the <code-embed> web component to function */}
      <Script src="/embed.js" strategy="lazyOnload" />

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{t('debug_embeds_title')}</CardTitle>
            <CardDescription>{t('debug_embeds_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading snippets...</span>
              </div>
            ) : (
              <Select onValueChange={setSelectedSnippetId} disabled={!snippets || snippets.length === 0}>
                <SelectTrigger className="w-full md:w-1/2">
                  <SelectValue placeholder={t('select_snippet_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {snippets?.map((snippet) => (
                    <SelectItem key={snippet.id} value={snippet.id}>
                      {snippet.title} ({snippet.language})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {selectedSnippetId && (
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                This is how the <code>&lt;code-embed&gt;</code> component will render.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed p-4 md:p-6">
                <code-embed snippet-id={selectedSnippetId}></code-embed>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
