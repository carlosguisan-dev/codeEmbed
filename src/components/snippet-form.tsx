'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Snippet } from '@/lib/definitions';
import { LANGUAGES, THEMES } from '@/lib/data';
import { createSnippetAction, updateSnippetAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CodePreview } from './code-preview';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { Save, Loader2, Share2 } from 'lucide-react';
import { EmbedDialog } from './embed-dialog';


const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  code: z.string().min(1, 'Code cannot be empty'),
  language: z.string(),
  theme: z.enum(['light', 'dark']),
  lineNumbers: z.boolean(),
  isPublic: z.boolean(),
});

type SnippetFormData = z.infer<typeof snippetSchema>;

interface SnippetFormProps {
  snippet?: Snippet;
}

export function SnippetForm({ snippet }: SnippetFormProps) {
  const isEditMode = !!snippet;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [savedSnippet, setSavedSnippet] = useState<Snippet | null>(snippet || null);
  const [isEmbedDialogOpen, setEmbedDialogOpen] = useState(false);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<SnippetFormData>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: snippet?.title || '',
      description: snippet?.description || '',
      code: snippet?.code || '',
      language: snippet?.language || 'javascript',
      theme: snippet?.theme || 'dark',
      lineNumbers: snippet?.lineNumbers ?? true,
      isPublic: snippet?.isPublic ?? false,
    },
  });

  const [previewHeight, setPreviewHeight] = useState(300);
  const formData = watch();

  const [charCount, setCharCount] = useState(formData.code.length);
  const [lineCount, setLineCount] = useState(formData.code.split('\n').length);
  
  useEffect(() => {
    setCharCount(formData.code.length);
    setLineCount(formData.code.split('\n').length);
  }, [formData.code]);


  const onSubmit = (data: SnippetFormData) => {
    startTransition(async () => {
      const action = isEditMode ? updateSnippetAction : createSnippetAction;
      const payload = isEditMode ? { id: snippet.id, ...data } : data;
      const result = await action(payload as any);

      if (result.success && result.data) {
        toast({ title: isEditMode ? t('toast_snippet_updated_title') : t('toast_snippet_created_title'), description: data.title });
        setSavedSnippet(result.data);
        if (!isEditMode) {
            router.push(`/snippets/${result.data.id}/edit`);
            setEmbedDialogOpen(true);
        }
      } else {
        toast({ variant: 'destructive', title: t('toast_error_title'), description: result.message });
      }
    });
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Side */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">{t('editor_title')}</CardTitle>
              <CardDescription>{t('editor_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">{t('title_label')}</Label>
                <Input id="title" {...register('title')} placeholder={t('title_placeholder')} />
                {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="description">{t('description_label')}</Label>
                <Textarea id="description" {...register('description')} placeholder={t('description_placeholder')} />
                {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
              </div>
              <div>
                <Label htmlFor="code">{t('code_label')}</Label>
                <Textarea id="code" {...register('code')} className="font-code min-h-[400px]" placeholder="// Your code here" />
                {errors.code && <p className="text-sm text-destructive mt-1">{errors.code.message}</p>}
                <div className="text-xs text-muted-foreground mt-2 flex justify-end gap-4">
                    <span>{t('line_counter', { count: lineCount })}</span>
                    <span>{t('char_counter', { count: charCount })}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="font-headline">{t('settings_title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>{t('language_label')}</Label>
                        <Controller name="language" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )} />
                    </div>
                     <div>
                        <Label>{t('theme_label')}</Label>
                        <Controller name="theme" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {THEMES.map(theme => <SelectItem key={theme.value} value={theme.value}>{theme.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="lineNumbers" className="flex flex-col">
                        <span>{t('line_numbers_label')}</span>
                        <span className="font-normal text-sm text-muted-foreground">{t('line_numbers_desc')}</span>
                    </Label>
                    <Controller name="lineNumbers" control={control} render={({ field }) => (
                        <Switch id="lineNumbers" checked={field.value} onCheckedChange={field.onChange} />
                    )} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="isPublic" className="flex flex-col">
                        <span>{t('public_access_label')}</span>
                        <span className="font-normal text-sm text-muted-foreground">{t('public_access_desc')}</span>
                    </Label>
                    <Controller name="isPublic" control={control} render={({ field }) => (
                         <Switch id="isPublic" checked={field.value} onCheckedChange={field.onChange} />
                    )} />
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Side */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">{t('live_preview_title')}</CardTitle>
                <CardDescription>{t('live_preview_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label>{t('preview_height_label')}</Label>
                    <Slider defaultValue={[previewHeight]} max={800} min={150} step={10} onValueChange={(value) => setPreviewHeight(value[0])} />
                </div>
                 <div style={{ height: `${previewHeight}px` }} className="overflow-auto rounded-lg border p-2 bg-muted/30">
                    <CodePreview
                        code={formData.code}
                        language={formData.language}
                        theme={formData.theme}
                        showLineNumbers={formData.lineNumbers}
                    />
                </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle className="font-headline">{t('theme_previews_title')}</CardTitle>
            </CardHeader>
             <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-1">
                <div>
                    <Label className="text-muted-foreground">{t('light_theme_preview')}</Label>
                    <div className="mt-2 rounded-lg border p-2 bg-muted/30 h-48 overflow-auto">
                        <CodePreview code={formData.code} language={formData.language} theme="light" showLineNumbers={formData.lineNumbers} />
                    </div>
                </div>
                <div>
                    <Label className="text-muted-foreground">{t('dark_theme_preview')}</Label>
                    <div className="mt-2 rounded-lg border p-2 bg-muted/30 h-48 overflow-auto">
                        <CodePreview code={formData.code} language={formData.language} theme="dark" showLineNumbers={formData.lineNumbers} />
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {isEditMode && (
          <Button type="button" variant="outline" onClick={() => setEmbedDialogOpen(true)} disabled={!savedSnippet}>
            <Share2 className="mr-2 h-4 w-4" />
            {t('share_embed_button')}
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isEditMode ? t('save_changes_button') : t('create_snippet_button')}
        </Button>
      </div>
    </form>
    <EmbedDialog snippet={savedSnippet} open={isEmbedDialogOpen} onOpenChange={setEmbedDialogOpen} />
    </>
  );
}
