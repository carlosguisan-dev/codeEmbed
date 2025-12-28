'use client';
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
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

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

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Logo className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-semibold font-headline text-primary-foreground group-data-[collapsible=icon]:hidden">
              CodeEmbed
            </h1>
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


export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedAppLayout>{children}</ProtectedAppLayout>
    );
  }
