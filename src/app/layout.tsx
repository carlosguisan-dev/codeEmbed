import type { Metadata } from 'next';
import './globals.css';
import { Work_Sans, Fira_Code } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/components/app-provider';
import { cn } from '@/lib/utils';


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

export const metadata: Metadata = {
  title: 'CodeEmbed - Crea y Comparte Snippets de Código con Estilo',
  description: 'CodeEmbed te permite crear, personalizar y compartir tus fragmentos de código de una manera visualmente atractiva y sencilla.',
  openGraph: {
    title: 'CodeEmbed - Crea y Comparte Snippets de Código con Estilo',
    description: 'CodeEmbed te permite crear, personalizar y compartir tus fragmentos de código de una manera visualmente atractiva y sencilla.',
    url: 'https://codeembed.dev', // Replace with your actual domain
    siteName: 'CodeEmbed',
    images: [
      {
        url: 'https://picsum.photos/seed/codeembed-social/1200/630', // Replace with a branded image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeEmbed - Crea y Comparte Snippets de Código con Estilo',
    description: 'CodeEmbed te permite crear, personalizar y compartir tus fragmentos de código de una manera visualmente atractiva y sencilla.',
    images: ['https://picsum.photos/seed/codeembed-social/1200/630'], // Replace with a branded image
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={cn("font-body antialiased", workSans.variable, firaCode.variable)}>
          <AppProvider>
            {children}
          </AppProvider>
          <Toaster />
      </body>
    </html>
  );
}
