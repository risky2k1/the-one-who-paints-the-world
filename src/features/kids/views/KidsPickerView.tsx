'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AvatarGrid } from '../components/AvatarGrid';
import { KidsShell } from '../components/KidsShell';
import { KidsApiError, listDeviceChildren, startKidSession, type ChildCard } from '@/shared/api/kids';
import { authRedirectFor } from '../lib/authRedirect';
import { kidsPath } from '../lib/config';
import { getDeviceToken, setKidSession } from '../lib/storage';

function messageFor(err: unknown): string {
  if (err instanceof KidsApiError) {
    if (err.status === 401) return 'Hết phiên, chọn lại bạn nhé';
    if (err.status === 429) return 'Thử lại sau ít phút nhé';
    if (err.status === 0) return 'Mất kết nối mạng, con thử lại nhé';
  }
  return 'Có lỗi, con thử lại nhé';
}

export function KidsPickerView() {
  const router = useRouter();
  const [kids, setKids] = useState<ChildCard[] | null>(null);
  const [busyId, setBusyId] = useState<number>();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getDeviceToken();
    if (!token) {
      router.replace(kidsPath('/setup'));
      return;
    }
    listDeviceChildren(token)
      .then(setKids)
      .catch((err) => {
        const to = authRedirectFor(err, 'device');
        if (to) router.replace(to);
        else setError(messageFor(err));
      });
  }, [router]);

  async function pick(child: ChildCard) {
    const token = getDeviceToken();
    if (!token || busyId !== undefined) return;
    setBusyId(child.id);
    setError('');
    try {
      const { kid_token, child: card } = await startKidSession(token, child.id);
      setKidSession({ token: kid_token, child: card });
      router.push(kidsPath('/home'));
    } catch (err) {
      const to = authRedirectFor(err, 'device');
      if (to) router.replace(to);
      else {
        setError(messageFor(err));
        setBusyId(undefined);
      }
    }
  }

  return (
    <KidsShell>
      <div className="py-6 sm:py-10">
        <h1 className="mb-8 text-center text-3xl sm:text-4xl font-black text-neutral-950">
          Con là ai nào?
        </h1>
        {error && (
          <div role="alert" className="neo-box-sm bg-[#FFE600] text-black font-bold p-3 rounded-xl mb-6 text-center text-sm max-w-md mx-auto">
            {error}
          </div>
        )}
        {kids?.length === 0 && (
          <div className="neo-card bg-white rounded-2xl p-8 text-center max-w-md mx-auto">
            <p className="text-sm font-bold text-neutral-700 mb-4">
              Bố mẹ chưa thêm bé nào.
            </p>
            <Link
              href={kidsPath('/parent')}
              className="neo-btn bg-[#FFE600] text-black font-black uppercase text-xs px-4 py-2 rounded-xl inline-block"
            >
              Vào khu bố mẹ
            </Link>
          </div>
        )}
        {kids && kids.length > 0 && <AvatarGrid onPick={pick} busyId={busyId}>{kids}</AvatarGrid>}
        <footer className="mt-12 text-center">
          <Link
            href={kidsPath('/parent')}
            className="neo-btn bg-white text-black font-extrabold uppercase text-xs sm:text-sm px-4 py-2 rounded-xl inline-flex items-center gap-1.5"
          >
            <span>🛡️</span>
            <span>Khu bố mẹ</span>
          </Link>
        </footer>
      </div>
    </KidsShell>
  );
}
