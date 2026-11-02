'use client';

import type { Assignment, Child } from '@/shared/api/kids/kids.types';
import { formatTimeLimit } from '../lib/assignmentForm';
import { AVATAR_EMOJIS } from '../lib/childrenManager';

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  adaptive: { label: 'TỰ THÍCH ỨNG', color: 'bg-[#FF90E8]' },
  easy: { label: 'DỄ', color: 'bg-[#B8FF9F]' },
  medium: { label: 'VỪA', color: 'bg-[#FFE600]' },
  hard: { label: 'KHÓ', color: 'bg-[#FFB86B]' },
};

export interface MobileAssignmentCardProps {
  item: Assignment;
  child?: Child;
  onDelete: (a: Assignment) => void;
  onPrint?: (a: Assignment) => void;
}

export function MobileAssignmentCard({
  item,
  child,
  onDelete,
  onPrint,
}: MobileAssignmentCardProps) {
  const diff = DIFFICULTY_CONFIG[item.difficulty || 'adaptive'] || DIFFICULTY_CONFIG.adaptive;

  return (
    <div className="neo-box-sm bg-white rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2 border-b-2 border-black pb-2">
        <div>
          <h4 className="font-black text-sm uppercase text-neutral-950">{item.title}</h4>
          <p className="text-[11px] font-bold text-neutral-600">
            {new Date(item.created_at).toLocaleDateString('vi-VN')}
          </p>
        </div>
        <span className={`neo-badge ${diff.color} text-black font-black text-[10px] uppercase px-2 py-0.5 rounded`}>
          {diff.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-bold text-neutral-700">
        <div>
          <span className="text-neutral-500 uppercase">Bé: </span>
          <span className="font-black text-black">
            {child ? `${AVATAR_EMOJIS[child.avatar]} ${child.name}` : `#${item.child_id}`}
          </span>
        </div>
        <div>
          <span className="text-neutral-500 uppercase">Số câu: </span>
          <span className="font-black text-black">{item.question_count} câu</span>
        </div>
        <div>
          <span className="text-neutral-500 uppercase">Thời gian: </span>
          <span className="font-black text-black">{formatTimeLimit(item.time_limit_seconds)}</span>
        </div>
        <div>
          <span className="text-neutral-500 uppercase">Hạn: </span>
          <span className="font-black text-black">
            {item.due_at ? new Date(item.due_at).toLocaleDateString('vi-VN') : 'Không'}
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t-2 border-neutral-200">
        {onPrint && (
          <button
            type="button"
            onClick={() => onPrint(item)}
            className="neo-btn bg-[#A6FAFF] text-black font-black uppercase text-xs flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1"
          >
            <span>🖨️</span>
            <span>In đề</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="neo-btn bg-white text-black font-black uppercase text-xs px-3 py-1.5 rounded-lg"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
