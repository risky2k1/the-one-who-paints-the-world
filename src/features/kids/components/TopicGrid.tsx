import Link from 'next/link';
import { kidsPath } from '../lib/config';
import type { Topic } from '@/shared/api/kids';

function Stars({ level }: { level?: number | null }) {
  const n = Math.max(0, Math.min(5, level ?? 0));
  return (
    <span aria-label={`${n} trên 5 sao`} className="text-xl">
      <span className="text-black">{'★'.repeat(n)}</span>
      <span className="text-neutral-400">{'☆'.repeat(5 - n)}</span>
    </span>
  );
}

export function TopicGrid({ topics, locked }: { topics: Topic[]; locked: boolean }) {
  const activeClass =
    'flex min-h-[56px] flex-col gap-1 rounded-2xl bg-white p-4 neo-card text-black hover:bg-[#FAF7F2]';
  const lockedClass =
    'flex min-h-[56px] flex-col gap-1 rounded-2xl bg-[#FAF7F2] p-4 neo-box border-dashed opacity-50 text-neutral-500';

  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <li key={t.id}>
            {locked ? (
              <div aria-disabled="true" className={lockedClass}>
                <span className="text-xl font-black">{t.name}</span>
                <Stars level={t.level} />
              </div>
            ) : (
              <Link href={`${kidsPath('/play')}?topic=${t.id}`} className={activeClass}>
                <span className="text-xl font-black">{t.name}</span>
                <Stars level={t.level} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
