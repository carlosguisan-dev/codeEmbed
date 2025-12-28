'use client';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { LanguageSwitcher } from './language-switcher';
import Link from 'next/link';

export function UserNav() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <LanguageSwitcher />
      <Button asChild variant="outline">
        <Link href="/dashboard">Go to app</Link>
      </Button>
    </div>
  );
}
