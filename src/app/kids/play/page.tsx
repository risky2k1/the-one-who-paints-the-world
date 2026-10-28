'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { startPracticeSession } from '@/lib/kids/api';
import { authRedirectFor } from '@/lib/kids/authRedirect';
import { kidsPath } from '@/lib/kids/config';
import {
  resumePlay,
  sourceFromQuery,
  type PlaySource,
  type PlayState,
} from '@/lib/kids/play';
import type { PracticeSession } from '@/lib/kids/types';
import { useKidSession } from '@/lib/kids/useKidSession';
import { KidsShell } from '@/components/kids/KidsShell';
import { PlayScreen } from '@/components/kids/PlayScreen';

function PlayContent() {
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

    // Check if there is an active session in sessionStorage to resume
    const resumed = resumePlay(parsedSource);
    if (resumed) {
      setResumedState(resumed);
      setSession(resumed.session);
      setLoading(false);
      return;
    }

    // Start a new session
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
        if (redirect) {
          router.replace(redirect);
          return;
        }

        setErrorMsg(err instanceof Error ? err.message : 'Có lỗi khi mở bài, con thử lại nhé');
        setLoading(false);
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

  if (!kidSession || loading) {
    return (
      <KidsShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="text-4xl animate-bounce">✏️</div>
          <p className="text-xl font-bold text-slate-700">Đang chuẩn bị bài cho con...</p>
        </div>
      </KidsShell>
    );
  }

  if (errorMsg) {
    return (
      <KidsShell>
        <div className="mx-auto max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-lg border-2 border-amber-200 my-12">
          <div className="text-4xl mb-3">🔔</div>
          <p className="text-lg font-bold text-amber-900 mb-6">{errorMsg}</p>
          <button
            type="button"
            onClick={() => router.push(kidsPath('/home'))}
            className="min-h-[56px] px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg shadow-md"
          >
            Về trang chính
          </button>
        </div>
      </KidsShell>
    );
  }

  if (!session || !source) {
    return null;
  }

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

export default function KidsPlayPage() {
  return (
    <Suspense
      fallback={
        <KidsShell>
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <div className="text-4xl animate-bounce">✏️</div>
            <p className="text-xl font-bold text-slate-700">Đang tải...</p>
          </div>
        </KidsShell>
      }
    >
      <PlayContent />
    </Suspense>
  );
}

