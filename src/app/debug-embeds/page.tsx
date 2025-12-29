
'use client';

import { useState } from 'react';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Snippet } from '@/lib/definitions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { TranslationProvider, useTranslation } from '@/hooks/use-translation';

function DebugEmbedsPageContent() {
  const { firestore, user } = useFirebase();
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null);
  const { t } = useTranslation();

  const publicSnippetsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'snippets'),
      where('userId', '==', user.uid),
      where('isPublic', '==', true)
    );
  }, [firestore, user]);

  const { data: snippets, isLoading } = useCollection<Snippet>(publicSnippetsQuery);

  const handleSelectChange = (snippetId: string) => {
    setSelectedSnippetId(snippetId);
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const embedUrl = selectedSnippetId ? `${baseUrl}/embed/${selectedSnippetId}` : '';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Debug Embeds</h1>

      <Card>
        <CardHeader>
          <CardTitle>Select a Public Snippet to Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : snippets && snippets.length > 0 ? (
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Select a snippet..." />
              </SelectTrigger>
              <SelectContent>
                {snippets.map((snippet) => (
                  <SelectItem key={snippet.id} value={snippet.id}>
                    {snippet.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-muted-foreground">You have no public snippets to preview.</p>
          )}
        </CardContent>
      </Card>

      {selectedSnippetId && (
        <Card>
          <CardHeader>
            <CardTitle>Iframe Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full aspect-video rounded-lg border bg-muted">
              <iframe
                key={selectedSnippetId}
                src={embedUrl}
                className="w-full h-full"
                title="Snippet Embed Preview"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
             <div className="mt-4">
                <p className="text-sm font-medium">Embed URL:</p>
                <code className="text-xs bg-muted text-muted-foreground p-2 rounded-md block mt-1">{embedUrl}</code>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


export default function DebugEmbedsPage() {
    return (
        <TranslationProvider>
            <DebugEmbedsPageContent />
        </TranslationProvider>
    )
}
