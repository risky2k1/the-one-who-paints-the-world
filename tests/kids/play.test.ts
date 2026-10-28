import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  initPlay,
  playReducer,
  resumePlay,
  savePlay,
  sourceFromQuery,
  type PlayAction,
  type PlaySource,
  type PlayState,
} from '@/lib/kids/play';
import type { PracticeSession, SessionSummary } from '@/lib/kids/types';
import { installStorages } from './helpers';

describe('play state machine', () => {
  let storages: ReturnType<typeof installStorages>;

  beforeEach(() => {
    storages = installStorages();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const source: PlaySource = { topic_id: 10 };

  const fixtureSession: PracticeSession = {
    id: 100,
    assignment_id: null,
    expires_at: null,
    questions: [
      {
        id: 1,
        position: 1,
        topic_id: 10,
        prompt: { type: 'arithmetic', text: '1 + 1', input: 'number' },
        attempts: 1,
        state: 'correct',
      },
      {
        id: 2,
        position: 2,
        topic_id: 10,
        prompt: { type: 'arithmetic', text: '2 + 2', input: 'number' },
        attempts: 0,
        state: 'open',
      },
      {
        id: 3,
        position: 3,
        topic_id: 10,
        prompt: { type: 'arithmetic', text: '3 + 3', input: 'number' },
        attempts: 0,
        state: 'open',
      },
    ],
  };

  it('init skips answered questions', () => {
    const s = initPlay(source, fixtureSession);
    expect(s.index).toBe(1);
    expect(s.phase).toBe('answering');
  });

  it('init goes straight to completing if all questions are already answered', () => {
    const allAnswered: PracticeSession = {
      ...fixtureSession,
      questions: fixtureSession.questions.map((q) => ({ ...q, state: 'correct' })),
    };
    const s = initPlay(source, allAnswered);
    expect(s.phase).toBe('completing');
  });

  it('double submit returns exact same state reference', () => {
    let s = initPlay(source, fixtureSession);
    s = playReducer(s, { type: 'edit', draft: '4' });
    const submitting = playReducer(s, { type: 'submit' });
    expect(submitting.phase).toBe('submitting');
    const secondSubmit = playReducer(submitting, { type: 'submit' });
    expect(secondSubmit).toBe(submitting);
  });

  it('empty draft does not submit', () => {
    let s = initPlay(source, fixtureSession);
    s = playReducer(s, { type: 'edit', draft: '   ' });
    const afterSubmit = playReducer(s, { type: 'submit' });
    expect(afterSubmit).toBe(s);
    expect(afterSubmit.phase).toBe('answering');
  });

  it('first wrong shows hint and clears draft', () => {
    let s = initPlay(source, fixtureSession);
    s = playReducer(s, { type: 'edit', draft: '5' });
    s = playReducer(s, { type: 'submit' });
    s = playReducer(s, {
      type: 'answered',
      result: {
        correct: false,
        attempts: 1,
        state: 'open',
        hint: ['Con thử tính lại xem'],
        revealed: null,
      },
    });

    expect(s.phase).toBe('answering');
    expect(s.draft).toBe('');
    expect(s.feedback).toEqual({ kind: 'hint', hint: ['Con thử tính lại xem'] });
    expect(s.session.questions[1].attempts).toBe(1);
    expect(s.session.questions[1].state).toBe('open');
  });

  it('second wrong reveals answer', () => {
    let s = initPlay(source, fixtureSession);
    s = playReducer(s, { type: 'edit', draft: '5' });
    s = playReducer(s, { type: 'submit' });
    s = playReducer(s, {
      type: 'answered',
      result: {
        correct: false,
        attempts: 2,
        state: 'revealed',
        hint: null,
        revealed: { answer: '4', solution: ['2 + 2 = 4'] },
      },
    });

    expect(s.phase).toBe('feedback');
    expect(s.feedback).toEqual({
      kind: 'revealed',
      revealed: { answer: '4', solution: ['2 + 2 = 4'] },
    });
    expect(s.session.questions[1].attempts).toBe(2);
    expect(s.session.questions[1].state).toBe('revealed');
  });

  it('correct then next moves to next open question', () => {
    let s = initPlay(source, fixtureSession);
    s = playReducer(s, { type: 'edit', draft: '4' });
    s = playReducer(s, { type: 'submit' });
    s = playReducer(s, {
      type: 'answered',
      result: {
        correct: true,
        attempts: 1,
        state: 'correct',
        hint: null,
        revealed: null,
      },
    });

    expect(s.phase).toBe('feedback');
    expect(s.feedback).toEqual({ kind: 'correct' });

    s = playReducer(s, { type: 'next' });
    expect(s.phase).toBe('answering');
    expect(s.index).toBe(2);
    expect(s.draft).toBe('');
    expect(s.feedback).toBeNull();
  });

  it('last question next goes completing', () => {
    let s = initPlay(source, fixtureSession);
    s = playReducer(s, { type: 'edit', draft: '4' });
    s = playReducer(s, { type: 'submit' });
    s = playReducer(s, {
      type: 'answered',
      result: { correct: true, attempts: 1, state: 'correct', hint: null, revealed: null },
    });
    s = playReducer(s, { type: 'next' });
    expect(s.index).toBe(2);

    s = playReducer(s, { type: 'edit', draft: '6' });
    s = playReducer(s, { type: 'submit' });
    s = playReducer(s, {
      type: 'answered',
      result: { correct: true, attempts: 1, state: 'correct', hint: null, revealed: null },
    });
    s = playReducer(s, { type: 'next' });

    expect(s.phase).toBe('completing');
  });

  it('conflict (409) transitions from submitting to completing', () => {
    let s = initPlay(source, fixtureSession);
    s = playReducer(s, { type: 'edit', draft: '4' });
    s = playReducer(s, { type: 'submit' });
    s = playReducer(s, { type: 'conflict' });
    expect(s.phase).toBe('completing');
  });

  it('timeUp transitions to completing, ignored if done', () => {
    let s = initPlay(source, fixtureSession);
    const completing = playReducer(s, { type: 'timeUp' });
    expect(completing.phase).toBe('completing');

    const summary: SessionSummary = {
      session_id: 100,
      first_try_correct: 3,
      total: 3,
      duration_seconds: 40,
      reward: null,
      streak_current: 1,
    };
    const done = playReducer(completing, { type: 'completed', summary });
    expect(done.phase).toBe('done');

    const afterTimeUp = playReducer(done, { type: 'timeUp' });
    expect(afterTimeUp).toBe(done);
  });

  it('submitFailed keeps draft and records error', () => {
    let s = initPlay(source, fixtureSession);
    s = playReducer(s, { type: 'edit', draft: '42' });
    s = playReducer(s, { type: 'submit' });
    s = playReducer(s, { type: 'submitFailed', message: 'Mất kết nối mạng' });

    expect(s.phase).toBe('answering');
    expect(s.draft).toBe('42');
    expect(s.error).toBe('Mất kết nối mạng');
  });

  it('resume after reload', () => {
    let s = initPlay(source, fixtureSession);
    s = playReducer(s, { type: 'edit', draft: '4' });
    s = playReducer(s, { type: 'submit' });

    savePlay(s);
    const resumed = resumePlay(source);
    expect(resumed).not.toBeNull();
    expect(resumed?.phase).toBe('answering');
    expect(resumed?.index).toBe(1);

    const diffSourceResumed = resumePlay({ topic_id: 99 });
    expect(diffSourceResumed).toBeNull();

    const summary: SessionSummary = {
      session_id: 100,
      first_try_correct: 2,
      total: 3,
      duration_seconds: 30,
      reward: null,
      streak_current: 1,
    };
    const doneState: PlayState = { ...s, phase: 'done', summary };
    savePlay(doneState);
    expect(resumePlay(source)).toBeNull();
  });

  describe('sourceFromQuery', () => {
    it('parses valid topic', () => {
      expect(sourceFromQuery(new URLSearchParams('topic=5'))).toEqual({ topic_id: 5 });
    });

    it('parses valid assignment', () => {
      expect(sourceFromQuery(new URLSearchParams('assignment=7'))).toEqual({ assignment_id: 7 });
    });

    it('returns null for both topic and assignment', () => {
      expect(sourceFromQuery(new URLSearchParams('topic=5&assignment=3'))).toBeNull();
    });

    it('returns null for invalid inputs', () => {
      expect(sourceFromQuery(new URLSearchParams('topic=abc'))).toBeNull();
      expect(sourceFromQuery(new URLSearchParams('topic=-1'))).toBeNull();
      expect(sourceFromQuery(new URLSearchParams('topic=0'))).toBeNull();
      expect(sourceFromQuery(new URLSearchParams(''))).toBeNull();
    });
  });
});

