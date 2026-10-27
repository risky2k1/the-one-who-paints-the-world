import { avatarOf } from '@/lib/kids/avatars';
import type { ChildCard } from '@/lib/kids/types';

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
      {children.map((c) => {
        const a = avatarOf(c.avatar);
        return (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onPick(c)}
              disabled={busyId !== undefined}
              aria-label={`${c.name} (${a.label})`}
              className="flex min-h-[56px] w-full flex-col items-center gap-2 rounded-3xl bg-white p-6 shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400 disabled:opacity-60"
            >
              <span className="text-6xl" aria-hidden="true">{a.emoji}</span>
              <span className="text-2xl font-bold">{c.name}</span>
              {busyId === c.id && <span className="text-base">Đang mở…</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
