'use client';

import type { Child } from '@/shared/api/kids/kids.types';
import { AVATAR_EMOJIS } from '../lib/childrenManager';

const TEXTBOOK_LABELS: Record<string, string> = {
  ket_noi: 'Kết nối tri thức',
  chan_troi: 'Chân trời sáng tạo',
  canh_dieu: 'Cánh Diều',
};

export interface ParentChildCardProps {
  child: Child;
  onEdit: (child: Child) => void;
  onDelete: (child: Child) => void;
}

export function ParentChildCard({ child, onEdit, onDelete }: ParentChildCardProps) {
  return (
    <div className="neo-card bg-white rounded-2xl flex flex-col justify-between overflow-hidden">
      <div>
        <div className="bg-[#FF90E8] border-b-2 border-black p-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl neo-box-sm bg-white flex items-center justify-center text-3xl">
              {AVATAR_EMOJIS[child.avatar] || '🦊'}
            </div>
            <div>
              <h3 className="font-black text-neutral-950 text-base uppercase leading-snug">
                {child.name}
              </h3>
              <span className="neo-badge bg-black text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                Lớp {child.grade}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="neo-badge bg-white text-black text-[11px] font-black uppercase px-2 py-1 rounded inline-flex items-center gap-1">
              <span>🔥</span>
              <span>{child.streak_current}N</span>
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-2 text-xs font-bold text-neutral-700">
          <div className="flex justify-between border-b-2 border-neutral-100 pb-1.5">
            <span className="text-neutral-500 uppercase">Bộ sách:</span>
            <span className="font-black text-neutral-950">
              {TEXTBOOK_LABELS[child.textbook] || child.textbook}
            </span>
          </div>
          <div className="flex justify-between border-b-2 border-neutral-100 pb-1.5">
            <span className="text-neutral-500 uppercase">Chủ đề đã tắt:</span>
            <span className="font-black text-neutral-950">
              {child.disabled_topic_ids?.length || 0} chủ đề
            </span>
          </div>
          <div className="flex justify-between items-center pt-0.5">
            <span className="text-neutral-500 uppercase">Bài giao trước:</span>
            <span
              className={`neo-badge text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                child.assigned_first
                  ? 'bg-[#B8FF9F] text-black'
                  : 'bg-[#FAF7F2] text-neutral-700'
              }`}
            >
              {child.assigned_first ? 'Bắt buộc' : 'Tự do'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 pt-0 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(child)}
          className="neo-btn bg-[#FFE600] text-black font-black uppercase text-xs flex-1 py-2 rounded-xl text-center"
        >
          Chỉnh sửa
        </button>
        <button
          type="button"
          onClick={() => onDelete(child)}
          className="neo-btn bg-white text-black font-black uppercase text-xs py-2 px-3 rounded-xl"
          aria-label="Xóa hồ sơ"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
