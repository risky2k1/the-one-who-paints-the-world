'use client';

import type { Child } from '@/shared/api/kids/kids.types';
import { AVATAR_EMOJIS, VALID_AVATARS } from '../lib/childrenManager';
import { useChildForm } from '../hooks/useChildForm';
import { ParentModal } from './ParentModal';
import { TopicToggleTree } from './TopicToggleTree';

export interface ChildEditorModalProps {
  isOpen: boolean;
  child: Child | null;
  onClose: () => void;
  onSaved: (child: Child) => void;
}

function AvatarPickerGrid({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (k: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
      {VALID_AVATARS.map((key) => {
        const isSelected = selected === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`h-12 rounded-xl flex items-center justify-center text-2xl neo-box-sm transition-all ${
              isSelected ? 'bg-[#FFE600] scale-105' : 'bg-white hover:bg-[#FAF7F2]'
            }`}
          >
            <span>{AVATAR_EMOJIS[key]}</span>
          </button>
        );
      })}
    </div>
  );
}

function ChildGradeTextbookSection({
  grade,
  textbook,
  onGradeChange,
  onTextbookChange,
}: {
  grade: number;
  textbook: 'ket_noi' | 'chan_troi' | 'canh_dieu';
  onGradeChange: (g: number) => void;
  onTextbookChange: (t: 'ket_noi' | 'chan_troi' | 'canh_dieu') => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-black uppercase text-neutral-900 mb-1">
          Khối lớp *
        </label>
        <select
          value={grade}
          onChange={(e) => onGradeChange(Number(e.target.value))}
          className="neo-box-sm bg-white w-full px-3.5 py-2.5 rounded-xl text-sm font-bold text-black focus-visible:outline-[3px] focus-visible:outline-black"
        >
          {[1, 2, 3, 4, 5].map((g) => (
            <option key={g} value={g}>
              Lớp {g}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-black uppercase text-neutral-900 mb-1">
          Bộ sách đang học
        </label>
        <select
          value={textbook}
          onChange={(e) => onTextbookChange(e.target.value as 'ket_noi' | 'chan_troi' | 'canh_dieu')}
          className="neo-box-sm bg-white w-full px-3.5 py-2.5 rounded-xl text-sm font-bold text-black focus-visible:outline-[3px] focus-visible:outline-black"
        >
          <option value="ket_noi">Kết nối tri thức</option>
          <option value="chan_troi">Chân trời sáng tạo</option>
          <option value="canh_dieu">Cánh Diều</option>
        </select>
      </div>
    </div>
  );
}

function AssignedFirstToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="p-3.5 rounded-xl neo-box-sm bg-[#FAF7F2]">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          id="assigned_first"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span className={`w-5 h-5 rounded-xs border-2 border-black flex items-center justify-center shrink-0 mt-0.5 ${checked ? 'bg-[#B8FF9F]' : 'bg-white'}`}>
          {checked && <span className="text-xs font-black">✓</span>}
        </span>
        <span className="text-xs text-neutral-800 leading-relaxed">
          <strong className="block text-neutral-950 font-black uppercase mb-0.5">
            Bắt buộc hoàn thành bài giao trước khi tự luyện
          </strong>
          Khi bật tính năng này, bé sẽ phải làm xong bài bố mẹ giao thì màn hình tự luyện mới mở khóa.
        </span>
      </label>
    </div>
  );
}

export function ChildEditorModal({ isOpen, child, onClose, onSaved }: ChildEditorModalProps) {
  const form = useChildForm({ child, isOpen, onSaved, onClose });

  return (
    <ParentModal
      isOpen={isOpen}
      onClose={onClose}
      title={child ? `Chỉnh sửa: ${child.name}` : 'Thêm hồ sơ bé mới'}
      icon="👶"
      headerColor="bg-[#FF90E8]"
      maxWidth="max-w-xl"
    >
      {form.error && (
        <div className="mb-4 neo-box-sm bg-[#FF90E8] text-black font-bold text-xs uppercase p-3 rounded-xl">
          {form.error}
        </div>
      )}

      <form onSubmit={form.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-black uppercase text-neutral-900 mb-1">
            Tên thường gọi của bé *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => form.setName(e.target.value)}
            placeholder="Ví dụ: Bo, Bi, Bống..."
            className="neo-box-sm bg-white w-full px-3.5 py-2.5 rounded-xl text-sm font-bold text-black focus-visible:outline-[3px] focus-visible:outline-black"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-neutral-900 mb-2">
            Chọn hình đại diện (Avatar) *
          </label>
          <AvatarPickerGrid selected={form.avatar} onSelect={form.setAvatar} />
        </div>

        <ChildGradeTextbookSection
          grade={form.grade}
          textbook={form.textbook}
          onGradeChange={form.setGrade}
          onTextbookChange={form.setTextbook}
        />

        <AssignedFirstToggle checked={form.assignedFirst} onChange={form.setAssignedFirst} />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-black uppercase text-neutral-900">
              Chủ đề Toán lớp {form.grade}
            </label>
            <span className="text-xs font-bold text-neutral-600 uppercase">
              Đã tắt: {form.disabledTopicIds.length} chủ đề
            </span>
          </div>

          {form.loadingTopics ? (
            <p className="text-xs font-black uppercase text-neutral-700 animate-pulse py-2">
              Đang nạp chủ đề...
            </p>
          ) : (
            <TopicToggleTree
              topics={form.availableTopics}
              disabledTopicIds={form.disabledTopicIds}
              onToggle={form.handleToggleTopic}
            />
          )}
        </div>

        <div className="flex gap-3 pt-3 border-t-2 border-black">
          <button
            type="button"
            onClick={onClose}
            className="neo-btn bg-white text-black font-bold uppercase text-xs sm:text-sm flex-1 py-2.5 rounded-xl"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={form.saving}
            className="neo-btn bg-[#FFE600] text-black font-black uppercase text-xs sm:text-sm flex-1 py-2.5 rounded-xl disabled:opacity-50"
          >
            {form.saving ? 'Đang lưu...' : child ? 'Lưu thay đổi' : 'Tạo hồ sơ'}
          </button>
        </div>
      </form>
    </ParentModal>
  );
}
