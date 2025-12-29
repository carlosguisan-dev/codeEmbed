import type { ReactNode } from 'react';

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
                // Use getBoundingClientRect().height for a more accurate height
                const height = root.getBoundingClientRect().height;
                const snippetId = window.location.pathname.split('/')[2];
                
                window.parent.postMessage({
                  type: 'code-embed-resize',
                  height: height,
                  snippetId: snippetId
                }, '*');
              }
            };

            const onReady = () => {
              sendHeight();
              // A ResizeObserver is more efficient than listening to window resize
              const observer = new ResizeObserver(sendHeight);
              const targetNode = document.getElementById('embed-content');
              if (targetNode) {
                observer.observe(targetNode);
              }
            };

            if (document.readyState === 'complete') {
              onReady();
            } else {
              window.addEventListener('load', onReady);
            }
          `,
        }}
      />
    </>
  );
}
