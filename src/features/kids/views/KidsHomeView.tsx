'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AssignmentList } from '../components/AssignmentList';
import { KidsShell } from '../components/KidsShell';
import { TopicGrid } from '../components/TopicGrid';
import {
  DEFAULT_ERROR,
  KidsApiError,
  getKidHome,
  listKidTopics,
  type KidHome,
  type Topic,
} from '@/shared/api/kids';
import { authRedirectFor } from '../lib/authRedirect';
import { avatarOf } from '../lib/avatars';
import { kidsPath } from '../lib/config';
import { buildHomeView } from '../lib/homeView';
import { clearKidSession } from '../lib/storage';
import { useKidSession } from '../hooks/useKidSession';

const messageFor = (err: unknown) =>
  (err instanceof KidsApiError && DEFAULT_ERROR[err.status]) ||
  (err instanceof KidsApiError && err.status === 0 ? 'Mất kết nối mạng, con thử lại nhé' : 'Có lỗi, con thử lại nhé');

export function KidsHomeView() {
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
      <Link
        href={kidsPath('/rewards')}
        className="inline-flex min-h-[56px] items-center rounded-xl bg-white px-5 text-base font-black neo-btn text-black"
      >
        🏆 Phòng trưng bày
      </Link>
      <button
        type="button"
        className="min-h-[56px] rounded-xl bg-white px-5 text-base font-black neo-btn text-black"
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
      <h1 className="mb-6 flex flex-wrap items-center gap-3 text-3xl font-black text-neutral-950">
        <span aria-hidden="true" className="text-5xl">{av.emoji}</span>
        Chào {session.child.name}!
        {data && data.home.streak_current > 0 && (
          <span className="neo-badge bg-[#FFB86B] text-black font-black text-base px-3 py-1 rounded-lg">
            🔥 {data.home.streak_current} ngày
          </span>
        )}
      </h1>
      {error && (
        <div role="alert" className="neo-box-sm bg-[#FFE600] text-black font-bold p-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}
      {!data && !error && <p className="text-base font-bold text-neutral-700">Đang tải...</p>}
      {data && view && (
        <>
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-black text-neutral-950">📌 Bài bố mẹ giao</h2>
            <AssignmentList items={data.home.pending_assignments} />
          </section>
          {view.reminder && (
            <div className="mb-8 rounded-2xl neo-box-sm bg-[#A6FAFF] p-4 text-base font-bold text-black">
              {view.reminder}
            </div>
          )}
          <section>
            <h2 className="mb-4 text-2xl font-black text-neutral-950">🎮 Tự luyện</h2>
            {view.practiceLocked && (
              <p className="mb-3 text-base font-bold text-neutral-700">
                Làm xong bài bố mẹ giao rồi mình chơi tiếp nhé
              </p>
            )}
            <TopicGrid topics={view.practiceTopics} locked={view.practiceLocked} />
          </section>
        </>
      )}
    </KidsShell>
  );
}
