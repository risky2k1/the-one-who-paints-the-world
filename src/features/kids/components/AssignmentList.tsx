import Link from 'next/link';
import { kidsPath } from '../lib/config';
import type { AssignmentCard } from '@/shared/api/kids';

const fmt = (iso: string) => new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

export function AssignmentList({ items }: { items: AssignmentCard[] }) {
  if (items.length === 0) {
    return <p className="text-lg font-bold text-neutral-700">Hôm nay chưa có bài, con tự luyện nhé!</p>;
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((a) => (
        <li key={a.id}>
          <Link
            href={`${kidsPath('/play')}?assignment=${a.id}`}
            className="block min-h-[56px] rounded-2xl bg-white p-5 neo-card text-black hover:bg-[#FAF7F2]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-2xl font-black">{a.title}</span>
              {a.is_new && (
                <span className="neo-badge bg-[#FF90E8] text-black font-black text-xs px-2.5 py-1 rounded-md rotate-[-2deg]">
                  Mới
                </span>
              )}
            </div>
            <p className="mt-2 text-base font-bold text-neutral-700">
              {a.question_count} câu{a.due_at ? ` · hạn ${fmt(a.due_at)}` : ''}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
