
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Copy, Lock, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import type { Snippet } from '@/lib/definitions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from './ui/textarea';

interface EmbedDialogProps {
  snippet: Snippet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmbedDialog({ snippet, open, onOpenChange }: EmbedDialogProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<string | null>(null);
  const [showTitle, setShowTitle] = useState(true);
  const [showDescription, setShowDescription] = useState(true);

  if (!snippet) return null;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const queryParams = new URLSearchParams({
    showTitle: String(showTitle),
    showDescription: String(showDescription),
  });

  const embedUrl = `${baseUrl}/embed/${snippet.id}?${queryParams.toString()}`;
  const iframeCode = `<iframe src="${embedUrl}" id="code-embed-${snippet.id}" style="width:100%;border:0;border-radius:4px;overflow:hidden;" title="${snippet.title}" allow="clipboard-write" sandbox="allow-scripts allow-same-origin" loading="lazy"></iframe>`;
  const resizerScriptCode = `<script src="${baseUrl}/embed-resizer.js" async></script>`;

  useEffect(() => {
    // When a new snippet is passed, reset the toggles to their default state
    setShowTitle(true);
    setShowDescription(true);
  }, [snippet]);


  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const options = [
    { id: 'iframe', label: t('iframe_embed'), value: iframeCode, isTextarea: true },
    { id: 'script_embed', label: t('script_embed'), value: resizerScriptCode, isTextarea: false },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{t('embed_snippet_title')}</DialogTitle>
          <DialogDescription>{t('embed_snippet_desc')}</DialogDescription>
        </DialogHeader>
        
        {snippet.isPublic ? (
            <>
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="showTitle" className="flex flex-col">
                        <span>{t('show_title_label')}</span>
                        <span className="font-normal text-sm text-muted-foreground">{t('show_title_desc')}</span>
                    </Label>
                    <Switch id="showTitle" checked={showTitle} onCheckedChange={setShowTitle} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="showDescription" className="flex flex-col">
                        <span>{t('show_description_label')}</span>
                        <span className="font-normal text-sm text-muted-foreground">{t('show_description_desc')}</span>
                    </Label>
                    <Switch id="showDescription" checked={showDescription} onCheckedChange={setShowDescription} />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid gap-4">
                {options.map(option => (
                    <div key={option.id} className="grid w-full items-center gap-1.5">
                    <Label htmlFor={option.id}>{option.label}</Label>
                    <div className="flex items-center gap-2">
                        {option.isTextarea ? (
                             <Textarea
                                id={option.id}
                                value={option.value}
                                readOnly
                                className="font-code text-sm min-h-[100px] resize-none"
                             />
                        ) : (
                            <Input
                                id={option.id}
                                value={option.value}
                                readOnly
                                className="font-code text-sm"
                            />
                        )}

                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyToClipboard(option.value, option.id)}
                            className="shrink-0"
                        >
                        {copied === option.id ? (
                            <Check className="h-4 w-4 text-primary" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                        </Button>
                    </div>
                    </div>
                ))}
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>¡Importante!</AlertTitle>
                    <AlertDescription>
                        Para que la altura del snippet se ajuste automáticamente, pega el Iframe y el Script en tu HTML.
                    </AlertDescription>
                </Alert>
              </div>
            </>
        ) : (
            <Alert variant="default" className="mt-4">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                    {t('private_snippet_warning')}
                </AlertDescription>
            </Alert>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>{t('close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
