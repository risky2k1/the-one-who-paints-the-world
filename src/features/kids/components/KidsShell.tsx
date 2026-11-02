import type { ReactNode } from 'react';

export function KidsShell({ children, header }: { children: ReactNode; header?: ReactNode }) {
  return (
    <main className="min-h-screen neo-grid-bg text-neutral-950 px-4 py-4 sm:px-8 sm:py-6">
      {header && (
        <header className="mb-6 neo-box bg-white rounded-xl p-3 flex items-center justify-end gap-3 max-w-5xl mx-auto">
          {header}
        </header>
      )}
      <div className="max-w-5xl mx-auto w-full">
        {children}
      </div>
    </main>
  );
}
