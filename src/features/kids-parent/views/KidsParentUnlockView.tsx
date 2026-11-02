'use client';

import Link from 'next/link';
import { PATHS } from '@/shared/config/paths';
import { PinPad } from '../components/PinPad';
import { useUnlockAuth } from '../hooks/useUnlockAuth';

export interface KidsParentUnlockViewProps {
  children: React.ReactNode;
}

interface PasswordFormProps {
  password: string;
  setPassword: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  onSwitchToPin: () => void;
}

function PasswordUnlockForm({
  password,
  setPassword,
  onSubmit,
  loading,
  error,
  onSwitchToPin,
}: PasswordFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="neo-box-sm bg-[#FF90E8] text-black font-bold text-xs uppercase p-3 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-black uppercase text-neutral-900 mb-1">
          Mật khẩu tài khoản
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu của bố mẹ"
          className="neo-box-sm bg-white w-full px-4 py-3 rounded-xl text-sm font-medium text-black focus-visible:outline-[3px] focus-visible:outline-black"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !password}
        className="neo-btn bg-[#FFE600] text-black font-black uppercase text-sm py-3 rounded-xl w-full disabled:opacity-50"
      >
        {loading ? 'Đang mở khóa...' : 'Mở khóa'}
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onSwitchToPin}
          className="text-xs font-black uppercase tracking-wide text-neutral-900 underline hover:text-black"
        >
          Mở khóa bằng mã PIN
        </button>
      </div>
    </form>
  );
}

export function KidsParentUnlockView({ children }: KidsParentUnlockViewProps) {
  const auth = useUnlockAuth();

  if (!auth.isReady) {
    return (
      <div className="min-h-screen neo-grid-bg flex items-center justify-center p-4">
        <div className="neo-box-sm bg-white p-6 rounded-2xl text-center">
          <div className="text-sm font-black uppercase tracking-wide text-neutral-950 animate-pulse">
            Đang kiểm tra thiết bị...
          </div>
        </div>
      </div>
    );
  }

  if (auth.isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen neo-grid-bg flex flex-col justify-between p-4 sm:p-6">
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl neo-box-sm bg-[#FFE600] text-3xl mb-3">
            🛡️
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
            Khu vực Bố Mẹ
          </h1>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-700 mt-1">
            {auth.mode === 'pin'
              ? 'Nhập mã PIN gồm 4 số để mở khóa nhanh'
              : 'Nhập mật khẩu tài khoản phụ huynh'}
          </p>
        </div>

        <div className="neo-box-lg bg-white rounded-2xl p-6 sm:p-8">
          {auth.mode === 'pin' ? (
            <div>
              <PinPad
                pin={auth.pin}
                onChange={auth.setPin}
                onComplete={auth.handleUnlockWithPin}
                maxLength={4}
                disabled={auth.loading}
                error={auth.error}
              />
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    auth.setError(null);
                    auth.setMode('password');
                  }}
                  className="text-xs font-black uppercase tracking-wide text-neutral-900 underline hover:text-black"
                >
                  Mở khóa bằng mật khẩu
                </button>
              </div>
            </div>
          ) : (
            <PasswordUnlockForm
              password={auth.password}
              setPassword={auth.setPassword}
              onSubmit={auth.handleUnlockWithPassword}
              loading={auth.loading}
              error={auth.error}
              onSwitchToPin={() => {
                auth.setError(null);
                auth.setMode('pin');
              }}
            />
          )}
        </div>

        <div className="text-center mt-6">
          <Link
            href={PATHS.kids.root}
            className="neo-btn bg-white text-black font-extrabold uppercase text-xs sm:text-sm px-4 py-2.5 rounded-xl inline-flex items-center gap-2"
          >
            <span>🧸</span>
            <span>Quay lại màn hình của con</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
