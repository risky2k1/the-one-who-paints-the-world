export type StickerShape =
  | 'star'
  | 'rocket'
  | 'sphere'
  | 'cup'
  | 'medal'
  | 'crown'
  | 'gem'
  | 'cone'
  | 'shield'
  | 'blade'
  | 'chest'
  | 'ring'
  | 'bolt'
  | 'arc'
  | 'flame'
  | 'heart'
  | 'glasses'
  | 'cape'
  | 'wand'
  | 'figure';

export interface StickerVisual {
  label: string;
  shape: StickerShape;
  color: string;
  emoji: string;
}

const STICKER_CATALOG: Record<string, StickerVisual> = {
  'star-gold': { label: 'Ngôi sao vàng', shape: 'star', color: '#eab308', emoji: '⭐' },
  'star-silver': { label: 'Ngôi sao bạc', shape: 'star', color: '#94a3b8', emoji: '🥈' },
  'star-bronze': { label: 'Ngôi sao đồng', shape: 'star', color: '#b45309', emoji: '🥉' },
  rocket: { label: 'Tên lửa', shape: 'rocket', color: '#ef4444', emoji: '🚀' },
  planet: { label: 'Hành tinh', shape: 'sphere', color: '#3b82f6', emoji: '🪐' },
  astronaut: { label: 'Phi hành gia', shape: 'figure', color: '#06b6d4', emoji: '👨‍🚀' },
  'trophy-gold': { label: 'Cúp vàng', shape: 'cup', color: '#f59e0b', emoji: '🏆' },
  'medal-first': { label: 'Huy chương quán quân', shape: 'medal', color: '#eab308', emoji: '🥇' },
  crown: { label: 'Vương miện', shape: 'crown', color: '#fbbf24', emoji: '👑' },
  'gem-diamond': { label: 'Kim cương xanh', shape: 'gem', color: '#38bdf8', emoji: '💎' },
  'gem-ruby': { label: 'Hồng ngọc ruby', shape: 'gem', color: '#e11d48', emoji: '♦️' },
  'gem-emerald': { label: 'Ngọc lục bảo', shape: 'gem', color: '#10b981', emoji: '🟢' },
  'wizard-hat': { label: 'Nón phù thuỷ', shape: 'cone', color: '#8b5cf6', emoji: '🧙' },
  'magic-wand': { label: 'Đũa phép thần', shape: 'wand', color: '#ec4899', emoji: '🪄' },
  shield: { label: 'Khiên hộ mệnh', shape: 'shield', color: '#0ea5e9', emoji: '🛡️' },
  sword: { label: 'Kiếm ánh sáng', shape: 'blade', color: '#6366f1', emoji: '⚔️' },
  'treasure-chest': { label: 'Rương báu', shape: 'chest', color: '#d97706', emoji: '📦' },
  compass: { label: 'La bàn thám hiểm', shape: 'ring', color: '#14b8a6', emoji: '🧭' },
  'super-cape': { label: 'Áo choàng siêu nhân', shape: 'cape', color: '#dc2626', emoji: '🦸' },
  lightning: { label: 'Tia chớp thần tốc', shape: 'bolt', color: '#facc15', emoji: '⚡' },
  rainbow: { label: 'Cầu vồng rực rỡ', shape: 'arc', color: '#f43f5e', emoji: '🌈' },
  fire: { label: 'Ngọn lửa nhiệt huyết', shape: 'flame', color: '#f97316', emoji: '🔥' },
  'heart-badge': { label: 'Huy hiệu trái tim', shape: 'heart', color: '#e11d48', emoji: '❤️' },
  'cool-glasses': { label: 'Kính râm ngầu', shape: 'glasses', color: '#334155', emoji: '🕶️' },
};

export const ALL_STICKER_KEYS = Object.keys(STICKER_CATALOG);

const DEFAULT_STICKER: StickerVisual = {
  label: 'Quà bí mật',
  shape: 'sphere',
  color: '#a78bfa',
  emoji: '🎁',
};

export function stickerVisual(key: string): StickerVisual {
  return STICKER_CATALOG[key] ?? DEFAULT_STICKER;
}

