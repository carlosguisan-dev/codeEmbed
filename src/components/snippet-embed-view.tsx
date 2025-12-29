
'use client';

import type { Snippet } from '@/lib/definitions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CodePreview } from '@/components/code-preview';
import { Logo } from '@/components/icons';
import { useTranslation } from '@/hooks/use-translation';
import Link from 'next/link';

interface SnippetEmbedViewProps {
  snippet: Snippet;
  showTitle: boolean;
}

export function SnippetEmbedView({ snippet, showTitle }: SnippetEmbedViewProps) {
  const { t } = useTranslation();
  const embedUrl = `/embed/${snippet.id}`;

  return (
    <div className="p-0 sm:p-2 md:p-4 bg-transparent h-full">
      <Card id="embed-root" className="w-full h-full mx-auto border-2 border-primary/20 shadow-xl overflow-hidden text-left rounded-lg flex flex-col">
        <CardContent id="embed-code-content" className="p-0 flex-grow">
          <CodePreview
            code={snippet.code}
            language={snippet.language}
            theme={snippet.theme}
            showLineNumbers={snippet.lineNumbers}
            isEmbed={true}
            className="rounded-none shadow-none border-0 h-full"
          />
        </CardContent>
        
        <CardFooter className="bg-muted/50 px-4 py-3 flex items-center justify-between">
            {showTitle && (
                <span className="text-sm font-semibold truncate pr-4">{snippet.title}</span>
            )}
            <Link href={embedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                <span>{t('powered_by')}</span>
                <Logo width={100} height={25} />
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
