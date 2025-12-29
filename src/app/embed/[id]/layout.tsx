import type { ReactNode } from 'react';

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="embed-content" className="bg-transparent min-h-screen">
        {children}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            const sendHeight = () => {
              // This function calculates height based on visible elements
              const root = document.getElementById('embed-root');
              const header = document.getElementById('embed-header');
              const content = document.getElementById('embed-code-content');
              const footer = document.getElementById('embed-footer');

              if (root) {
                let totalHeight = 0;
                if(header) totalHeight += header.offsetHeight;
                if(content) totalHeight += content.offsetHeight;
                if(footer) totalHeight += footer.offsetHeight;

                // Add a small buffer for any margins/paddings not perfectly captured
                const heightWithBuffer = totalHeight + 10;
                
                const snippetId = window.location.pathname.split('/')[2];

                window.parent.postMessage({
                  type: 'code-embed-resize',
                  height: heightWithBuffer,
                  snippetId: snippetId
                }, '*');
              }
            };

            // Use a function to run sendHeight on load and when the window is ready
            const onReady = () => {
              sendHeight();
              // Also send height on any window resize event, just in case
              window.addEventListener('resize', sendHeight);
            };

            // This handles both cases: when the script runs before or after the page is fully loaded.
            if (document.readyState === 'complete') {
              onReady();
            } else {
              window.addEventListener('load', onReady);
            }

            // Fallback: A MutationObserver can help catch changes after initial load,
            // like if something dynamically appears.
            const targetNode = document.getElementById('embed-content');
            if (targetNode) {
              const observer = new MutationObserver(sendHeight);
              observer.observe(targetNode, {
                childList: true,
                subtree: true,
                attributes: true
              });
            }
          `,
        }}
      />
    </>
  );
}
