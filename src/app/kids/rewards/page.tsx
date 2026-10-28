'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { listKidRewards } from '@/lib/kids/api';
import { authRedirectFor } from '@/lib/kids/authRedirect';
import { kidsPath } from '@/lib/kids/config';
import type { Reward } from '@/lib/kids/types';
import { useKidSession } from '@/lib/kids/useKidSession';
import { KidsShell } from '@/components/kids/KidsShell';
import { StickerGallery } from '@/components/kids/StickerGallery';

export default function KidsRewardsPage() {
  const router = useRouter();
  const kidSession = useKidSession();

  const [rewards, setRewards] = useState<Reward[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!kidSession) return;

    listKidRewards(kidSession.token)
      .then((data) => {
        setRewards(data);
        setLoading(false);
      })
      .catch((err) => {
        const redirect = authRedirectFor(err, 'kid');
        if (redirect) {
          router.replace(redirect);
          return;
        }
        setErrorMsg(err instanceof Error ? err.message : 'Có lỗi khi tải phòng trưng bày');
        setLoading(false);
      });
  }, [kidSession, router]);

  if (!kidSession || loading) {
    return (
      <KidsShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="text-4xl animate-bounce">🏆</div>
          <p className="text-xl font-bold text-slate-700">Đang mở phòng trưng bày...</p>
        </div>
      </KidsShell>
    );
  }

  const header = (
    <Link
      href={kidsPath('/home')}
      className="min-h-[44px] px-4 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm shadow-sm border border-slate-200 transition-all flex items-center gap-1.5"
    >
      <span>🏠</span>
      <span>Về trang chính</span>
    </Link>
  );

  return (
    <KidsShell header={header}>
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2" aria-hidden="true">
            🏆
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            Phòng trưng bày Sticker của {kidSession.child.name}
          </h1>
          <p className="text-slate-600 font-medium text-base sm:text-lg">
            Mỗi bài tập hoàn thành xuất sắc sẽ mở khóa một món quà bất ngờ!
          </p>
        </div>

        {errorMsg ? (
          <div className="p-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-3xl text-center max-w-md mx-auto">
            <p className="font-bold mb-4">{errorMsg}</p>
            <Link
              href={kidsPath('/home')}
              className="inline-block px-6 py-2.5 bg-amber-500 text-white font-bold rounded-2xl shadow-sm"
            >
              Về trang chính
            </Link>
          </div>
        ) : rewards && rewards.length > 0 ? (
          <StickerGallery rewards={rewards} />
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 text-center max-w-md mx-auto border-2 border-amber-200 shadow-lg">
            <div className="text-6xl mb-4" aria-hidden="true">
              🌟
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Chưa có sticker nào</h2>
            <p className="text-slate-600 mb-6 font-medium">
              Con hãy chăm chỉ làm bài tập để nhận được những chiếc sticker đầu tiên nhé!
            </p>
            <Link
              href={kidsPath('/home')}
              className="min-h-[56px] inline-flex items-center justify-center px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-lg shadow-md active:scale-95 transition-all"
            >
              Làm bài ngay ➔
            </Link>
          </div>
        )}
      </div>
    </KidsShell>
  );
}

