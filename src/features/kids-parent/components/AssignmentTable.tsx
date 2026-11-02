'use client';

import type { Assignment, Child } from '@/shared/api/kids/kids.types';
import { formatTimeLimit } from '../lib/assignmentForm';
import { AVATAR_EMOJIS } from '../lib/childrenManager';
import { MobileAssignmentCard } from './MobileAssignmentCard';

export interface AssignmentTableProps {
  assignments: Assignment[];
  childrenList: Child[];
  onDelete: (assignment: Assignment) => void;
  onPrint?: (assignment: Assignment) => void;
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  adaptive: { label: 'TỰ THÍCH ỨNG', color: 'bg-[#FF90E8]' },
  easy: { label: 'DỄ', color: 'bg-[#B8FF9F]' },
  medium: { label: 'VỪA', color: 'bg-[#FFE600]' },
  hard: { label: 'KHÓ', color: 'bg-[#FFB86B]' },
};

function TableRow({
  item,
  child,
  onDelete,
  onPrint,
}: {
  item: Assignment;
  child?: Child;
  onDelete: (a: Assignment) => void;
  onPrint?: (a: Assignment) => void;
}) {
  const diff = DIFFICULTY_CONFIG[item.difficulty || 'adaptive'] || DIFFICULTY_CONFIG.adaptive;

  return (
    <tr className="hover:bg-[#FAF7F2] transition-colors border-b-2 border-black">
      <td className="py-3.5 px-4 sm:px-6 font-black text-neutral-950">
        <div className="uppercase">{item.title}</div>
        <div className="text-[11px] font-bold text-neutral-500">
          Giao ngày {new Date(item.created_at).toLocaleDateString('vi-VN')}
        </div>
      </td>
      <td className="py-3.5 px-4 font-bold text-neutral-900">
        <div className="flex items-center gap-1.5">
          <span>{child ? AVATAR_EMOJIS[child.avatar] : '👶'}</span>
          <span>{child?.name || `#${item.child_id}`}</span>
        </div>
      </td>
      <td className="py-3.5 px-4 text-center font-black text-neutral-950">
        {item.question_count}
      </td>
      <td className="py-3.5 px-4">
        <span className={`neo-badge ${diff.color} text-black font-black text-[10px] uppercase px-2 py-0.5 rounded`}>
          {diff.label}
        </span>
      </td>
      <td className="py-3.5 px-4 font-bold text-neutral-700">
        {formatTimeLimit(item.time_limit_seconds)}
      </td>
      <td className="py-3.5 px-4 font-bold text-neutral-700">
        {item.due_at ? new Date(item.due_at).toLocaleDateString('vi-VN') : 'Không'}
      </td>
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {onPrint && (
            <button
              type="button"
              onClick={() => onPrint(item)}
              className="neo-btn bg-[#A6FAFF] text-black font-black uppercase text-xs px-2.5 py-1 rounded-lg flex items-center gap-1"
              title="In phiếu bài tập"
            >
              <span>🖨️</span>
              <span className="hidden sm:inline">In đề</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="neo-btn bg-white text-black font-black uppercase text-xs px-2.5 py-1 rounded-lg"
            aria-label="Xóa bài giao"
          >
            Xóa
          </button>
        </div>
      </td>
    </tr>
  );
}

export function AssignmentTable({
  assignments,
  childrenList,
  onDelete,
  onPrint,
}: AssignmentTableProps) {
  if (assignments.length === 0) {
    return (
      <div className="neo-card bg-white rounded-2xl p-12 text-center">
        <div className="text-4xl mb-3">📝</div>
        <h3 className="text-base font-black uppercase tracking-tight text-neutral-950 mb-1">
          Chưa có bài tập nào được giao
        </h3>
        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-600 max-w-sm mx-auto">
          Bố mẹ hãy bấm nút &quot;+ Giao bài mới&quot; ở trên để bắt đầu giao nhiệm vụ luyện tập cho con nhé!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="block sm:hidden space-y-3">
        {assignments.map((item) => (
          <MobileAssignmentCard
            key={item.id}
            item={item}
            child={childrenList.find((c) => c.id === item.child_id)}
            onDelete={onDelete}
            onPrint={onPrint}
          />
        ))}
      </div>

      <div className="hidden sm:block neo-box bg-white rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-black text-white font-black uppercase tracking-wider border-b-2 border-black">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">Tiêu đề bài tập</th>
              <th className="py-3.5 px-4">Giao cho</th>
              <th className="py-3.5 px-4 text-center">Số câu</th>
              <th className="py-3.5 px-4">Độ khó</th>
              <th className="py-3.5 px-4">Thời gian</th>
              <th className="py-3.5 px-4">Hạn nộp</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black text-neutral-900">
            {assignments.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                child={childrenList.find((c) => c.id === item.child_id)}
                onDelete={onDelete}
                onPrint={onPrint}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
