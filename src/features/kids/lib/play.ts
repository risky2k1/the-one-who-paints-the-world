import { readJson, removeKey, writeJson } from './storage';
import type { PlaySource, PracticeSession } from '@/shared/api/kids';
import type { PlayAction, PlayPhase, PlayState } from './playTypes';
import { playReducer } from './playReducer';

export { type PlaySource, type PlayPhase, type PlayState, type PlayAction, playReducer };

export const PLAY_KEY = 'kids.play';

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
