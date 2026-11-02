'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getChildResults,
  getChildWeakSkills,
  listParentChildren,
} from '@/shared/api/kids/parentApi';
import type { AssignmentResult, Child, WeakSkill } from '@/shared/api/kids/kids.types';
import { getParentToken } from '../lib/parentStorage';

export function useParentResults() {
  const searchParams = useSearchParams();
  const childIdParam = searchParams.get('child_id');

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [weakSkills, setWeakSkills] = useState<WeakSkill[]>([]);
  const [results, setResults] = useState<AssignmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingChildData, setLoadingChildData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewingSessionId, setViewingSessionId] = useState<number | null>(null);

  useEffect(() => {
    const token = getParentToken();
    if (!token) return;

    setLoading(true);
    listParentChildren(token)
      .then((kids) => {
        setChildren(kids);
        if (kids.length > 0) {
          const preselect = childIdParam ? Number(childIdParam) : kids[0].id;
          const match = kids.find((k) => k.id === preselect) || kids[0];
          setSelectedChildId(match.id);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Có lỗi tải danh sách con'))
      .finally(() => setLoading(false));
  }, [childIdParam]);

  useEffect(() => {
    if (!selectedChildId) return;
    const token = getParentToken();
    if (!token) return;

    setLoadingChildData(true);
    Promise.all([
      getChildWeakSkills(token, selectedChildId).catch(() => []),
      getChildResults(token, selectedChildId).catch(() => []),
    ])
      .then(([skills, res]) => {
        setWeakSkills(skills);
        setResults(res);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Có lỗi tải kết quả của bé'))
      .finally(() => setLoadingChildData(false));
  }, [selectedChildId]);

  const selectedChild = children.find((c) => c.id === selectedChildId);

  return {
    children,
    selectedChildId,
    setSelectedChildId,
    selectedChild,
    weakSkills,
    results,
    loading,
    loadingChildData,
    error,
    viewingSessionId,
    setViewingSessionId,
  };
}
