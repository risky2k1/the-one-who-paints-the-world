import type { AssignmentInput } from '@/shared/api/kids/kids.types';

export function validateAssignmentInput(input: Partial<AssignmentInput>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.child_id || input.child_id <= 0) {
    errors.child_id = 'Vui lòng chọn bé nhận bài tập';
  }

  if (!input.title || !input.title.trim()) {
    errors.title = 'Vui lòng nhập tiêu đề bài tập';
  }

  if (!input.topic_ids || input.topic_ids.length === 0) {
    errors.topic_ids = 'Vui lòng chọn ít nhất một chủ đề bài tập';
  }

  if (
    input.question_count !== undefined &&
    (input.question_count < 5 || input.question_count > 30)
  ) {
    errors.question_count = 'Số câu hỏi phải từ 5 đến 30 câu';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatTimeLimit(seconds?: number | null): string {
  if (!seconds || seconds <= 0) {
    return 'Không giới hạn';
  }
  const minutes = Math.floor(seconds / 60);
  return `${minutes} phút`;
}
