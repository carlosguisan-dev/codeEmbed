'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { CodePreview } from '@/components/code-preview';
import { Card, CardFooter } from '@/components/ui/card';

export default function LandingPage() {
  const { t } = useTranslation();

  const codeExample = `
function helloWorld() {
  console.log("Hello, World!");
}

helloWorld();
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
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                  {t('landing_title')}
                </h1>
                <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
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

               <div className="w-full max-w-3xl pt-8">
                  <Card className="w-full border-2 border-primary/20 shadow-xl overflow-hidden text-left">
                    <CodePreview
                      code={codeExample}
                      language="javascript"
                      theme="dark"
                      showLineNumbers={true}
                      isEmbed={true}
                    />
                    <CardFooter className="bg-muted/50 px-4 py-2">
                      <Link href="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                          <span>{t('powered_by')}</span>
                          <Logo width={100} height={25} />
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
