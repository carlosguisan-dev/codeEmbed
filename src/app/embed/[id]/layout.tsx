
import type { ReactNode } from 'react';
import '@/app/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/components/app-provider';
import { cn } from '@/lib/utils';
import { Work_Sans, Fira_Code } from 'next/font/google';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
});

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("font-body antialiased bg-transparent", workSans.variable, firaCode.variable)}>
        <AppProvider>
          <div id="embed-content" className="h-full">
            {children}
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
