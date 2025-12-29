
'use client';

import type { Snippet } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CodePreview } from '@/components/code-preview';
import { Logo } from '@/components/icons';
import { useTranslation } from '@/hooks/use-translation';
import Link from 'next/link';

interface SnippetLinkViewProps {
  snippet: Snippet;
}

export function SnippetLinkView({ snippet }: SnippetLinkViewProps) {
  const { t } = useTranslation();
  const embedUrl = `/embed/${snippet.id}`;

  return (
    <div className="p-4 sm:p-6 md:p-8">
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
            
             <CardFooter className="bg-muted/50 px-4 py-3 flex items-center justify-between">
                <Link href={embedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                    <span>{t('powered_by')}</span>
                    <Logo width={100} height={25} />
                </Link>
            </CardFooter>
        </Card>
        
        <Card className="w-full max-w-4xl mx-auto mt-6">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{snippet.title}</CardTitle>
                {snippet.description && <CardDescription className="mt-1">{snippet.description}</CardDescription>}
            </CardHeader>
        </Card>
    </div>
  );
}
