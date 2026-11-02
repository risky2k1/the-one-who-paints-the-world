'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { completePracticeSession, submitAnswer } from '@/shared/api/kids';
import { authRedirectFor } from '../lib/authRedirect';
import { savePlay, type PlayAction, type PlayState } from '../lib/play';

interface UsePlayEffectsProps {
  state: PlayState;
  dispatch: React.Dispatch<PlayAction>;
  kidToken: string;
  router: AppRouterInstance;
}

export function usePlayEffects({ state, dispatch, kidToken, router }: UsePlayEffectsProps) {
  const isSubmittingRef = useRef(false);
  const isCompletingRef = useRef(false);

  useEffect(() => {
    savePlay(state);
  }, [state]);

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
  }, [state.phase, state.session.id, state.index, state.draft, kidToken, router, state.session.questions, dispatch]);

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
  }, [kidToken, state.session.id, router, dispatch]);

  useEffect(() => {
    if (state.phase === 'completing') {
      handleComplete();
    }
  }, [state.phase, handleComplete]);

  return { handleComplete };
}
