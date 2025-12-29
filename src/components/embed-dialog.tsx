
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
import { Check, Copy, Lock, Info, Link as LinkIcon } from 'lucide-react';
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
  
  const iframeCode = `<iframe src="${embedUrl}" data-code-embed-id="${snippet.id}" style="width:100%; border:0; overflow:hidden;" title="${snippet.title}" allow="clipboard-write" sandbox="allow-scripts allow-same-origin" loading="lazy"></iframe>`;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{t('embed_snippet_title')}</DialogTitle>
          <DialogDescription>{t('embed_snippet_desc')}</DialogDescription>
        </DialogHeader>
        
        {snippet.isPublic ? (
            <>
                <Alert>
                    <LinkIcon className="h-4 w-4" />
                    <AlertTitle>oEmbed URL</AlertTitle>
                    <AlertDescription>
                        Pega este enlace en plataformas compatibles (como Medium, Ghost, etc.) para incrustar el snippet automáticamente.
                    </AlertDescription>
                     <div className="flex items-center gap-2 pt-2">
                        <Input
                            id="oembed-url"
                            value={embedUrl}
                            readOnly
                            className="font-code text-sm"
                        />
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyToClipboard(embedUrl, 'oembed-url')}
                            className="shrink-0"
                        >
                        {copied === 'oembed-url' ? (
                            <Check className="h-4 w-4 text-primary" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                        </Button>
                    </div>
                </Alert>

              <Separator className="my-4" />

              <div className="space-y-2">
                 <Label className="font-medium">Opciones de Incrustación Manual</Label>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="showTitle" className="flex flex-col">
                        <span>{t('show_title_label')}</span>
                    </Label>
                    <Switch id="showTitle" checked={showTitle} onCheckedChange={setShowTitle} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="showDescription" className="flex flex-col">
                        <span>{t('show_description_label')}</span>
                    </Label>
                    <Switch id="showDescription" checked={showDescription} onCheckedChange={setShowDescription} />
                </div>
              </div>


              <div className="grid gap-4 mt-4">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="iframe-code">1. Pega el código del Iframe</Label>
                     <Textarea
                        id="iframe-code"
                        value={iframeCode}
                        readOnly
                        className="font-code text-sm min-h-[100px] resize-none"
                     />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="script-code">2. Añade el script de redimensionamiento (una vez por página)</Label>
                    <Input
                        id="script-code"
                        value={resizerScriptCode}
                        readOnly
                        className="font-code text-sm"
                    />
                </div>
                <Alert variant="destructive">
                    <Info className="h-4 w-4" />
                    <AlertTitle>¡Importante!</AlertTitle>
                    <AlertDescription>
                        Para que la altura del snippet se ajuste automáticamente, pega el Iframe en tu contenido y el Script una sola vez en tu página, preferiblemente antes de la etiqueta &lt;/body&gt;.
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
