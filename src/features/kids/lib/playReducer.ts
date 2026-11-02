import type { AnswerResult } from '@/shared/api/kids';
import type { PlayAction, PlayState } from './playTypes';

function reduceAnswered(state: PlayState, result: AnswerResult): PlayState {
  const updatedQuestions = state.session.questions.map((q, idx) =>
    idx === state.index
      ? {
          ...q,
          attempts: result.attempts,
          state: result.state,
        }
      : q,
  );
  const updatedSession = { ...state.session, questions: updatedQuestions };

  if (result.correct) {
    return {
      ...state,
      session: updatedSession,
      phase: 'feedback',
      draft: '',
      feedback: { kind: 'correct' },
      error: null,
    };
  }

  if (result.state === 'open') {
    return {
      ...state,
      session: updatedSession,
      phase: 'answering',
      draft: '',
      feedback: { kind: 'hint', hint: result.hint ?? undefined },
      error: null,
    };
  }

  if (result.state === 'revealed') {
    return {
      ...state,
      session: updatedSession,
      phase: 'feedback',
      draft: '',
      feedback: {
        kind: 'revealed',
        revealed: result.revealed ?? undefined,
      },
      error: null,
    };
  }

  return { ...state, session: updatedSession, error: null };
}

function reduceNext(state: PlayState): PlayState {
  if (state.phase !== 'feedback') return state;

  const nextIndex = state.session.questions.findIndex(
    (q, idx) => idx > state.index && q.state === 'open',
  );

  if (nextIndex !== -1) {
    return {
      ...state,
      index: nextIndex,
      phase: 'answering',
      draft: '',
      feedback: null,
      error: null,
    };
  }

  const anyOpen = state.session.questions.findIndex((q) => q.state === 'open');
  if (anyOpen !== -1) {
    return {
      ...state,
      index: anyOpen,
      phase: 'answering',
      draft: '',
      feedback: null,
      error: null,
    };
  }

  return {
    ...state,
    phase: 'completing',
    draft: '',
    feedback: null,
    error: null,
  };
}

export function playReducer(state: PlayState, action: PlayAction): PlayState {
  switch (action.type) {
    case 'edit':
      if (state.phase !== 'answering') return state;
      return { ...state, draft: action.draft, error: null };

    case 'submit':
      if (state.phase !== 'answering' || state.draft.trim() === '') return state;
      return { ...state, phase: 'submitting', error: null };

    case 'answered':
      return reduceAnswered(state, action.result);

    case 'submitFailed':
      return { ...state, phase: 'answering', error: action.message };

    case 'next':
      return reduceNext(state);

    case 'conflict':
    case 'timeUp':
      if (state.phase === 'done') return state;
      return { ...state, phase: 'completing', error: null };

    case 'completed':
      return { ...state, phase: 'done', summary: action.summary, error: null };

    case 'completeFailed':
      return { ...state, phase: 'completing', error: action.message };

    default:
      return state;
  }
}
