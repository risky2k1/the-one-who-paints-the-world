'use client';

import { useEffect, useState } from 'react';
import { deleteParentAssignment, listParentAssignments, listParentChildren } from '@/shared/api/kids/parentApi';
import type { Assignment, Child } from '@/shared/api/kids/kids.types';
import { getParentToken } from '../lib/parentStorage';

export function useParentAssignments() {
  const [children, setChildren] = useState<Child[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    const token = getParentToken();
    if (!token) return;

    setLoading(true);
    Promise.all([
      listParentChildren(token).catch(() => []),
      listParentAssignments(token).catch(() => []),
    ])
      .then(([kids, tasks]) => {
        setChildren(kids);
        setAssignments(tasks);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Có lỗi tải dữ liệu bài tập'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (assignment: Assignment) => {
    if (!window.confirm(`Bố mẹ có chắc chắn muốn xóa bài tập "${assignment.title}"?`)) {
      return;
    }

    const token = getParentToken();
    if (!token) return;

    try {
      await deleteParentAssignment(token, assignment.id);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Không thể xóa bài tập');
    }
  };

  return { children, assignments, loading, error, loadData, handleDelete };
}
