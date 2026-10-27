import type { KidHome, Topic } from './types';

export function buildHomeView(home: KidHome, topics: Topic[]) {
  const n = home.pending_assignments.length;
  return {
    reminder: n > 0 ? `Con còn ${n} bài bố mẹ giao nè` : null,
    practiceLocked: home.practice_locked,
    practiceTopics: topics.filter((t) => t.is_leaf),
  };
}
