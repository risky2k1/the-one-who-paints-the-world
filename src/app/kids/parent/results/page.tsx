import { Suspense } from 'react';
import { KidsParentResultsView } from '@/features/kids-parent';

export default function KidsParentResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-neutral-900 font-bold animate-pulse">
          Đang nạp kết quả...
        </div>
      }
    >
      <KidsParentResultsView />
    </Suspense>
  );
}
