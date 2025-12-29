'use client';

import type { Snippet } from '@/lib/definitions';
import { LANGUAGES, THEMES } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { Save, Loader2, Share2, Trash2 } from 'lucide-react';
import { EmbedDialog } from './embed-dialog';
import { useFirebase } from '@/firebase';
import { setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from '@/lib/utils';


interface SnippetFormProps {
  snippet?: Snippet;
}

const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  code: z.string().min(1, 'Code cannot be empty'),
  language: z.string(),
  theme: z.enum(['light', 'dark']),
  lineNumbers: z.boolean(),
  isPublic: z.boolean(),
});


export function SnippetForm({ snippet }: SnippetFormProps) {
  const isEditMode = !!snippet;
  const router = useRouter();
  const { user, firestore } = useFirebase();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [savedSnippet, setSavedSnippet] = useState<Snippet | null>(snippet || null);
  const [isEmbedDialogOpen, setEmbedDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
      title: snippet?.title || '',
      description: snippet?.description || '',
      code: snippet?.code || '',
      language: snippet?.language || 'javascript',
      theme: snippet?.theme || 'dark',
      lineNumbers: snippet?.lineNumbers ?? true,
      isPublic: snippet?.isPublic ?? false,
  });

  
  const [charCount, setCharCount] = useState(formData.code.length);
  const [lineCount, setLineCount] = useState(formData.code.split('\n').length);
  
  useEffect(() => {
    setCharCount(formData.code.length);
    setLineCount(formData.code.split('\n').length);
  }, [formData.code]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) {
        toast({ variant: 'destructive', title: t('toast_error_title'), description: "You must be logged in to perform this action." });
        return;
    }

    const validatedFields = snippetSchema.safeParse(formData);
    if (!validatedFields.success) {
      toast({ variant: 'destructive', title: t('toast_error_title'), description: validatedFields.error.errors.map(e => e.message).join(', ') });
      return;
    }

    startTransition(async () => {
      if (isEditMode && snippet) {
        // Update existing snippet
        const snippetRef = doc(firestore, 'snippets', snippet.id);
        const dataToUpdate = {
          ...validatedFields.data,
          updatedAt: serverTimestamp(),
        }
        setDocumentNonBlocking(snippetRef, dataToUpdate, { merge: true });

        const updatedSnippetForDialog: Snippet = {
            ...snippet,
            ...dataToUpdate,
            updatedAt: new Date().toISOString()
        }
        setSavedSnippet(updatedSnippetForDialog);
        toast({ title: t('toast_snippet_updated_title'), description: formData.title });
        router.refresh();

      } else {
        // Create new snippet
        const collectionRef = collection(firestore, 'snippets');
        const dataToCreate = {
            ...validatedFields.data,
            userId: user.uid,
            viewCount: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }
        const newDocRef = await addDocumentNonBlocking(collectionRef, dataToCreate);
        
        toast({ title: t('toast_snippet_created_title'), description: formData.title });

        if (newDocRef?.id) {
           router.push(`/snippets/${newDocRef.id}/edit`);
        } else {
            // This case should be rare, but good to handle
            router.push('/dashboard');
        }
      }
    });
  };

  const handleDelete = () => {
    if (!user || !firestore || !snippet) return;

    startTransition(async () => {
        const snippetRef = doc(firestore, 'snippets', snippet.id);
        
        // Use await here to ensure deletion completes before redirection
        await deleteDoc(snippetRef);

        toast({ 
            title: t('toast_snippet_deleted_title'), 
            description: t('toast_snippet_deleted_desc', { title: snippet.title })
        });
        
        // This will now reliably happen after the deletion is complete
        router.push('/dashboard');
        router.refresh();
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
      setFormData(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-wrap gap-4 justify-between items-start">
            <h1 className="text-3xl font-bold font-headline">{isEditMode ? t('edit_snippet_title') : t('new_snippet_title')}</h1>
            <div className="flex gap-2 flex-wrap">
                {isEditMode && (
                  <>
                    <Button type="button" variant="outline" onClick={() => setEmbedDialogOpen(true)} disabled={!savedSnippet}>
                      <Share2 className="mr-2 h-4 w-4" />
                      {t('share_embed_button')}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive" disabled={isPending}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('delete_button')}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('delete_dialog_title')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('delete_dialog_desc')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('confirm_delete_button')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
                <Button type="submit" disabled={isPending || !user}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isEditMode ? t('save_changes_button') : t('create_snippet_button')}
                </Button>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{t('title_label')}</CardTitle>
            </CardHeader>
            <CardContent>
                <Input id="title" value={formData.title} onChange={handleChange} placeholder={t('title_placeholder')} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{t('code_label')}</CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea
                    id="code"
                    value={formData.code}
                    onChange={handleChange}
                    className={cn(
                        'font-code min-h-[400px]',
                        formData.theme === 'dark' && 'bg-gray-900 text-gray-300 border-gray-700'
                    )}
                    placeholder="// Your code here"
                />
                <div className="text-xs text-muted-foreground mt-2 flex justify-end gap-4">
                    <span>{t('line_counter', { count: lineCount })}</span>
                    <span>{t('char_counter', { count: charCount })}</span>
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">{t('settings_title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>{t('language_label')}</Label>
                            <Select onValueChange={(value) => handleSelectChange('language', value)} defaultValue={formData.language}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div>
                            <Label>{t('theme_label')}</Label>
                            <Select onValueChange={(value) => handleSelectChange('theme', value)} defaultValue={formData.theme}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {THEMES.map(theme => <SelectItem key={theme.value} value={theme.value}>{theme.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="lineNumbers" className="flex flex-col">
                            <span>{t('line_numbers_label')}</span>
                            <span className="font-normal text-sm text-muted-foreground">{t('line_numbers_desc')}</span>
                        </Label>
                        <Switch id="lineNumbers" checked={formData.lineNumbers} onCheckedChange={(checked) => handleSwitchChange('lineNumbers', checked)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="isPublic" className="flex flex-col">
                            <span>{t('public_access_label')}</span>
                            <span className="font-normal text-sm text-muted-foreground">{t('public_access_desc')}</span>
                        </Label>
                        <Switch id="isPublic" checked={formData.isPublic} onCheckedChange={(checked) => handleSwitchChange('isPublic', checked)} />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">{t('description_label')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea id="description" value={formData.description} onChange={handleChange} placeholder={t('description_placeholder')} className="min-h-[244px]" />
                </CardContent>
            </Card>
        </div>
      
    </form>
    <EmbedDialog snippet={savedSnippet} open={isEmbedDialogOpen} onOpenChange={setEmbedDialogOpen} />
    </>
  );
}
