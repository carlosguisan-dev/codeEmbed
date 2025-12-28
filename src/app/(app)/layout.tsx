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
import { CodeXml, LayoutDashboard } from 'lucide-react';
import { Logo } from '@/components/icons';
import { FirebaseClientProvider } from '@/firebase';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
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
    </FirebaseClientProvider>
  );
}
