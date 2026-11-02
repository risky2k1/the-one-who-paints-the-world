import { avatarOf } from '../lib/avatars';
import type { ChildCard } from '@/shared/api/kids';

const BG_COLORS = ['bg-[#FFE600]', 'bg-[#FF90E8]', 'bg-[#A6FAFF]', 'bg-[#B8FF9F]'];

export function AvatarGrid({
  children,
  onPick,
  busyId,
}: {
  children: ChildCard[];
  onPick: (child: ChildCard) => void;
  busyId?: number;
}) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {children.map((c, idx) => {
        const a = avatarOf(c.avatar);
        const bg = BG_COLORS[idx % BG_COLORS.length];
        return (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onPick(c)}
              disabled={busyId !== undefined}
              aria-label={`${c.name} (${a.label})`}
              className={`flex min-h-[56px] w-full flex-col items-center gap-2 rounded-2xl ${bg} p-6 neo-card text-black focus:outline-none focus-visible:outline-[3px] focus-visible:outline-black focus-visible:outline-offset-2 disabled:opacity-60`}
            >
              <span className="text-6xl" aria-hidden="true">{a.emoji}</span>
              <span className="text-2xl font-black">{c.name}</span>
              {busyId === c.id && <span className="text-base font-bold">Đang mở…</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
