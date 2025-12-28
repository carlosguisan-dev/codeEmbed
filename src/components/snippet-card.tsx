'use client';
import type { Snippet } from '@/lib/definitions';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Copy, Trash2, Globe, Lock, Share2 } from 'lucide-react';
import Link from 'next/link';
import { deleteSnippetAction, duplicateSnippetAction } from '@/lib/actions';
import { useTransition, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { EmbedDialog } from './embed-dialog';
import { useFirebase } from '@/firebase';

export function SnippetCard({ snippet }: { snippet: Snippet }) {
  const { t } = useTranslation();
  const { user } = useFirebase();
  let [isPending, startTransition] = useTransition();
  const [isEmbedDialogOpen, setEmbedDialogOpen] = useState(false);
  const { toast } = useToast();
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(snippet.createdAt).toLocaleDateString());
  }, [snippet.createdAt]);

  const handleDelete = () => {
    if (!user) {
        toast({ variant: 'destructive', title: t('toast_error_title'), description: "You must be logged in." });
        return;
    }
    startTransition(async () => {
      const result = await deleteSnippetAction({ id: snippet.id, userId: user.uid });
      if (result.success) {
        toast({ title: t('toast_snippet_deleted_title'), description: t('toast_snippet_deleted_desc') });
      } else {
        toast({ variant: 'destructive', title: t('toast_error_title'), description: result.message });
      }
    });
  };

  const handleDuplicate = () => {
    if (!user) {
        toast({ variant: 'destructive', title: t('toast_error_title'), description: "You must be logged in." });
        return;
    }
    startTransition(async () => {
        const result = await duplicateSnippetAction({ id: snippet.id, userId: user.uid });
        if (result.success) {
          toast({ title: t('toast_snippet_duplicated_title'), description: t('toast_snippet_duplicated_desc') });
        } else {
          toast({ variant: 'destructive', title: t('toast_error_title'), description: result.message });
        }
      });
  }

  return (
    <>
    <Card className="flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1 pr-4">
            <CardTitle className="font-headline text-xl leading-tight">{snippet.title}</CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/snippets/${snippet.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>{t('edit')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                <span>{t('duplicate')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEmbedDialogOpen(true)}>
                <Share2 className="mr-2 h-4 w-4" />
                <span>{t('embed')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>{t('delete')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
            <Badge variant="secondary">{snippet.language}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {snippet.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                <span>{snippet.isPublic ? t('public') : t('private')}</span>
            </div>
        </div>
      </CardFooter>
    </Card>
    <EmbedDialog snippet={snippet} open={isEmbedDialogOpen} onOpenChange={setEmbedDialogOpen} />
    </>
  );
}
