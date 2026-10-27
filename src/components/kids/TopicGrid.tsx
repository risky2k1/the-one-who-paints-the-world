import Link from 'next/link';
import { kidsPath } from '@/lib/kids/config';
import type { Topic } from '@/lib/kids/types';

function Stars({ level }: { level?: number | null }) {
  const n = Math.max(0, Math.min(5, level ?? 0));
  return (
    <span aria-label={`${n} trên 5 sao`} className="text-xl text-amber-500">
      {'★'.repeat(n)}
      <span className="text-slate-300">{'★'.repeat(5 - n)}</span>
    </span>
  );
}

export function TopicGrid({ topics, locked }: { topics: Topic[]; locked: boolean }) {
  const cls = 'flex min-h-[56px] flex-col gap-1 rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200';
  return (
    <div className={locked ? 'opacity-50' : ''}>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <li key={t.id}>
            {locked ? (
              <div aria-disabled="true" className={cls}>
                <span className="text-xl font-semibold">{t.name}</span>
                <Stars level={t.level} />
              </div>
            ) : (
              <Link href={`${kidsPath('/play')}?topic=${t.id}`} className={`${cls} hover:bg-amber-100`}>
                <span className="text-xl font-semibold">{t.name}</span>
                <Stars level={t.level} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
