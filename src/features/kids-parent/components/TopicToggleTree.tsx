'use client';

import type { Topic } from '@/shared/api/kids/kids.types';

export interface TopicToggleTreeProps {
  topics: Topic[];
  disabledTopicIds: number[];
  onToggle: (topicId: number) => void;
}

interface TopicLeafItemProps {
  leaf: Topic;
  isEnabled: boolean;
  onToggle: (topicId: number) => void;
}

function TopicLeafItem({ leaf, isEnabled, onToggle }: TopicLeafItemProps) {
  return (
    <label
      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-bold border-2 border-black transition-colors ${
        isEnabled ? 'bg-white text-black' : 'bg-neutral-200 text-neutral-500 line-through'
      }`}
    >
      <input
        type="checkbox"
        checked={isEnabled}
        onChange={() => onToggle(leaf.id)}
        className="sr-only"
      />
      <span
        className={`w-4 h-4 rounded-xs border-2 border-black flex items-center justify-center shrink-0 ${
          isEnabled ? 'bg-[#B8FF9F]' : 'bg-white'
        }`}
      >
        {isEnabled && <span className="text-[10px] font-black leading-none">✓</span>}
      </span>
      <span className="truncate">{leaf.name}</span>
    </label>
  );
}

export function TopicToggleTree({ topics, disabledTopicIds, onToggle }: TopicToggleTreeProps) {
  const categories = topics.filter((t) => t.parent_id === null || !t.is_leaf);
  const leaves = topics.filter((t) => t.is_leaf);

  if (leaves.length === 0) {
    return (
      <p className="text-xs font-bold uppercase text-neutral-600 py-2">
        Chưa có danh mục chủ đề nào cho khối lớp này.
      </p>
    );
  }

  if (categories.length > 0) {
    return (
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {categories.map((cat) => {
          const catLeaves = leaves.filter((l) => l.parent_id === cat.id);
          if (catLeaves.length === 0) return null;

          return (
            <div key={cat.id} className="neo-box-sm rounded-xl p-3 bg-[#FAF7F2]">
              <h5 className="font-black text-[11px] text-neutral-950 uppercase tracking-wider mb-2">
                {cat.name}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {catLeaves.map((leaf) => (
                  <TopicLeafItem
                    key={leaf.id}
                    leaf={leaf}
                    isEnabled={!disabledTopicIds.includes(leaf.id)}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
      {leaves.map((leaf) => (
        <TopicLeafItem
          key={leaf.id}
          leaf={leaf}
          isEnabled={!disabledTopicIds.includes(leaf.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
