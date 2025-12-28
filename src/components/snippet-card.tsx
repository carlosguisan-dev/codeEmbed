'use client';
import type { Snippet } from '@/lib/definitions';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Copy, Trash2, Globe, Lock, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useTransition, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { EmbedDialog } from './embed-dialog';
import { useFirebase } from '@/firebase';
import { deleteDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc, collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';


export function SnippetCard({ snippet }: { snippet: Snippet }) {
  const { t } = useTranslation();
  const { user, firestore } = useFirebase();
  const router = useRouter();
  let [isPending, startTransition] = useTransition();
  const [isEmbedDialogOpen, setEmbedDialogOpen] = useState(false);
  const { toast } = useToast();
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (snippet && snippet.createdAt) {
        // Firebase Timestamps can be objects, so we need to convert them
        const date = typeof snippet.createdAt === 'string' ? new Date(snippet.createdAt) : (snippet.createdAt as any).toDate();
        setFormattedDate(date.toLocaleDateString());
    }
  }, [snippet]);

  const handleDelete = () => {
    if (!user || !firestore) {
        toast({ variant: 'destructive', title: t('toast_error_title'), description: "You must be logged in." });
        return;
    }
    startTransition(() => {
      const snippetRef = doc(firestore, 'snippets', snippet.id);
      // We don't need to await this. The UI will update reactively via useCollection.
      deleteDocumentNonBlocking(snippetRef);
      toast({ title: t('toast_snippet_deleted_title'), description: t('toast_snippet_deleted_desc') });
    });
  };

  const handleDuplicate = () => {
    if (!user || !firestore) {
        toast({ variant: 'destructive', title: t('toast_error_title'), description: "You must be logged in." });
        return;
    }
    startTransition(async () => {
        const { id, createdAt, updatedAt, ...restOfData } = snippet;

        const newSnippetData = {
          ...restOfData,
          title: `${snippet.title} (Copy)`,
          userId: user.uid,
          viewCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }

        const collectionRef = collection(firestore, 'snippets');
        // Non-blocking, but we can await the promise if we want the new ID
        const newDocRef = await addDocumentNonBlocking(collectionRef, newSnippetData);
        
        toast({ title: t('toast_snippet_duplicated_title'), description: t('toast_snippet_duplicated_desc') });
        // Optional: redirect to the new duplicated snippet's edit page
        if(newDocRef?.id) {
          router.push(`/snippets/${newDocRef.id}/edit`);
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
              <DropdownMenuItem onClick={handleDuplicate} disabled={isPending}>
                <Copy className="mr-2 h-4 w-4" />
                <span>{t('duplicate')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEmbedDialogOpen(true)}>
                <Share2 className="mr-2 h-4 w-4" />
                <span>{t('embed')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete} disabled={isPending}>
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
