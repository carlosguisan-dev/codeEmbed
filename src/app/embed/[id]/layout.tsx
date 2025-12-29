import type { ReactNode } from 'react';

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-transparent min-h-screen">
      {children}
    </div>
  );
}
