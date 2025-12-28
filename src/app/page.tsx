'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Code, Share2, ArrowRight } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    router.push('/dashboard');
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold font-headline">CodeEmbed</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Crea y Comparte Snippets de Código con Estilo
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    CodeEmbed te permite crear, personalizar y compartir tus fragmentos de código de una manera visualmente atractiva y sencilla.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">
                      Empezar ahora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-6 flex items-center justify-center">
                  <div className="w-full max-w-md bg-card p-4 rounded-lg border shadow-lg">
                      <div className="flex justify-between items-center pb-2 border-b mb-2">
                          <span className="text-xs text-foreground/80">javascript</span>
                          <span className="text-xs text-foreground/50">code-embed.app</span>
                      </div>
                      <pre className="text-sm text-foreground/90 overflow-x-auto">
<code><span className="text-purple-400">function</span> <span className="text-blue-400">helloWorld</span>() {'{'}
  <span className="text-purple-400">console</span>.<span className="text-yellow-400">log</span>(<span className="text-green-400">"Hello, World!"</span>);
{'}'}

<span className="text-blue-400">helloWorld</span>();
</code>
                      </pre>
                  </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
