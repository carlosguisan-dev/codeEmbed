
'use client';

import { useState }from 'react';
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
import { Lock, Info, Copy, Check } from 'lucide-react';
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
  const [hasCopiedCode, setHasCopiedCode] = useState(false);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  if (!snippet) return null;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const queryParams = new URLSearchParams();
  queryParams.set('showTitle', String(showTitle));
  
  const embedUrl = `${baseUrl}/embed/${snippet.id}?${queryParams.toString()}`;
  const directLinkUrl = `${baseUrl}/s/${snippet.id}`;
  
  const iframeCode = `<iframe src="${embedUrl}" style="width:100%; border:0; height: 350px;" loading="lazy" allowfullscreen></iframe>`;

  const handleCopy = (textToCopy: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(textToCopy);
    if (type === 'code') {
      setHasCopiedCode(true);
      setTimeout(() => setHasCopiedCode(false), 2000);
    } else {
      setHasCopiedLink(true);
      setTimeout(() => setHasCopiedLink(false), 2000);
    }
  };


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
                        <Label htmlFor="show-title" className="cursor-pointer">{t('show_title_label')}</Label>
                        <p className="text-xs text-muted-foreground">{t('show_title_desc')}</p>
                      </div>
                      <Switch id="show-title" checked={showTitle} onCheckedChange={setShowTitle} />
                    </div>
                </div>

                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="iframe-code">{t('iframe_embed')}</Label>
                    <div className="relative">
                        <Textarea
                            id="iframe-code"
                            value={iframeCode}
                            readOnly
                            className="font-code text-sm min-h-[100px] resize-none pr-12"
                        />
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:bg-muted"
                            onClick={() => handleCopy(iframeCode, 'code')}
                        >
                            {hasCopiedCode ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="direct-link">{t('direct_link')}</Label>
                    <div className="flex items-center space-x-2">
                        <Input id="direct-link" value={directLinkUrl} readOnly />
                        <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => handleCopy(directLinkUrl, 'link')}
                        >
                            {hasCopiedLink ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                        </Button>
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
