
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import type { Snippet } from '@/lib/definitions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Input } from './ui/input';

interface EmbedDialogProps {
  snippet: Snippet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmbedDialog({ snippet, open, onOpenChange }: EmbedDialogProps) {
  const { t } = useTranslation();
  const [showTitle, setShowTitle] = useState(true);
  const [showDescription, setShowDescription] = useState(true);

  if (!snippet) return null;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const queryParams = new URLSearchParams();
  if (!showTitle) {
    queryParams.set('showTitle', 'false');
  }
  if (!showDescription) {
    queryParams.set('showDescription', 'false');
  }
  
  const queryString = queryParams.toString();
  const embedUrl = `${baseUrl}/embed/${snippet.id}${queryString ? `?${queryString}` : ''}`;
  
  const iframeCode = `<iframe src="${embedUrl}" style="width:100%;border:0;" loading="lazy" allowfullscreen></iframe>`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{t('embed_snippet_title')}</DialogTitle>
          <DialogDescription>{t('embed_snippet_desc')}</DialogDescription>
        </DialogHeader>
        
        {snippet.isPublic ? (
            <div className="grid gap-6 mt-4">
                 <div className="space-y-4">
                    <Label>{t('embed_options')}</Label>
                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-title">{t('show_title_label')}</Label>
                        <p className="text-xs text-muted-foreground">{t('show_title_desc')}</p>
                      </div>
                      <Switch id="show-title" checked={showTitle} onCheckedChange={setShowTitle} />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-description">{t('show_description_label')}</Label>
                        <p className="text-xs text-muted-foreground">{t('show_description_desc')}</p>
                      </div>
                      <Switch id="show-description" checked={showDescription} onCheckedChange={setShowDescription} />
                    </div>
                </div>

                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="iframe-code">{t('iframe_embed')}</Label>
                     <Textarea
                        id="iframe-code"
                        value={iframeCode}
                        readOnly
                        className="font-code text-sm min-h-[100px] resize-none"
                     />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="direct-link">{t('direct_link')}</Label>
                    <div className="flex items-center space-x-2">
                        <Input id="direct-link" value={embedUrl} readOnly />
                    </div>
                </div>
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>¿Cómo funciona?</AlertTitle>
                    <AlertDescription>
                        Copia el código del iframe para incrustar el snippet en tu sitio web. El iframe se ajustará al ancho de su contenedor. Puedes ajustar la altura en tu propio CSS si es necesario.
                    </AlertDescription>
                </Alert>
              </div>
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
