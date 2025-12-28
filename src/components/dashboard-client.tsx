'use client';

import { useState, useMemo } from 'react';
import type { Snippet } from '@/lib/definitions';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SnippetCard } from '@/components/snippet-card';
import { PlusCircle, Search } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from './ui/button';
import Link from 'next/link';

type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

export function DashboardClient({ snippets }: { snippets: Snippet[] }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const languages = useMemo(() => ['all', ...Array.from(new Set(snippets.map(s => s.language)))], [snippets]);

  const filteredAndSortedSnippets = useMemo(() => {
    return snippets
      .filter(snippet => 
        (languageFilter === 'all' || snippet.language === languageFilter) &&
        (snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) || snippet.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        switch (sortOption) {
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'title-desc':
            return b.title.localeCompare(a.title);
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [snippets, searchTerm, languageFilter, sortOption]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold font-headline">{t('my_snippets_title')}</h1>
          <Button asChild>
            <Link href="/snippets/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('create_snippet_button')}
            </Link>
          </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="relative lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
        </div>
        <Select value={languageFilter} onValueChange={setLanguageFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('filter_language_placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
              <SelectItem key={lang} value={lang}>{lang === 'all' ? t('all_languages') : lang}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('sort_by_placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('sort_newest')}</SelectItem>
            <SelectItem value="oldest">{t('sort_oldest')}</SelectItem>
            <SelectItem value="title-asc">{t('sort_title_asc')}</SelectItem>
            <SelectItem value="title-desc">{t('sort_title_desc')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedSnippets.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredAndSortedSnippets.map(snippet => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">{t('no_snippets_found_title')}</h3>
          <p className="text-muted-foreground mt-2">{t('no_snippets_found_desc')}</p>
          <Button asChild className="mt-4">
            <Link href="/snippets/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('create_first_snippet_button')}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
