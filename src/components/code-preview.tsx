'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

type CodePreviewProps = {
  code: string;
  language: string;
  theme: 'light' | 'dark';
  showLineNumbers: boolean;
  isEmbed?: boolean;
};

export function CodePreview({ code, language, theme, showLineNumbers, isEmbed = false }: CodePreviewProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div
      className={cn(
        'relative group rounded-lg border text-sm overflow-hidden',
        theme === 'dark' ? 'dark bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b"
        style={{
            borderColor: theme === 'dark' ? 'var(--border)' : 'hsl(var(--border))'
        }}
      >
        <span className={cn('text-xs font-semibold', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-opacity',
            isEmbed && 'opacity-100',
             theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-black hover:bg-gray-200'
          )}
        >
          {hasCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span className="ml-2">{hasCopied ? t('copied') : t('copy')}</span>
        </Button>
      </div>
      <pre className={cn('p-4 font-code whitespace-pre-wrap break-words', theme === 'dark' ? 'text-gray-300' : 'text-gray-800')}>
        <div className="flex">
          {showLineNumbers && (
            <div className="text-right pr-4 select-none opacity-50">
              {lines.map((_, index) => (
                <div key={index}>{index + 1}</div>
              ))}
            </div>
          )}
          <code className="flex-1">{code}</code>
        </div>
      </pre>
    </div>
  );
}
