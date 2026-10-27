'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AvatarGrid } from '@/components/kids/AvatarGrid';
import { KidsShell } from '@/components/kids/KidsShell';
import { KidsApiError, listDeviceChildren, startKidSession } from '@/lib/kids/api';
import { authRedirectFor } from '@/lib/kids/authRedirect';
import { kidsPath } from '@/lib/kids/config';
import { getDeviceToken, setKidSession } from '@/lib/kids/storage';
import type { ChildCard } from '@/lib/kids/types';

function messageFor(err: unknown): string {
  if (err instanceof KidsApiError) {
    if (err.status === 401) return 'Hết phiên, chọn lại bạn nhé';
    if (err.status === 429) return 'Thử lại sau ít phút nhé';
    if (err.status === 0) return 'Mất kết nối mạng, con thử lại nhé';
  }
  return 'Có lỗi, con thử lại nhé';
}

export default function KidsPickerPage() {
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
      <h1 className="mb-6 text-center text-3xl font-bold">Con là ai nào?</h1>
      {error && <p role="alert" className="mb-4 text-center text-lg font-semibold text-amber-800">{error}</p>}
      {kids?.length === 0 && (
        <p className="text-center text-xl">
          Bố mẹ chưa thêm bé nào.{' '}
          <Link href={kidsPath('/parent')} className="underline">Khu bố mẹ</Link>
        </p>
      )}
      {kids && kids.length > 0 && <AvatarGrid onPick={pick} busyId={busyId}>{kids}</AvatarGrid>}
      <footer className="mt-10 text-center">
        <Link href={kidsPath('/parent')} className="text-base underline">Khu bố mẹ</Link>
      </footer>
    </KidsShell>
  );
}
