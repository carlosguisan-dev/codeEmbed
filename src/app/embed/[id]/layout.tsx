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
              const content = document.getElementById('embed-content');
              if (content) {
                const height = content.scrollHeight;
                const snippetId = window.location.pathname.split('/')[2];
                window.parent.postMessage({
                  type: 'code-embed-resize',
                  height: height,
                  snippetId: snippetId
                }, '*'); // In production, you should restrict this to the target domain
              }
            };

            // Send height on initial load
            window.addEventListener('load', sendHeight);

            // Use ResizeObserver to send height whenever content size changes
            const content = document.getElementById('embed-content');
            if (content) {
              const resizeObserver = new ResizeObserver(() => {
                sendHeight();
              });
              resizeObserver.observe(content);
            }
          `,
        }}
      />
    </>
  );
}
