'use client';

import { useState, useRef, useEffect } from 'react';
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
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };
  
  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lines = code.split('\n');

  return (
    <div
      className={cn(
        'relative group rounded-lg border text-sm overflow-hidden font-code',
        theme === 'dark' ? 'dark bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200',
        isEmbed ? '!rounded-none !border-0' : '',
        className
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
      <div className={cn('relative flex', theme === 'dark' ? 'text-gray-300' : 'text-gray-800')}>
          {showLineNumbers && (
            <div 
                ref={lineNumbersRef} 
                className="text-right pr-4 select-none opacity-50 p-4 sticky top-0 overflow-y-hidden"
                style={{
                  height: isEditable ? 'auto' : undefined,
                  maxHeight: isEditable ? textareaRef.current?.clientHeight : undefined,
                }}
            >
              {lines.map((_, index) => (
                <div key={index}>{index + 1}</div>
              ))}
            </div>
          )}
          {isEditable ? (
            <Textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => onCodeChange?.(e.target.value)}
              onScroll={handleScroll}
              className={cn(
                'flex-1 resize-none !border-0 !ring-0 !outline-none p-4 whitespace-pre-wrap break-words font-code',
                theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-800',
                showLineNumbers ? '' : 'px-4'
              )}
              placeholder="// Your code here"
            />
          ) : (
            <pre className={cn('p-4 whitespace-pre-wrap break-words flex-1')}>
                <code>{code}</code>
            </pre>
          )}
        </div>
    </div>
  );
}
