'use client';

import { Button } from '@/components/ui/button';
import { useFirebase } from '@/firebase';
import { Home, Frown } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  const { user } = useFirebase();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <Frown className="w-24 h-24 text-primary animate-bounce" />
      <h1 className="mt-8 text-4xl font-bold font-headline tracking-tight">404 - Página no encontrada</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <div className="mt-10">
        <Button asChild>
          <Link href={user ? "/dashboard" : "/"}>
            <Home className="mr-2 h-5 w-5" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
