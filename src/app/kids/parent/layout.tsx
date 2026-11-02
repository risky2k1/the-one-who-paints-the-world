'use client';

import { useState } from 'react';
import { KidsParentUnlockView, ParentHeader, SetPinModal } from '@/features/kids-parent';

export default function KidsParentLayout({ children }: { children: React.ReactNode }) {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  return (
    <KidsParentUnlockView>
      <div className="min-h-screen neo-grid-bg text-neutral-900 flex flex-col">
        <ParentHeader onOpenSetPin={() => setIsPinModalOpen(true)} />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
        <SetPinModal isOpen={isPinModalOpen} onClose={() => setIsPinModalOpen(false)} />
      </div>
    </KidsParentUnlockView>
  );
}
