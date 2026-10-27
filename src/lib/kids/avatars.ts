const AVATARS: Record<string, { emoji: string; label: string }> = {
  fox: { emoji: '🦊', label: 'Cáo' },
  cat: { emoji: '🐱', label: 'Mèo' },
  panda: { emoji: '🐼', label: 'Gấu trúc' },
  bunny: { emoji: '🐰', label: 'Thỏ' },
  owl: { emoji: '🦉', label: 'Cú' },
  dino: { emoji: '🦖', label: 'Khủng long' },
  bear: { emoji: '🐻', label: 'Gấu' },
  penguin: { emoji: '🐧', label: 'Chim cánh cụt' },
};

export const avatarOf = (key: string): { emoji: string; label: string } =>
  Object.prototype.hasOwnProperty.call(AVATARS, key) ? AVATARS[key] : { emoji: '🙂', label: 'Bạn nhỏ' };
