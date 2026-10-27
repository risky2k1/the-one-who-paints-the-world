'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AssignmentList } from '@/components/kids/AssignmentList';
import { KidsShell } from '@/components/kids/KidsShell';
import { TopicGrid } from '@/components/kids/TopicGrid';
import { DEFAULT_ERROR, KidsApiError, getKidHome, listKidTopics } from '@/lib/kids/api';
import { authRedirectFor } from '@/lib/kids/authRedirect';
import { avatarOf } from '@/lib/kids/avatars';
import { kidsPath } from '@/lib/kids/config';
import { buildHomeView } from '@/lib/kids/homeView';
import { clearKidSession } from '@/lib/kids/storage';
import type { KidHome, Topic } from '@/lib/kids/types';
import { useKidSession } from '@/lib/kids/useKidSession';

const messageFor = (err: unknown) =>
  (err instanceof KidsApiError && DEFAULT_ERROR[err.status]) ||
  (err instanceof KidsApiError && err.status === 0 ? 'Mất kết nối mạng, con thử lại nhé' : 'Có lỗi, con thử lại nhé');

export default function KidHomePage() {
  const router = useRouter();
  const session = useKidSession();
  const [data, setData] = useState<{ home: KidHome; topics: Topic[] }>();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) return;
    Promise.all([getKidHome(session.token), listKidTopics(session.token)])
      .then(([home, topics]) => setData({ home, topics }))
      .catch((err) => {
        const to = authRedirectFor(err, 'kid');
        if (to) router.replace(to);
        else setError(messageFor(err));
      });
  }, [session, router]);

  const view = useMemo(() => (data ? buildHomeView(data.home, data.topics) : null), [data]);

  const header = (
    <>
      <Link href={kidsPath('/rewards')} className="inline-flex min-h-[56px] items-center rounded-full bg-white px-5 text-lg font-semibold shadow">
        🏆 Phòng trưng bày
      </Link>
      <button
        type="button"
        className="min-h-[56px] rounded-full bg-white px-5 text-lg font-semibold shadow"
        onClick={() => {
          clearKidSession();
          router.push(kidsPath());
        }}
      >
        Đổi bạn
      </button>
    </>
  );

  if (!session) return <KidsShell>{null}</KidsShell>;
  const av = avatarOf(session.child.avatar);

  return (
    <KidsShell header={header}>
      <h1 className="mb-6 flex flex-wrap items-center gap-3 text-3xl font-bold">
        <span aria-hidden="true" className="text-5xl">{av.emoji}</span>
        Chào {session.child.name}!
        {data && data.home.streak_current > 0 && (
          <span className="rounded-full bg-orange-100 px-4 py-1 text-xl">🔥 {data.home.streak_current} ngày</span>
        )}
      </h1>
      {error && <p role="alert" className="mb-4 text-lg font-semibold text-amber-800">{error}</p>}
      {!data && !error && <p className="text-xl">Đang tải...</p>}
      {data && view && (
        <>
          <section className="mb-6">
            <h2 className="mb-3 text-2xl font-bold">📌 Bài bố mẹ giao</h2>
            <AssignmentList items={data.home.pending_assignments} />
          </section>
          {view.reminder && (
            <p className="mb-6 rounded-2xl bg-sky-100 p-4 text-lg text-sky-900">{view.reminder}</p>
          )}
          <section>
            <h2 className="mb-3 text-2xl font-bold">🎮 Tự luyện</h2>
            {view.practiceLocked && (
              <p className="mb-3 text-lg font-semibold">Làm xong bài bố mẹ giao rồi mình chơi tiếp nhé</p>
            )}
            <TopicGrid topics={view.practiceTopics} locked={view.practiceLocked} />
          </section>
        </>
      )}
    </KidsShell>
  );
}
