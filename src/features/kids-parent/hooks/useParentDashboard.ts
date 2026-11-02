'use client';

import { useEffect, useState } from 'react';
import { listParentAssignments, listParentChildren } from '@/shared/api/kids/parentApi';
import type { Assignment, Child } from '@/shared/api/kids/kids.types';
import { getParentToken } from '../lib/parentStorage';

export function useParentDashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getParentToken();
    if (!token) return;

    let mounted = true;
    Promise.all([
      listParentChildren(token).catch(() => []),
      listParentAssignments(token).catch(() => []),
    ])
      .then(([kids, tasks]) => {
        if (!mounted) return;
        setChildren(kids);
        setAssignments(tasks);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Có lỗi tải dữ liệu');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { children, assignments, loading, error };
}
