'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/shared/config/paths';
import { unlockParentSession } from '../lib/parentAuth';
import { getDeviceToken, hasParentToken } from '../lib/parentStorage';

export function useUnlockAuth() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [mode, setMode] = useState<'pin' | 'password'>('pin');
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const devToken = getDeviceToken();
    if (!devToken) {
      router.replace(PATHS.kids.setup);
      return;
    }
    if (hasParentToken()) {
      setIsUnlocked(true);
    }
    setIsReady(true);
  }, [router]);

  const handleUnlockWithPin = async (pinValue: string) => {
    const devToken = getDeviceToken();
    if (!devToken) {
      router.replace(PATHS.kids.setup);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await unlockParentSession(devToken, { pin: pinValue });
      setIsUnlocked(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Mã PIN không đúng, vui lòng thử lại';
      setError(msg);
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const devToken = getDeviceToken();
    if (!devToken) {
      router.replace(PATHS.kids.setup);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await unlockParentSession(devToken, { password });
      setIsUnlocked(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Mật khẩu không chính xác';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    isReady,
    isUnlocked,
    mode,
    setMode,
    pin,
    setPin,
    password,
    setPassword,
    loading,
    error,
    setError,
    handleUnlockWithPin,
    handleUnlockWithPassword,
  };
}
