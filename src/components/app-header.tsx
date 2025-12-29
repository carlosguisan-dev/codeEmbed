'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';

export function AppHeader() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const getTitle = () => {
    if (pathname.includes('/dashboard')) return t('dashboard_title');
    if (pathname.includes('/snippets/new')) return t('new_snippet_title');
    if (pathname.includes('/edit')) return t('edit_snippet_title');
    if (pathname.includes('/profile')) return t('profile_settings_title');
    if (pathname.includes('/debug-embeds')) return 'Debug Embeds';
    return 'CodeEmbed';
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1">
            <h1 className="text-lg font-semibold font-headline">{getTitle()}</h1>
        </div>
        <UserNav />
    </header>
  );
}
