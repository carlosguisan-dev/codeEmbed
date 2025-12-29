
'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TranslationProvider, useTranslation } from '@/hooks/use-translation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bug } from 'lucide-react';

function DebugEmbedsPageContent() {
  const { t } = useTranslation();
  const [iframeCode, setIframeCode] = useState('');

  const embedSrc = useMemo(() => {
    if (!iframeCode) return '';
    const match = iframeCode.match(/src="([^"]*)"/);
    return match ? match[1] : '';
  }, [iframeCode]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Debug Embeds</h1>

      <Card>
        <CardHeader>
          <CardTitle>Pegar código de Iframe</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder='<iframe src="..." style="width:100%;border:0;" loading="lazy" allowfullscreen></iframe>'
            value={iframeCode}
            onChange={(e) => setIframeCode(e.target.value)}
            className="font-code h-32"
          />
        </CardContent>
      </Card>

      {embedSrc ? (
        <Card>
          <CardHeader>
            <CardTitle>Iframe Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full aspect-video rounded-lg border bg-muted">
              <iframe
                key={embedSrc}
                src={embedSrc}
                className="w-full h-full"
                title="Snippet Embed Preview"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium">Embed URL:</p>
              <code className="text-xs bg-muted text-muted-foreground p-2 rounded-md block mt-1">
                {embedSrc}
              </code>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <Bug className="h-4 w-4" />
          <AlertTitle>Esperando Iframe</AlertTitle>
          <AlertDescription>
            Pega el código de un iframe en el área de texto de arriba para previsualizarlo aquí.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default function DebugEmbedsPage() {
  return (
    <TranslationProvider>
      <DebugEmbedsPageContent />
    </TranslationProvider>
  );
}
