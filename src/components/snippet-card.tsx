'use client';
import type { Snippet } from '@/lib/definitions';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';


export function SnippetCard({ snippet }: { snippet: Snippet }) {
  const { t } = useTranslation();
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (snippet && snippet.createdAt) {
        // Firebase Timestamps can be objects, so we need to convert them
        const date = typeof snippet.createdAt === 'string' ? new Date(snippet.createdAt) : (snippet.createdAt as any).toDate();
        setFormattedDate(date.toLocaleDateString());
    }
  }, [snippet]);


  return (
    <Card className="flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1 pr-4">
            <CardTitle className="font-headline text-xl leading-tight">{snippet.title}</CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
            <Badge variant="secondary">{snippet.language}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {snippet.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                <span>{snippet.isPublic ? t('public') : t('private')}</span>
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}
