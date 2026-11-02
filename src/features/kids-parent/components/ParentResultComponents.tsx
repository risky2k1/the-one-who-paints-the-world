'use client';

import type { AssignmentResult, Child } from '@/shared/api/kids/kids.types';
import { AVATAR_EMOJIS } from '../lib/childrenManager';
import { formatDuration } from '../lib/resultsView';

export function ResultRow({
  item,
  onViewDetails,
}: {
  item: AssignmentResult;
  onViewDetails: (id: number) => void;
}) {
  return (
    <div className="py-4 border-b-2 border-black last:border-b-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h4 className="font-black text-neutral-950 text-sm uppercase">{item.title}</h4>
        <p className="text-xs font-bold text-neutral-600 mt-0.5 uppercase">
          Số lần làm lại: <strong className="text-black font-black">{item.attempts_count}</strong> lần
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        {item.first && (
          <div className="neo-box-sm bg-[#FAF7F2] p-2 rounded-lg">
            <span className="text-neutral-500 block text-[10px] uppercase font-black">
              Lần đầu
            </span>
            <span className="font-black text-black">
              {item.first.first_try_correct}/{item.first.total} câu
            </span>
            <span className="text-neutral-500 text-[10px] font-bold ml-1">
              ({formatDuration(item.first.duration_seconds)})
            </span>
          </div>
        )}

        {item.latest && (
          <div className="neo-box-sm bg-[#B8FF9F] p-2 rounded-lg">
            <span className="text-neutral-700 block text-[10px] uppercase font-black">
              Gần nhất
            </span>
            <span className="font-black text-black">
              {item.latest.first_try_correct}/{item.latest.total} câu
            </span>
            <span className="text-neutral-700 text-[10px] font-bold ml-1">
              ({formatDuration(item.latest.duration_seconds)})
            </span>
          </div>
        )}

        {item.latest && (
          <button
            type="button"
            onClick={() => onViewDetails(item.latest!.session_id)}
            className="neo-btn bg-[#FFE600] text-black font-black uppercase text-xs px-3 py-2 rounded-xl"
          >
            Xem chi tiết
          </button>
        )}
      </div>
    </div>
  );
}

export function ChildHeaderPill({ child }: { child: Child }) {
  return (
    <div className="p-4 rounded-2xl neo-card bg-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl neo-box-sm bg-[#FFE600] text-xl flex items-center justify-center">
          {AVATAR_EMOJIS[child.avatar] || '🦊'}
        </div>
        <div>
          <h3 className="font-black text-neutral-950 text-sm uppercase">{child.name}</h3>
          <span className="text-xs font-bold text-neutral-600 uppercase">
            Lớp {child.grade}
          </span>
        </div>
      </div>
      <span className="neo-badge bg-[#FAF7F2] text-black font-black uppercase text-xs px-2.5 py-1 rounded">
        🔥 {child.streak_current} ngày
      </span>
    </div>
  );
}
