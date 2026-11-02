'use client';

import { useEffect, useState } from 'react';
import { createParentChild, listParentTopics, updateParentChild } from '@/shared/api/kids/parentApi';
import type { Child, ChildInput, Topic } from '@/shared/api/kids/kids.types';
import { toggleTopicId, validateChildInput } from '../lib/childrenManager';
import { getParentToken } from '../lib/parentStorage';

interface UseChildFormProps {
  child: Child | null;
  isOpen: boolean;
  onSaved: (child: Child) => void;
  onClose: () => void;
}

export function useChildForm({ child, isOpen, onSaved, onClose }: UseChildFormProps) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string>('fox');
  const [grade, setGrade] = useState<number>(2);
  const [textbook, setTextbook] = useState<'ket_noi' | 'chan_troi' | 'canh_dieu'>('ket_noi');
  const [assignedFirst, setAssignedFirst] = useState(false);
  const [disabledTopicIds, setDisabledTopicIds] = useState<number[]>([]);

  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (child) {
      setName(child.name);
      setAvatar(child.avatar);
      setGrade(child.grade);
      setTextbook(child.textbook);
      setAssignedFirst(child.assigned_first);
      setDisabledTopicIds(child.disabled_topic_ids || []);
    } else {
      setName('');
      setAvatar('fox');
      setGrade(2);
      setTextbook('ket_noi');
      setAssignedFirst(false);
      setDisabledTopicIds([]);
    }
    setError(null);
  }, [child, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const token = getParentToken();
    if (!token) return;

    setLoadingTopics(true);
    listParentTopics(token, grade)
      .then((topics) => setAvailableTopics(topics))
      .catch(() => setAvailableTopics([]))
      .finally(() => setLoadingTopics(false));
  }, [grade, isOpen]);

  const handleToggleTopic = (topicId: number) => {
    setDisabledTopicIds((prev) => toggleTopicId(prev, topicId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: ChildInput = {
      name: name.trim(),
      avatar,
      grade,
      textbook,
      disabled_topic_ids: disabledTopicIds,
      assigned_first: assignedFirst,
    };

    const validation = validateChildInput(payload);
    if (!validation.valid) {
      const firstErr = Object.values(validation.errors)[0];
      setError(firstErr);
      return;
    }

    const token = getParentToken();
    if (!token) {
      setError('Phiên làm việc hết hạn, vui lòng đăng nhập lại');
      return;
    }

    setSaving(true);
    try {
      const savedChild = child
        ? await updateParentChild(token, child.id, payload)
        : await createParentChild(token, payload);
      onSaved(savedChild);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi khi lưu hồ sơ bé');
    } finally {
      setSaving(false);
    }
  };

  return {
    name,
    setName,
    avatar,
    setAvatar,
    grade,
    setGrade,
    textbook,
    setTextbook,
    assignedFirst,
    setAssignedFirst,
    disabledTopicIds,
    handleToggleTopic,
    availableTopics,
    loadingTopics,
    saving,
    error,
    handleSubmit,
  };
}
