'use client';
import './globals.css';
import { Work_Sans, Fira_Code } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { TranslationProvider, useTranslation } from '@/hooks/use-translation';
import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppHeader } from '@/components/app-header';
import Link from 'next/link';
import { LayoutDashboard, Loader2, Code } from 'lucide-react';
import { Logo } from '@/components/icons';
import { FirebaseClientProvider, useFirebase } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
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


function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useFirebase();
  const { t } = useTranslation();

  const isPublicPage = pathname === '/';
  const isLoginPage = pathname === '/login';
  const isEmbedPage = pathname.startsWith('/embed');
  const isAppPage = !isPublicPage && !isLoginPage && !isEmbedPage;

  useEffect(() => {
    if (isUserLoading) return; // Wait until loading is finished

    // If user is not logged in and tries to access an app page, redirect to login
    if (!user && isAppPage) {
      router.push('/login');
    }

    // If user is logged in and tries to access login page, redirect to dashboard
    if (user && isLoginPage) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, isAppPage, isLoginPage, router]);


  if (isPublicPage || isEmbedPage) {
    return <>{children}</>;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }
  
  if (isUserLoading && isAppPage) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && isAppPage) {
    // This will be briefly visible before the useEffect redirect kicks in
    // Or if the redirect fails for some reason.
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  // Render the full app layout for authenticated users
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Logo width={150} height={40} />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('dashboard_title')}>
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>{t('dashboard_title')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('new_snippet_title')}>
                    <Link href="/snippets/new">
                        <Code/>
                        <span>{t('new_snippet_title')}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={cn("font-body antialiased", workSans.variable, firaCode.variable)}>
        <FirebaseClientProvider>
          <TranslationProvider>
            <AppLayout>
              {children}
            </AppLayout>
            <Toaster />
          </TranslationProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
