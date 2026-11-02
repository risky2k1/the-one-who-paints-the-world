'use client';

import { useEffect, useState } from 'react';
import { createParentAssignment, listParentTopics } from '@/shared/api/kids/parentApi';
import type { Assignment, AssignmentInput, Child, Topic } from '@/shared/api/kids/kids.types';
import { validateAssignmentInput } from '../lib/assignmentForm';
import { getParentToken } from '../lib/parentStorage';

interface UseAssignmentFormProps {
  childrenList: Child[];
  preselectedChildId?: number | null;
  isOpen: boolean;
  onCreated: (assignment: Assignment) => void;
  onClose: () => void;
}

function useAssignmentTopics(child: Child | undefined, isOpen: boolean) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  useEffect(() => {
    if (!isOpen || !child) return;
    const token = getParentToken();
    if (!token) return;

    setLoadingTopics(true);
    listParentTopics(token, child.grade)
      .then((res) => {
        setTopics(res.filter((t) => t.is_leaf));
      })
      .catch(() => setTopics([]))
      .finally(() => setLoadingTopics(false));
  }, [child, isOpen]);

  return { topics, loadingTopics };
}

export function useAssignmentForm({
  childrenList,
  preselectedChildId,
  isOpen,
  onCreated,
  onClose,
}: UseAssignmentFormProps) {
  const [childId, setChildId] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<'adaptive' | 'easy' | 'medium' | 'hard'>('adaptive');
  const [dueAt, setDueAt] = useState('');
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedChildId) {
      setChildId(preselectedChildId);
    } else if (childrenList.length > 0 && !childId) {
      setChildId(childrenList[0].id);
    }
  }, [preselectedChildId, childrenList, childId]);

  const selectedChild = childrenList.find((c) => c.id === childId);
  const { topics, loadingTopics } = useAssignmentTopics(selectedChild, isOpen);

  useEffect(() => {
    if (topics.length > 0 && selectedTopicIds.length === 0) {
      setSelectedTopicIds([topics[0].id]);
    }
  }, [topics, selectedTopicIds.length]);

  const handleToggleTopic = (topicId: number) => {
    if (selectedTopicIds.includes(topicId)) {
      if (selectedTopicIds.length > 1) {
        setSelectedTopicIds(selectedTopicIds.filter((id) => id !== topicId));
      }
    } else {
      setSelectedTopicIds([...selectedTopicIds, topicId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: AssignmentInput = {
      child_id: childId,
      title: title.trim(),
      topic_ids: selectedTopicIds,
      question_count: questionCount,
      difficulty,
      due_at: dueAt ? new Date(dueAt).toISOString() : null,
      time_limit_seconds: timeLimit > 0 ? timeLimit : null,
    };
    const validation = validateAssignmentInput(payload);
    if (!validation.valid) {
      setError(Object.values(validation.errors)[0]);
      return;
    }
    const token = getParentToken();
    if (!token) {
      setError('Phiên làm việc hết hạn, vui lòng đăng nhập lại');
      return;
    }
    setSaving(true);
    try {
      const created = await createParentAssignment(token, payload);
      onCreated(created);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi khi giao bài tập');
    } finally {
      setSaving(false);
    }
  };

  return {
    childId,
    setChildId,
    title,
    setTitle,
    selectedTopicIds,
    setSelectedTopicIds,
    handleToggleTopic,
    questionCount,
    setQuestionCount,
    difficulty,
    setDifficulty,
    dueAt,
    setDueAt,
    timeLimit,
    setTimeLimit,
    topics,
    loadingTopics,
    saving,
    error,
    handleSubmit,
  };
}
