import type { PlaySource } from './api';
import { readJson, removeKey, writeJson } from './storage';
import type {
  AnswerResult,
  PracticeSession,
  RevealedAnswer,
  SessionSummary,
} from './types';

export { type PlaySource };

export const PLAY_KEY = 'kids.play';

export type PlayPhase = 'answering' | 'submitting' | 'feedback' | 'completing' | 'done';

export interface PlayState {
  source: PlaySource;
  session: PracticeSession;
  index: number;
  phase: PlayPhase;
  draft: string;
  feedback: {
    kind: 'correct' | 'hint' | 'revealed';
    hint?: string[];
    revealed?: RevealedAnswer;
  } | null;
  summary: SessionSummary | null;
  error: string | null;
}

export type PlayAction =
  | { type: 'edit'; draft: string }
  | { type: 'submit' }
  | { type: 'answered'; result: AnswerResult }
  | { type: 'submitFailed'; message: string }
  | { type: 'next' }
  | { type: 'conflict' }
  | { type: 'timeUp' }
  | { type: 'completed'; summary: SessionSummary }
  | { type: 'completeFailed'; message: string };

export function initPlay(source: PlaySource, session: PracticeSession): PlayState {
  const firstOpen = session.questions.findIndex((q) => q.state === 'open');
  if (firstOpen === -1) {
    return {
      source,
      session,
      index: 0,
      phase: 'completing',
      draft: '',
      feedback: null,
      summary: null,
      error: null,
    };
  }

  return {
    source,
    session,
    index: firstOpen,
    phase: 'answering',
    draft: '',
    feedback: null,
    summary: null,
    error: null,
  };
}

export function playReducer(state: PlayState, action: PlayAction): PlayState {
  switch (action.type) {
    case 'edit': {
      if (state.phase !== 'answering') return state;
      return { ...state, draft: action.draft, error: null };
    }

    case 'submit': {
      if (state.phase !== 'answering') return state;
      if (state.draft.trim() === '') return state;
      return { ...state, phase: 'submitting', error: null };
    }

    case 'answered': {
      const updatedQuestions = state.session.questions.map((q, idx) =>
        idx === state.index
          ? {
              ...q,
              attempts: action.result.attempts,
              state: action.result.state,
            }
          : q,
      );
      const updatedSession = { ...state.session, questions: updatedQuestions };

      if (action.result.correct) {
        return {
          ...state,
          session: updatedSession,
          phase: 'feedback',
          draft: '',
          feedback: { kind: 'correct' },
          error: null,
        };
      }

      if (action.result.state === 'open') {
        return {
          ...state,
          session: updatedSession,
          phase: 'answering',
          draft: '',
          feedback: { kind: 'hint', hint: action.result.hint ?? undefined },
          error: null,
        };
      }

      if (action.result.state === 'revealed') {
        return {
          ...state,
          session: updatedSession,
          phase: 'feedback',
          draft: '',
          feedback: {
            kind: 'revealed',
            revealed: action.result.revealed ?? undefined,
          },
          error: null,
        };
      }

      return { ...state, session: updatedSession, error: null };
    }

    case 'submitFailed': {
      return { ...state, phase: 'answering', error: action.message };
    }

    case 'next': {
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

    case 'conflict': {
      if (state.phase === 'done') return state;
      return { ...state, phase: 'completing', error: null };
    }

    case 'timeUp': {
      if (state.phase === 'done') return state;
      return { ...state, phase: 'completing', error: null };
    }

    case 'completed': {
      return { ...state, phase: 'done', summary: action.summary, error: null };
    }

    case 'completeFailed': {
      return { ...state, phase: 'completing', error: action.message };
    }

    default:
      return state;
  }
}

export function savePlay(state: PlayState): void {
  if (state.phase === 'done') {
    removeKey(PLAY_KEY, 'session');
    return;
  }
  writeJson(PLAY_KEY, state, 'session');
}

function isSameSource(a: PlaySource, b: PlaySource): boolean {
  if ('topic_id' in a && 'topic_id' in b) return a.topic_id === b.topic_id;
  if ('assignment_id' in a && 'assignment_id' in b) return a.assignment_id === b.assignment_id;
  return false;
}

export function resumePlay(source: PlaySource): PlayState | null {
  const saved = readJson<PlayState>(PLAY_KEY, 'session');
  if (!saved || !saved.source || saved.phase === 'done') {
    return null;
  }
  if (!isSameSource(saved.source, source)) {
    return null;
  }
  if (saved.phase === 'submitting') {
    return { ...saved, phase: 'answering' };
  }
  return saved;
}

export function sourceFromQuery(params: URLSearchParams): PlaySource | null {
  const topic = params.get('topic');
  const assignment = params.get('assignment');

  if ((topic !== null && assignment !== null) || (topic === null && assignment === null)) {
    return null;
  }

  const isPositiveInt = (v: string): boolean => /^[1-9]\d*$/.test(v);

  if (topic !== null) {
    if (!isPositiveInt(topic)) return null;
    return { topic_id: Number(topic) };
  }

  if (assignment !== null) {
    if (!isPositiveInt(assignment)) return null;
    return { assignment_id: Number(assignment) };
  }

  return null;
}

