'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { KidsShell } from '../components/KidsShell';
import { KidsApiError } from '@/shared/api/kids';
import { kidsPath } from '../lib/config';
import { setupDevice } from '../lib/setupDevice';

function messageFor(err: unknown): string {
  if (!(err instanceof KidsApiError)) return 'Có lỗi, con thử lại nhé';
  if (err.status === 401 || err.status === 422) return 'Sai tên đăng nhập hoặc mật khẩu';
  if (err.status === 429) return 'Thử lại sau ít phút nhé';
  if (err.status === 0) return 'Mất kết nối mạng, con thử lại nhé';
  return 'Có lỗi, con thử lại nhé';
}

export function KidsSetupView() {
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

  const inputClass =
    'neo-box-sm bg-white rounded-xl px-4 text-base font-bold text-black min-h-[56px] w-full focus-visible:outline-[3px] focus-visible:outline-black';

  return (
    <KidsShell>
      <div className="py-6 sm:py-10">
        <form onSubmit={submit} className="neo-box-lg bg-white rounded-2xl p-6 sm:p-8 mx-auto flex max-w-md flex-col gap-4">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-950">
            Thiết lập máy cho các bé
          </h1>
          <p className="text-sm font-bold text-neutral-700 leading-relaxed">
            Bố mẹ đăng nhập một lần, sau đó các bé chỉ cần chọn avatar.
          </p>

          <label className="flex flex-col gap-1 text-xs font-black uppercase text-neutral-900">
            Tên đăng nhập
            <input
              className={inputClass}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-black uppercase text-neutral-900">
            Mật khẩu
            <input
              className={inputClass}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div role="alert" className="neo-box-sm bg-[#FFE600] text-black font-bold p-3 rounded-xl text-center text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="neo-btn bg-[#FFE600] text-black font-black uppercase text-base min-h-[56px] rounded-xl px-6 py-3.5 disabled:opacity-60 mt-2"
          >
            {busy ? 'Đang thiết lập...' : 'Dùng máy này cho các bé'}
          </button>

          <div className="text-center pt-2">
            <Link
              href={kidsPath()}
              className="neo-btn bg-white text-black font-bold uppercase text-xs px-4 py-2 rounded-xl inline-block"
            >
              Quay lại
            </Link>
          </div>
        </form>
      </div>
    </KidsShell>
  );
}
