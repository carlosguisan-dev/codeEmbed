
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const origin = 'https://<YOUR_APP_URL>'; // Replace with your actual deployed app URL
  
  return {
    alternates: {
      types: {
        'application/json+oembed': `${origin}/api/oembed?url=${origin}/embed/${params.id}`,
      },
    },
  };
}

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="embed-content" className="bg-transparent">
        {children}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            const sendHeight = () => {
              const root = document.getElementById('embed-root');
              if (root) {
                const height = root.getBoundingClientRect().height;
                const snippetId = window.location.pathname.split('/')[2];
                
                window.parent.postMessage({
                  type: 'code-embed-resize',
                  height: height,
                  snippetId: snippetId
                }, '*');
              }
            };

            // Use a ResizeObserver for better performance
            const observer = new ResizeObserver(sendHeight);
            
            const onReady = () => {
              const targetNode = document.getElementById('embed-root');
              if (targetNode) {
                observer.observe(targetNode);
              }
              // Also send initial height
              sendHeight();
            };

            if (document.readyState === 'complete' || document.readyState === 'interactive') {
              onReady();
            } else {
              window.addEventListener('DOMContentLoaded', onReady);
            }

            // Cleanup observer on unload
            window.addEventListener('unload', () => observer.disconnect());
          `,
        }}
      />
    </>
  );
}
