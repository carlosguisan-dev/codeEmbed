

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { Textarea } from './ui/textarea';

type CodePreviewProps = {
  code: string;
  language: string;
  theme: 'light' | 'dark';
  showLineNumbers: boolean;
  isEmbed?: boolean;
  className?: string;
  isEditable?: boolean;
  onCodeChange?: (newCode: string) => void;
};

export function CodePreview({ 
  code, 
  language, 
  theme, 
  showLineNumbers, 
  isEmbed = false, 
  className,
  isEditable = false,
  onCodeChange 
}: CodePreviewProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };
  
  const themeClasses = theme === 'dark' 
    ? 'dark-theme bg-[#282c34] text-gray-300' 
    : 'light-theme bg-gray-50 text-gray-800';

  if (isEditable) {
    return (
      <div className={cn('relative group rounded-lg border text-sm overflow-hidden font-code', className)}>
        <Textarea
          value={code}
          onChange={(e) => onCodeChange?.(e.target.value)}
          className={cn(
            'flex-1 resize-none !border-0 !ring-0 !outline-none p-4 whitespace-pre-wrap break-words font-code min-h-[300px]',
            themeClasses
          )}
          placeholder="// Your code here"
        />
      </div>
    );
  }
  
  const lines = code.split('\n');

  return (
    <div
      className={cn(
        'relative group text-sm font-code h-full',
        isEmbed ? '' : 'rounded-lg border',
        themeClasses,
        className
      )}
    >
      <div className={cn(
        'flex items-center justify-between px-4 py-2 border-b',
        theme === 'dark' ? 'bg-black/20 border-gray-700' : 'bg-black/5 border-gray-200'
      )}>
        <span className={cn('text-xs font-semibold', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
          {language}
        </span>
        <Button
          type="button"
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
      
      <pre className="p-4 overflow-auto h-full">
        <code className="font-code text-sm whitespace-pre">
          {showLineNumbers ? (
            <div className="flex">
              <div className="text-right select-none opacity-50 pr-4">
                {lines.map((_, index) => (
                  <span key={index} className="block">{index + 1}</span>
                ))}
              </div>
              <div className="flex-1">
                {lines.map((line, index) => (
                  <span key={index} className="block">
                    {line.length > 0 ? line : '\u00A0'}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            code
          )}
        </code>
      </pre>
    </div>
  );
}
