'use client';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { TranslationProvider } from '@/hooks/use-translation';
import React, { useEffect } from 'react';
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
import { CodeXml, LayoutDashboard } from 'lucide-react';
import { Logo } from '@/components/icons';
import { FirebaseClientProvider, useFirebase } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login';
  const isPublicPage = pathname === '/';
  const isEmbedPage = pathname.startsWith('/embed');

  const isAppPage = !isAuthPage && !isPublicPage && !isEmbedPage;

  useEffect(() => {
    if (isAppPage && !isUserLoading && !user) {
      router.push('/login');
    }
    if (isAuthPage && !isUserLoading && user) {
        router.push('/dashboard');
    }
  }, [user, isUserLoading, router, isAppPage, isAuthPage]);

  if (isPublicPage || isAuthPage || isEmbedPage) {
    return <>{children}</>;
  }

  // Render loading state for protected app pages
  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full">
        <div className="hidden md:flex flex-col gap-4 p-2 border-r bg-card">
          <div className="flex items-center gap-2 p-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-2 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <header className="flex h-16 items-center gap-4 border-b px-4 md:px-6">
            <Skeleton className="h-8 w-8 md:hidden" />
            <div className="flex-1">
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </header>
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              <Skeleton className="h-9 w-48" />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </main>
        </div>
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
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="New Snippet">
                <Link href="/snippets/new">
                  <CodeXml />
                  <span>New Snippet</span>
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="icon" href="https://50594343.fs1.hubspotusercontent-na1.net/hubfs/50594343/favicon-s.png" type="image/png" />
      </head>
      <body className="font-body antialiased">
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
