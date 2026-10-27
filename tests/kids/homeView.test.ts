import { describe, expect, it } from 'vitest';
import { buildHomeView } from '../../src/lib/kids/homeView';
import type { AssignmentCard, KidHome, Topic } from '../../src/lib/kids/types';

const card = (id: number): AssignmentCard => ({ id, title: 't', question_count: 5, due_at: null, is_new: false });
const home = (n: number, locked = false): KidHome => ({
  child: {} as KidHome['child'],
  pending_assignments: Array.from({ length: n }, (_, i) => card(i + 1)),
  streak_current: 0,
  practice_locked: locked,
});
const topic = (id: number, is_leaf: boolean): Topic => ({
  id, grade: 2, code: `c${id}`, name: `n${id}`, parent_id: null, is_leaf,
});

describe('buildHomeView', () => {
  it('reminds with count of pending assignments', () => {
    expect(buildHomeView(home(2), []).reminder).toBe('Con còn 2 bài bố mẹ giao nè');
  });
  it('has no reminder when none pending', () => {
    expect(buildHomeView(home(0), []).reminder).toBeNull();
  });
  it('keeps only leaf topics in server order', () => {
    const ts = [topic(1, false), topic(2, true), topic(3, true)];
    expect(buildHomeView(home(0), ts).practiceTopics.map((t) => t.id)).toEqual([2, 3]);
  });
  it('passes practice_locked through', () => {
    expect(buildHomeView(home(1, true), []).practiceLocked).toBe(true);
  });
});
