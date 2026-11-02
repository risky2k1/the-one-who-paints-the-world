import { describe, expect, it } from 'vitest';
import { formatTimeLimit, validateAssignmentInput } from './assignmentForm';

describe('assignmentForm logic', () => {
  it('validates required child selection and title', () => {
    const res = validateAssignmentInput({
      child_id: 0,
      title: '',
      topic_ids: [1],
    });
    expect(res.valid).toBe(false);
    expect(res.errors.child_id).toBeDefined();
    expect(res.errors.title).toBeDefined();
  });

  it('requires at least one topic', () => {
    const res = validateAssignmentInput({
      child_id: 1,
      title: 'Ôn tập phép nhân',
      topic_ids: [],
    });
    expect(res.valid).toBe(false);
    expect(res.errors.topic_ids).toBeDefined();
  });

  it('validates question count between 5 and 30', () => {
    const resLow = validateAssignmentInput({
      child_id: 1,
      title: 'Ôn tập',
      topic_ids: [1],
      question_count: 4,
    });
    expect(resLow.valid).toBe(false);
    expect(resLow.errors.question_count).toBeDefined();

    const resHigh = validateAssignmentInput({
      child_id: 1,
      title: 'Ôn tập',
      topic_ids: [1],
      question_count: 31,
    });
    expect(resHigh.valid).toBe(false);
    expect(resHigh.errors.question_count).toBeDefined();
  });

  it('passes valid assignment input', () => {
    const res = validateAssignmentInput({
      child_id: 1,
      title: 'Ôn tập phép cộng 100',
      topic_ids: [5, 6],
      question_count: 10,
      difficulty: 'adaptive',
      time_limit_seconds: 600,
    });
    expect(res.valid).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });

  it('formats time limit seconds properly', () => {
    expect(formatTimeLimit(null)).toBe('Không giới hạn');
    expect(formatTimeLimit(undefined)).toBe('Không giới hạn');
    expect(formatTimeLimit(300)).toBe('5 phút');
    expect(formatTimeLimit(600)).toBe('10 phút');
    expect(formatTimeLimit(900)).toBe('15 phút');
  });
});
