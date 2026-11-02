import type {
  AnswerResult,
  PlaySource,
  PracticeSession,
  RevealedAnswer,
  SessionSummary,
} from '@/shared/api/kids';

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
