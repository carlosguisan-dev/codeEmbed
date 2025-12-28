
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Copy, Link as LinkIcon, Lock } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import type { Snippet } from '@/lib/definitions';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmbedDialogProps {
  snippet: Snippet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmbedDialog({ snippet, open, onOpenChange }: EmbedDialogProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<string | null>(null);

  if (!snippet) return null;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const embedUrl = `${baseUrl}/embed/${snippet.id}`;
  const iframeCode = `<iframe src="${embedUrl}" style="width:100%;height:300px;border:0;border-radius:4px;overflow:hidden;" title="${snippet.title}" allow="clipboard-write" sandbox="allow-scripts allow-same-origin"></iframe>`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const options = [
    { id: 'link', label: t('direct_link'), value: embedUrl },
    { id: 'iframe', label: t('iframe_embed'), value: iframeCode },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{t('embed_snippet_title')}</DialogTitle>
          <DialogDescription>{t('embed_snippet_desc')}</DialogDescription>
        </DialogHeader>
        
        {snippet.isPublic ? (
            <div className="grid gap-4 py-4">
            {options.map(option => (
                <div key={option.id} className="grid w-full items-center gap-1.5">
                <Label htmlFor={option.id}>{option.label}</Label>
                <div className="flex items-center gap-2">
                    <Input
                    id={option.id}
                    value={option.value}
                    readOnly
                    className="font-code text-sm"
                    />
                    <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(option.value, option.id)}
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
            </div>
        ) : (
            <Alert variant="default" className="mt-4">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                    Este snippet es privado. Para poder compartirlo o incrustarlo, primero debes cambiar su visibilidad a "Público" en la configuración.
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
