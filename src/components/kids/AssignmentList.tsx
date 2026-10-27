import Link from 'next/link';
import { kidsPath } from '@/lib/kids/config';
import type { AssignmentCard } from '@/lib/kids/types';

const fmt = (iso: string) => new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

export function AssignmentList({ items }: { items: AssignmentCard[] }) {
  if (items.length === 0) {
    return <p className="text-xl">Hôm nay chưa có bài, con tự luyện nhé!</p>;
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((a) => (
        <li key={a.id}>
          <Link
            href={`${kidsPath('/play')}?assignment=${a.id}`}
            className="block min-h-[56px] rounded-2xl bg-white p-5 shadow-md ring-2 ring-amber-300 hover:bg-amber-100"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-2xl font-bold">{a.title}</span>
              {a.is_new && <span className="rounded-full bg-amber-400 px-3 py-1 text-base font-bold">Mới</span>}
            </div>
            <p className="mt-2 text-lg">
              {a.question_count} câu{a.due_at ? ` · hạn ${fmt(a.due_at)}` : ''}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
