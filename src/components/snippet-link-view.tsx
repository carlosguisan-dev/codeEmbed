'use client';

import type { Snippet } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CodePreview } from '@/components/code-preview';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Logo } from './icons';

interface SnippetLinkViewProps {
  snippet: Snippet;
}

export function SnippetLinkView({ snippet }: SnippetLinkViewProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Logo width={150} height={40} />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
            <Button asChild variant="ghost">
                <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    {t('dashboard_title')}
                </Link>
            </Button>
        </nav>
      </header>
      <main className="flex-1 py-8 md:py-12 lg:py-16">
        <div className="container px-4 md:px-6 space-y-8">
            <Card className="w-full mx-auto border-2 border-primary/20 shadow-xl overflow-hidden text-left rounded-lg">
              <CodePreview
                  code={snippet.code}
                  language={snippet.language}
                  theme={snippet.theme}
                  showLineNumbers={snippet.lineNumbers}
                  isEmbed={true}
                  className="rounded-b-none shadow-none border-0"
              />
               <CardFooter className="bg-muted/50 px-4 py-3 flex items-center justify-end">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{t('powered_by')}</span>
                        <Logo width={100} height={25} />
                    </div>
                </CardFooter>
            </Card>
            
            <Card className="w-full mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{snippet.title}</CardTitle>
                    {snippet.description && <CardDescription className="pt-2 text-base">{snippet.description}</CardDescription>}
                </CardHeader>
            </Card>
        </div>
      </main>
    </div>
  );
}
