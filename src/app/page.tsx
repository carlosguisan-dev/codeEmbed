'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Code, Share2, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function LandingPage() {
  const { t } = useTranslation();

  const codeExample = `
<span class="text-purple-400">function</span> <span class="text-blue-400">helloWorld</span>() {
  <span class="text-purple-400">console</span>.<span class="text-yellow-400">log</span>(<span class="text-green-400">"Hello, World!"</span>);
}

<span class="text-blue-400">helloWorld</span>();
  `.trim();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Logo width={150} height={40} />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
            <Button asChild variant="ghost">
                <Link href="/dashboard">
                    {t('go_to_app_button')}
                </Link>
            </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    {t('landing_title')}
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    {t('landing_desc')}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      {t('landing_cta_button')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-6 flex items-center justify-center">
                  <div className="w-full max-w-md bg-card rounded-lg border shadow-lg overflow-hidden">
                      <div className="flex justify-between items-center px-4 py-2 border-b">
                          <span className="text-xs text-foreground/80">javascript</span>
                          <span className="text-xs text-foreground/50">code-embed.app</span>
                      </div>
                      <pre className="text-sm text-foreground/90 whitespace-pre-wrap break-words p-4">
                        <code dangerouslySetInnerHTML={{ __html: codeExample }} />
                      </pre>
                       <div className="bg-muted/50 px-4 py-2 border-t">
                            <Link href="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                                <span>{t('powered_by')}</span>
                                <Logo width={100} height={25} />
                            </Link>
                        </div>
                  </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
