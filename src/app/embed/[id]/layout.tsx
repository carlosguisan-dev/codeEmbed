
import type { ReactNode } from 'react';

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="embed-content" className="bg-transparent">
        {children}
      </div>
    </>
  );
}
