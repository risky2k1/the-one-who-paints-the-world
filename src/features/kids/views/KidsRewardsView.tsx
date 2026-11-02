'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { listKidRewards, type Reward } from '@/shared/api/kids';
import { authRedirectFor } from '../lib/authRedirect';
import { kidsPath } from '../lib/config';
import { useKidSession } from '../hooks/useKidSession';
import { KidsShell } from '../components/KidsShell';
import { StickerGallery } from '../components/StickerGallery';

function EmptyRewardsNotice() {
  return (
    <div className="neo-card bg-white rounded-2xl p-10 text-center max-w-md mx-auto">
      <div className="text-6xl mb-4" aria-hidden="true">
        🌟
      </div>
      <h2 className="text-2xl font-black text-neutral-950 mb-2">Chưa có sticker nào</h2>
      <p className="text-neutral-700 mb-6 font-medium">
        Con hãy chăm chỉ làm bài tập để nhận được những chiếc sticker đầu tiên nhé!
      </p>
      <Link
        href={kidsPath('/home')}
        className="min-h-[56px] inline-flex items-center justify-center px-8 py-3 rounded-xl neo-btn bg-[#FFE600] text-black font-black text-lg"
      >
        Làm bài ngay ➔
      </Link>
    </div>
  );
}

export function KidsRewardsView() {
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
          <p className="text-xl font-black text-neutral-950">Đang mở phòng trưng bày...</p>
        </div>
      </KidsShell>
    );
  }

  const header = (
    <Link
      href={kidsPath('/home')}
      className="min-h-[44px] px-4 py-2 rounded-xl neo-btn bg-white text-black font-black text-sm flex items-center gap-1.5"
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
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-950 mb-2">
            Phòng trưng bày Sticker của {kidSession.child.name}
          </h1>
          <p className="text-neutral-700 font-medium text-base sm:text-lg">
            Mỗi bài tập hoàn thành xuất sắc sẽ mở khóa một món quà bất ngờ!
          </p>
        </div>

        {errorMsg ? (
          <div className="p-6 neo-box bg-[#FFE600] text-neutral-950 rounded-2xl text-center max-w-md mx-auto">
            <p className="font-bold mb-4">{errorMsg}</p>
            <Link
              href={kidsPath('/home')}
              className="inline-block px-6 py-2.5 neo-btn bg-white text-black font-black rounded-xl"
            >
              Về trang chính
            </Link>
          </div>
        ) : rewards && rewards.length > 0 ? (
          <StickerGallery rewards={rewards} />
        ) : (
          <EmptyRewardsNotice />
        )}
      </div>
    </KidsShell>
  );
}
