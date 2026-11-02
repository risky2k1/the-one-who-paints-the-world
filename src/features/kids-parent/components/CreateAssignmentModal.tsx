'use client';

import type { Assignment, Child } from '@/shared/api/kids/kids.types';
import { useAssignmentForm } from '../hooks/useAssignmentForm';
import { ParentModal } from './ParentModal';
import {
  AssignmentChildTitleInputs,
  AssignmentTopicsPicker,
  DifficultySelector,
  QuestionCountSlider,
  TimeLimitSelector,
} from './AssignmentConfigControls';

export interface CreateAssignmentModalProps {
  isOpen: boolean;
  childrenList: Child[];
  preselectedChildId?: number | null;
  onClose: () => void;
  onCreated: (assignment: Assignment) => void;
}

export function CreateAssignmentModal({
  isOpen,
  childrenList,
  preselectedChildId,
  onClose,
  onCreated,
}: CreateAssignmentModalProps) {
  const form = useAssignmentForm({ childrenList, preselectedChildId, isOpen, onCreated, onClose });

  return (
    <ParentModal
      isOpen={isOpen}
      onClose={onClose}
      title="Giao bài tập mới"
      icon="📝"
      headerColor="bg-[#A6FAFF]"
      maxWidth="max-w-2xl"
    >
      {form.error && (
        <div className="mb-4 neo-box-sm bg-[#FF90E8] text-black font-bold text-xs uppercase p-3 rounded-xl">
          {form.error}
        </div>
      )}

      <form onSubmit={form.handleSubmit} className="space-y-4">
        <AssignmentChildTitleInputs
          childrenList={childrenList}
          childId={form.childId}
          title={form.title}
          onChildChange={(id) => {
            form.setChildId(id);
            form.setSelectedTopicIds([]);
          }}
          onTitleChange={form.setTitle}
        />

        <div>
          <label className="block text-xs font-black uppercase text-neutral-900 mb-1.5">
            Chọn chủ đề *
          </label>
          {form.loadingTopics ? (
            <p className="text-xs font-black uppercase text-neutral-700 animate-pulse py-2">
              Đang nạp danh mục chủ đề...
            </p>
          ) : (
            <AssignmentTopicsPicker
              topics={form.topics}
              selectedIds={form.selectedTopicIds}
              onToggle={form.handleToggleTopic}
            />
          )}
        </div>

        <QuestionCountSlider count={form.questionCount} onChange={form.setQuestionCount} />
        <DifficultySelector value={form.difficulty} onChange={form.setDifficulty} />
        <TimeLimitSelector value={form.timeLimit} onChange={form.setTimeLimit} />

        <div>
          <label className="block text-xs font-black uppercase text-neutral-900 mb-1">
            Hạn nộp bài (tùy chọn)
          </label>
          <input
            type="date"
            value={form.dueAt}
            onChange={(e) => form.setDueAt(e.target.value)}
            className="neo-box-sm bg-white w-full px-3.5 py-2.5 rounded-xl text-sm font-bold text-black focus-visible:outline-[3px] focus-visible:outline-black"
          />
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
            className="neo-btn bg-[#A6FAFF] text-black font-black uppercase text-xs sm:text-sm flex-1 py-2.5 rounded-xl disabled:opacity-50"
          >
            {form.saving ? 'Đang giao...' : 'Giao bài cho con'}
          </button>
        </div>
      </form>
    </ParentModal>
  );
}
