'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  completePracticeSession,
  submitAnswer,
} from '@/lib/kids/api';
import { authRedirectFor } from '@/lib/kids/authRedirect';
import { kidsPath } from '@/lib/kids/config';
import { applyKey, inputKindOf } from '@/lib/kids/answerInput';
import {
  initPlay,
  playReducer,
  savePlay,
  type PlaySource,
  type PlayState,
} from '@/lib/kids/play';
import type { PracticeSession } from '@/lib/kids/types';
import { Countdown } from './Countdown';
import { FeedbackPanel } from './FeedbackPanel';
import { NumberPad } from './NumberPad';
import { PromptView } from './PromptView';
import { SessionSummaryCard } from './SessionSummaryCard';

export interface PlayScreenProps {
  initialState?: PlayState | null;
  initialSession: PracticeSession;
  source: PlaySource;
  kidToken: string;
  onRetry?(): void;
}

export function PlayScreen({
  initialState,
  initialSession,
  source,
  kidToken,
  onRetry,
}: PlayScreenProps) {
  const router = useRouter();

  const [state, dispatch] = useReducer(
    playReducer,
    initialState ?? initPlay(source, initialSession),
  );

  // Sync to sessionStorage
  useEffect(() => {
    savePlay(state);
  }, [state]);

  // Handle phase: submitting
  const isSubmittingRef = useRef(false);
  useEffect(() => {
    if (state.phase !== 'submitting' || isSubmittingRef.current) return;

    const currentQuestion = state.session.questions[state.index];
    if (!currentQuestion) return;

    isSubmittingRef.current = true;
    submitAnswer(kidToken, state.session.id, currentQuestion.id, state.draft.trim())
      .then((result) => {
        dispatch({ type: 'answered', result });
      })
      .catch((err) => {
        if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 409) {
          dispatch({ type: 'conflict' });
          return;
        }
        const redirect = authRedirectFor(err, 'kid');
        if (redirect) {
          router.replace(redirect);
          return;
        }
        const message = err instanceof Error ? err.message : 'Có lỗi, con thử lại nhé';
        dispatch({ type: 'submitFailed', message });
      })
      .finally(() => {
        isSubmittingRef.current = false;
      });
  }, [state.phase, state.session.id, state.index, state.draft, kidToken, router, state.session.questions]);

  // Handle phase: completing
  const isCompletingRef = useRef(false);
  const handleComplete = useCallback(() => {
    if (isCompletingRef.current) return;
    isCompletingRef.current = true;

    completePracticeSession(kidToken, state.session.id)
      .then((summary) => {
        dispatch({ type: 'completed', summary });
      })
      .catch((err) => {
        const redirect = authRedirectFor(err, 'kid');
        if (redirect) {
          router.replace(redirect);
          return;
        }
        const message = err instanceof Error ? err.message : 'Không thể lưu kết quả, con thử lại nhé';
        dispatch({ type: 'completeFailed', message });
      })
      .finally(() => {
        isCompletingRef.current = false;
      });
  }, [kidToken, state.session.id, router]);

  useEffect(() => {
    if (state.phase === 'completing') {
      handleComplete();
    }
  }, [state.phase, handleComplete]);

  // Handle done phase
  if (state.phase === 'done' && state.summary) {
    return (
      <div className="py-4">
        <SessionSummaryCard summary={state.summary} source={source} onRetry={onRetry} />
      </div>
    );
  }

  // Handle completing phase (loading/error)
  if (state.phase === 'completing') {
    return (
      <div className="mx-auto max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border-2 border-amber-200 text-center my-12">
        <div className="text-4xl mb-4 animate-spin inline-block">⏳</div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Đang tổng kết bài học...</h2>
        {state.error ? (
          <div className="mt-4">
            <p className="text-amber-700 font-medium mb-4">{state.error}</p>
            <button
              type="button"
              onClick={handleComplete}
              className="min-h-[56px] px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg shadow-md"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <p className="text-slate-600">Con đợi một chút nhé!</p>
        )}
      </div>
    );
  }

  const currentQuestion = state.session.questions[state.index];
  const total = state.session.questions.length;
  const position = currentQuestion ? currentQuestion.position : state.index + 1;
  const inputKind = currentQuestion ? inputKindOf(currentQuestion.prompt) : null;

  return (
    <div className="mx-auto max-w-2xl w-full flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 mb-4 bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-amber-200/60 shadow-sm">
        <button
          type="button"
          onClick={() => router.push(kidsPath('/home'))}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
        >
          ⏸️ Tạm dừng
        </button>

        <div className="flex flex-col items-center gap-1.5">
          <span className="text-sm font-extrabold text-slate-700">
            Câu {position} / {total}
          </span>
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {state.session.questions.map((q, idx) => {
              let dotClass = 'bg-slate-200';
              if (q.state === 'correct' && q.attempts === 1) {
                dotClass = 'bg-emerald-500';
              } else if (q.state === 'correct' || q.state === 'revealed') {
                dotClass = 'bg-amber-400';
              }
              const isCurrent = idx === state.index;

              return (
                <span
                  key={q.id}
                  className={`w-3 h-3 rounded-full transition-all ${dotClass} ${
                    isCurrent ? 'ring-2 ring-indigo-500 scale-125' : ''
                  }`}
                  aria-label={`Câu ${q.position}: ${q.state}`}
                />
              );
            })}
          </div>
        </div>

        <div>
          {state.session.expires_at ? (
            <Countdown
              expiresAt={state.session.expires_at}
              onTimeUp={() => dispatch({ type: 'timeUp' })}
            />
          ) : (
            <div className="w-16" />
          )}
        </div>
      </header>

      {/* Main card */}
      <main className="flex-1 flex flex-col justify-between bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border-2 border-amber-100 shadow-xl">
        <div className="flex-1 flex flex-col justify-center">
          {currentQuestion && (
            <PromptView
              prompt={currentQuestion.prompt}
              draft={state.draft}
              disabled={state.phase !== 'answering'}
              onChoice={(val) => {
                dispatch({ type: 'edit', draft: val });
                dispatch({ type: 'submit' });
              }}
            />
          )}

          {state.error && (
            <div className="max-w-md mx-auto my-2 p-3 bg-amber-50 border border-amber-300 text-amber-800 rounded-xl text-center text-sm font-medium">
              {state.error}
            </div>
          )}

          <FeedbackPanel
            feedback={state.feedback}
            onNext={() => dispatch({ type: 'next' })}
          />
        </div>

        {/* Input pad (if inputKind is available and not in feedback/completing) */}
        {inputKind && state.phase !== 'feedback' && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <NumberPad
              kind={inputKind}
              onKey={(key) =>
                dispatch({
                  type: 'edit',
                  draft: applyKey(state.draft, key, inputKind),
                })
              }
              onSubmit={() => dispatch({ type: 'submit' })}
              disabled={state.phase !== 'answering'}
              canSubmit={state.draft.trim().length > 0}
            />
          </div>
        )}
      </main>
    </div>
  );
}
