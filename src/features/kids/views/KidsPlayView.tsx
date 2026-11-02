'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { startPracticeSession, type PracticeSession } from '@/shared/api/kids';
import { authRedirectFor } from '../lib/authRedirect';
import { kidsPath } from '../lib/config';
import {
  resumePlay,
  sourceFromQuery,
  type PlaySource,
  type PlayState,
} from '../lib/play';
import { useKidSession } from '../hooks/useKidSession';
import { KidsShell } from '../components/KidsShell';
import { PlayScreen } from '../components/PlayScreen';

function PlayLoading() {
  return (
    <KidsShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="text-5xl animate-bounce">✏️</div>
        <p className="text-xl font-black text-neutral-950">Đang chuẩn bị bài cho con...</p>
      </div>
    </KidsShell>
  );
}

function PlayError({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <KidsShell>
      <div className="mx-auto max-w-md w-full bg-white rounded-2xl p-8 text-center neo-card my-12">
        <div className="text-4xl mb-3">🔔</div>
        <p className="text-lg font-black text-neutral-950 mb-6">{message}</p>
        <button
          type="button"
          onClick={onBack}
          className="min-h-[56px] px-6 py-3 rounded-xl neo-btn bg-[#FFE600] text-black font-black uppercase text-base"
        >
          Về trang chính
        </button>
      </div>
    </KidsShell>
  );
}

export function PlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kidSession = useKidSession();

  const [source, setSource] = useState<PlaySource | null>(null);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [resumedState, setResumedState] = useState<PlayState | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!kidSession) return;
    const parsedSource = sourceFromQuery(searchParams);
    if (!parsedSource) {
      router.replace(kidsPath('/home'));
      return;
    }
    setSource(parsedSource);

    const resumed = resumePlay(parsedSource);
    if (resumed) {
      setResumedState(resumed);
      setSession(resumed.session);
      setLoading(false);
      return;
    }

    startPracticeSession(kidSession.token, parsedSource)
      .then((newSession) => {
        setSession(newSession);
        setLoading(false);
      })
      .catch((err) => {
        if (err && typeof err === 'object' && 'status' in err) {
          const status = (err as { status: number }).status;
          if (status === 423) {
            router.replace(kidsPath('/home'));
            return;
          }
          if (status === 422) {
            setErrorMsg('Chủ đề này chưa mở, con chọn bài khác nhé!');
            setLoading(false);
            return;
          }
        }
        const redirect = authRedirectFor(err, 'kid');
        if (redirect) router.replace(redirect);
        else {
          setErrorMsg(err instanceof Error ? err.message : 'Có lỗi khi mở bài, con thử lại nhé');
          setLoading(false);
        }
      });
  }, [kidSession, searchParams, router]);

  const handleRetryNewSession = () => {
    if (!kidSession || !source) return;
    setLoading(true);
    setErrorMsg(null);
    setResumedState(null);

    startPracticeSession(kidSession.token, source)
      .then((newSession) => {
        setSession(newSession);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMsg(err instanceof Error ? err.message : 'Có lỗi khi tạo bài mới');
        setLoading(false);
      });
  };

  if (!kidSession || loading) return <PlayLoading />;
  if (errorMsg) return <PlayError message={errorMsg} onBack={() => router.push(kidsPath('/home'))} />;
  if (!session || !source) return null;

  return (
    <KidsShell>
      <PlayScreen
        initialState={resumedState}
        initialSession={session}
        source={source}
        kidToken={kidSession.token}
        onRetry={handleRetryNewSession}
      />
    </KidsShell>
  );
}

export function KidsPlayView() {
  return (
    <Suspense fallback={<PlayLoading />}>
      <PlayContent />
    </Suspense>
  );
}
