import type { ReactNode } from 'react';
import Script from 'next/script';

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      {children}
      <Script id="embed-height-observer">
        {`
          const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
              const height = entry.contentRect.height;
              window.parent.postMessage({
                type: 'code-embed-resize',
                payload: {
                  height: height
                }
              }, '*');
            }
          });

          observer.observe(document.body);
        `}
      </Script>
    </div>
  );
}
