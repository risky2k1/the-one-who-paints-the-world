'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { kidsPath } from './config';
import { getKidSession, type KidSession } from './storage';

// Reads sessionStorage in an effect only (SSR-safe); null until read.
export function useKidSession(): KidSession | null {
  const router = useRouter();
  const [session, setSession] = useState<KidSession | null>(null);
  useEffect(() => {
    const s = getKidSession();
    if (s) setSession(s);
    else router.replace(kidsPath());
  }, [router]);
  return session;
}
