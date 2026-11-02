'use client';

import { useState } from 'react';
import { setParentPin } from '@/shared/api/kids/parentApi';
import { getParentToken } from '../lib/parentStorage';
import { ParentModal } from './ParentModal';

export interface SetPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function useSetPinForm(onClose: () => void, onSuccess?: () => void) {
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Vui lòng nhập mật khẩu tài khoản hiện tại');
      return;
    }
    if (!/^\d{4,6}$/.test(pin)) {
      setError('Mã PIN phải gồm từ 4 đến 6 chữ số');
      return;
    }
    if (pin !== confirmPin) {
      setError('Mã PIN xác nhận không trùng khớp');
      return;
    }
    const token = getParentToken();
    if (!token) {
      setError('Phiên làm việc hết hạn, vui lòng đăng nhập lại');
      return;
    }

    setLoading(true);
    try {
      await setParentPin(token, { pin, password });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPassword('');
        setPin('');
        setConfirmPin('');
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật PIN, vui lòng thử lại';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { password, setPassword, pin, setPin, confirmPin, setConfirmPin, loading, error, success, handleSubmit };
}

export function SetPinModal({ isOpen, onClose, onSuccess }: SetPinModalProps) {
  const form = useSetPinForm(onClose, onSuccess);

  return (
    <ParentModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cài đặt mã PIN mở khóa"
      icon="🔑"
      headerColor="bg-[#FFE600]"
      maxWidth="max-w-md"
    >
      <p className="text-xs sm:text-sm font-medium text-neutral-700 mb-4">
        Mã PIN 4–6 số giúp bạn nhanh chóng truy cập khu vực Bố Mẹ trên thiết bị này mà không cần gõ mật khẩu dài.
      </p>

      {form.success ? (
        <div className="neo-box-sm bg-[#B8FF9F] text-black font-black text-sm text-center p-4 rounded-xl">
          ✓ Đã cập nhật mã PIN thành công!
        </div>
      ) : (
        <form onSubmit={form.handleSubmit} className="space-y-4">
          {form.error && (
            <div className="neo-box-sm bg-[#FF90E8] text-black font-bold text-xs uppercase p-3 rounded-xl">
              {form.error}
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase text-neutral-900 mb-1">
              Mật khẩu tài khoản phụ huynh
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => form.setPassword(e.target.value)}
              placeholder="Nhập mật khẩu để xác thực"
              className="neo-box-sm bg-white w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-black focus-visible:outline-[3px] focus-visible:outline-black"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-neutral-900 mb-1">
              Mã PIN mới (4–6 số)
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              required
              value={form.pin}
              onChange={(e) => form.setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Ví dụ: 1234"
              className="neo-box-sm bg-white w-full px-3.5 py-2.5 rounded-xl text-sm font-bold tracking-widest text-center text-black focus-visible:outline-[3px] focus-visible:outline-black"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-neutral-900 mb-1">
              Xác nhận mã PIN mới
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              required
              value={form.confirmPin}
              onChange={(e) => form.setConfirmPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Nhập lại mã PIN"
              className="neo-box-sm bg-white w-full px-3.5 py-2.5 rounded-xl text-sm font-bold tracking-widest text-center text-black focus-visible:outline-[3px] focus-visible:outline-black"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="neo-btn bg-white text-black font-bold uppercase text-xs sm:text-sm flex-1 py-2.5 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={form.loading}
              className="neo-btn bg-[#FFE600] text-black font-black uppercase text-xs sm:text-sm flex-1 py-2.5 rounded-xl disabled:opacity-50"
            >
              {form.loading ? 'Đang lưu...' : 'Lưu mã PIN'}
            </button>
          </div>
        </form>
      )}
    </ParentModal>
  );
}
