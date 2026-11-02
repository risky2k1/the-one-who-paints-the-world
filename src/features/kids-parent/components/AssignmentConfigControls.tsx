'use client';

import type { Child, Topic } from '@/shared/api/kids/kids.types';

const DIFFICULTIES: Array<{ id: 'adaptive' | 'easy' | 'medium' | 'hard'; label: string }> = [
  { id: 'adaptive', label: 'TỰ THÍCH ỨNG' },
  { id: 'easy', label: 'DỄ' },
  { id: 'medium', label: 'VỪA' },
  { id: 'hard', label: 'KHÓ' },
];

const TIME_LIMITS: Array<{ seconds: number; label: string }> = [
  { seconds: 0, label: 'KHÔNG' },
  { seconds: 300, label: '5 PHÚT' },
  { seconds: 600, label: '10 PHÚT' },
  { seconds: 900, label: '15 PHÚT' },
  { seconds: 1800, label: '30 PHÚT' },
];

export function AssignmentChildTitleInputs({
  childrenList,
  childId,
  title,
  onChildChange,
  onTitleChange,
}: {
  childrenList: Child[];
  childId: number;
  title: string;
  onChildChange: (id: number) => void;
  onTitleChange: (t: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-black uppercase text-neutral-900 mb-1">
          Giao cho bé nào? *
        </label>
        <select
          value={childId}
          onChange={(e) => onChildChange(Number(e.target.value))}
          className="neo-box-sm bg-white w-full px-3.5 py-2.5 rounded-xl text-sm font-bold text-black focus-visible:outline-[3px] focus-visible:outline-black"
        >
          {childrenList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} (Lớp {c.grade})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-black uppercase text-neutral-900 mb-1">
          Tiêu đề bài tập *
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Ví dụ: Ôn tập cuối tuần"
          className="neo-box-sm bg-white w-full px-3.5 py-2.5 rounded-xl text-sm font-bold text-black focus-visible:outline-[3px] focus-visible:outline-black"
        />
      </div>
    </div>
  );
}

export function DifficultySelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (d: 'adaptive' | 'easy' | 'medium' | 'hard') => void;
}) {
  return (
    <div>
      <label className="block text-xs font-black uppercase text-neutral-900 mb-1.5">
        Mức độ thử thách
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onChange(d.id)}
            className={`neo-box-sm rounded-lg py-1.5 px-2 text-[11px] font-black uppercase tracking-wide transition-all ${
              value === d.id ? 'bg-[#FFE600] text-black scale-102' : 'bg-white text-neutral-700'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TimeLimitSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (s: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-black uppercase text-neutral-900 mb-1.5">
        Giới hạn thời gian
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
        {TIME_LIMITS.map((t) => (
          <button
            key={t.seconds}
            type="button"
            onClick={() => onChange(t.seconds)}
            className={`neo-box-sm rounded-lg py-1.5 px-1.5 text-[11px] font-black uppercase tracking-wide transition-all ${
              value === t.seconds ? 'bg-[#A6FAFF] text-black scale-102' : 'bg-white text-neutral-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function QuestionCountSlider({
  count,
  onChange,
}: {
  count: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-black uppercase text-neutral-900">Số lượng câu hỏi</label>
        <span className="neo-badge bg-[#FFE600] text-black font-black text-xs px-2 py-0.5 rounded">
          {count} CÂU
        </span>
      </div>
      <input
        type="range"
        min={5}
        max={30}
        step={1}
        value={count}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-black cursor-pointer border-2 border-black rounded-lg h-3 bg-white"
      />
    </div>
  );
}

export function AssignmentTopicsPicker({
  topics,
  selectedIds,
  onToggle,
}: {
  topics: Topic[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
      {topics.map((t) => {
        const isChecked = selectedIds.includes(t.id);
        return (
          <label
            key={t.id}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-bold border-2 border-black transition-colors ${
              isChecked ? 'bg-[#FFE600] text-black' : 'bg-white text-neutral-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(t.id)}
              className="sr-only"
            />
            <span
              className={`w-4 h-4 rounded-xs border-2 border-black flex items-center justify-center shrink-0 ${
                isChecked ? 'bg-black text-white' : 'bg-white'
              }`}
            >
              {isChecked && <span className="text-[10px] font-black leading-none">✓</span>}
            </span>
            <span className="truncate">{t.name}</span>
          </label>
        );
      })}
    </div>
  );
}
