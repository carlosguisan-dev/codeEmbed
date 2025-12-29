
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
import { Label } from '@/components/ui/label';
import { Lock, Info, Code } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import type { Snippet } from '@/lib/definitions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from './ui/textarea';

interface EmbedDialogProps {
  snippet: Snippet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmbedDialog({ snippet, open, onOpenChange }: EmbedDialogProps) {
  const { t } = useTranslation();

  if (!snippet) return null;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const webComponentTag = `<code-embed snippet-id="${snippet.id}"></code-embed>`;
  const scriptTag = `<script src="${baseUrl}/embed.js" async defer></script>`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{t('embed_snippet_title')}</DialogTitle>
          <DialogDescription>{t('embed_snippet_desc')}</DialogDescription>
        </DialogHeader>
        
        {snippet.isPublic ? (
            <div className="grid gap-6 mt-4">
                 <Alert>
                    <Code className="h-4 w-4" />
                    <AlertTitle>Web Component (Recomendado)</AlertTitle>
                    <AlertDescription>
                        Usa esta etiqueta HTML moderna para incrustar el snippet. Se ajusta automáticamente y tiene mejor rendimiento.
                    </AlertDescription>
                </Alert>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="web-component-code">1. Pega la etiqueta del snippet en tu contenido</Label>
                     <Textarea
                        id="web-component-code"
                        value={webComponentTag}
                        readOnly
                        className="font-code text-sm min-h-[60px] resize-none"
                     />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="script-code">2. Añade el script (una sola vez por página)</Label>
                    <Textarea
                        id="script-code"
                        value={scriptTag}
                        readOnly
                        className="font-code text-sm min-h-[60px] resize-none"
                    />
                </div>
                <Alert variant="destructive">
                    <Info className="h-4 w-4" />
                    <AlertTitle>¡Importante!</AlertTitle>
                    <AlertDescription>
                        El script solo necesita ser añadido una vez en tu página, incluso si incrustas múltiples snippets. Un buen lugar es antes de la etiqueta de cierre `&lt;/body&gt;`.
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
