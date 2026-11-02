'use client';

import { useReducer } from 'react';
import { useRouter } from 'next/navigation';
import type { PracticeSession } from '@/shared/api/kids';
import { kidsPath } from '../lib/config';
import { applyKey, inputKindOf } from '../lib/answerInput';
import {
  initPlay,
  playReducer,
  type PlaySource,
  type PlayState,
} from '../lib/play';
import { FeedbackPanel } from './FeedbackPanel';
import { NumberPad } from './NumberPad';
import { PromptView } from './PromptView';
import { SessionSummaryCard } from './SessionSummaryCard';
import { PlayProgressHeader } from './PlayProgressHeader';
import { usePlayEffects } from '../hooks/usePlayEffects';

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

  const { handleComplete } = usePlayEffects({ state, dispatch, kidToken, router });

  if (state.phase === 'done' && state.summary) {
    return (
      <div className="py-4">
        <SessionSummaryCard summary={state.summary} source={source} onRetry={onRetry} />
      </div>
    );
  }

  if (state.phase === 'completing') {
    return (
      <div className="mx-auto max-w-md w-full neo-card bg-white rounded-2xl p-8 text-center my-12">
        <div className="text-4xl mb-4 animate-spin inline-block">⏳</div>
        <h2 className="text-2xl font-black text-neutral-950 mb-2">Đang tổng kết bài học...</h2>
        {state.error ? (
          <div className="mt-4">
            <p className="text-neutral-700 font-bold mb-4">{state.error}</p>
            <button
              type="button"
              onClick={handleComplete}
              className="min-h-[56px] px-6 py-3 rounded-xl neo-btn bg-[#FFE600] text-black font-black text-lg"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <p className="text-neutral-700 font-medium">Con đợi một chút nhé!</p>
        )}
      </div>
    );
  }

  const currentQuestion = state.session.questions[state.index];
  const inputKind = currentQuestion ? inputKindOf(currentQuestion.prompt) : null;

  return (
    <div className="mx-auto max-w-2xl w-full flex flex-col min-h-[calc(100vh-5rem)]">
      <PlayProgressHeader
        session={state.session}
        index={state.index}
        onPause={() => router.push(kidsPath('/home'))}
        onTimeUp={() => dispatch({ type: 'timeUp' })}
      />

      <main className="flex-1 flex flex-col justify-between neo-card bg-white rounded-2xl p-6 sm:p-8">
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
            <div className="max-w-md mx-auto my-2 p-3 bg-[#FFE600] neo-box-sm text-neutral-950 rounded-xl text-center text-sm font-bold">
              {state.error}
            </div>
          )}

          <FeedbackPanel
            feedback={state.feedback}
            onNext={() => dispatch({ type: 'next' })}
          />
        </div>

        {inputKind && state.phase !== 'feedback' && (
          <div className="mt-4 pt-4 border-t-2 border-black">
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
