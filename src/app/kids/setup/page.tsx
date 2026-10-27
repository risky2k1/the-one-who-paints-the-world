'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { KidsShell } from '@/components/kids/KidsShell';
import { KidsApiError } from '@/lib/kids/api';
import { kidsPath } from '@/lib/kids/config';
import { setupDevice } from '@/lib/kids/setupDevice';

function messageFor(err: unknown): string {
  if (!(err instanceof KidsApiError)) return 'Có lỗi, con thử lại nhé';
  if (err.status === 401 || err.status === 422) return 'Sai tên đăng nhập hoặc mật khẩu';
  if (err.status === 429) return 'Thử lại sau ít phút nhé';
  if (err.status === 0) return 'Mất kết nối mạng, con thử lại nhé';
  return 'Có lỗi, con thử lại nhé';
}

export default function KidsSetupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await setupDevice(username.trim(), password);
      router.replace(kidsPath());
    } catch (err) {
      setError(messageFor(err));
      setBusy(false);
    }
  }

  const input = 'min-h-[56px] w-full rounded-2xl border-2 border-slate-300 bg-white px-4 text-xl';
  return (
    <KidsShell>
      <form onSubmit={submit} className="mx-auto flex max-w-md flex-col gap-4">
        <h1 className="text-3xl font-bold">Thiết lập máy cho các bé</h1>
        <p className="text-lg">Bố mẹ đăng nhập một lần, sau đó các bé chỉ cần chọn avatar.</p>
        <label className="flex flex-col gap-1 text-lg">
          Tên đăng nhập
          <input className={input} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </label>
        <label className="flex flex-col gap-1 text-lg">
          Mật khẩu
          <input className={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        {error && <p role="alert" className="text-lg font-semibold text-amber-800">{error}</p>}
        <button type="submit" disabled={busy} className="min-h-[56px] rounded-2xl bg-sky-600 px-6 text-xl font-bold text-white disabled:opacity-60">
          Dùng máy này cho các bé
        </button>
        <Link href={kidsPath()} className="text-center text-base underline">Quay lại</Link>
      </form>
    </KidsShell>
  );
}
