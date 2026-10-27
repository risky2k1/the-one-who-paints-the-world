import type { ReactNode } from 'react';

export function KidsShell({ children, header }: { children: ReactNode; header?: ReactNode }) {
  return (
    <main className="min-h-screen bg-amber-50 text-slate-900 px-6 py-6 sm:px-10 sm:py-8">
      {header && <header className="mb-6 flex items-center justify-end gap-3">{header}</header>}
      {children}
    </main>
  );
}
