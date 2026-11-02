import type { ChildInput } from '@/shared/api/kids/kids.types';

export const VALID_AVATARS = [
  'fox',
  'cat',
  'panda',
  'bunny',
  'owl',
  'dino',
  'bear',
  'penguin',
] as const;

export const AVATAR_EMOJIS: Record<string, string> = {
  fox: '🦊',
  cat: '🐱',
  panda: '🐼',
  bunny: '🐰',
  owl: '🦉',
  dino: '🦖',
  bear: '🐻',
  penguin: '🐧',
};

export function validateChildInput(input: Partial<ChildInput>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.name || !input.name.trim()) {
    errors.name = 'Vui lòng nhập tên gọi của bé';
  }

  if (typeof input.grade !== 'number' || input.grade < 1 || input.grade > 5) {
    errors.grade = 'Lớp của bé phải từ 1 đến 5';
  }

  if (!input.avatar || !VALID_AVATARS.includes(input.avatar as (typeof VALID_AVATARS)[number])) {
    errors.avatar = 'Vui lòng chọn một hình đại diện hợp lệ';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function toggleTopicId(disabledIds: number[], topicId: number): number[] {
  if (disabledIds.includes(topicId)) {
    return disabledIds.filter((id) => id !== topicId);
  }
  return [...disabledIds, topicId];
}
