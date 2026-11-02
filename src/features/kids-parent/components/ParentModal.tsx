'use client';

import React, { useEffect, useRef } from 'react';

export interface ParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  headerColor?: string;
  maxWidth?: string;
  children: React.ReactNode;
}

export function ParentModal({
  isOpen,
  onClose,
  title,
  icon,
  headerColor = 'bg-[#FFE600]',
  maxWidth = 'max-w-lg',
  children,
}: ParentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={modalRef}
        className={`w-full ${maxWidth} bg-white neo-box-lg rounded-2xl overflow-hidden my-8`}
      >
        <div className={`${headerColor} border-b-2 border-black p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {icon && <span className="text-xl">{icon}</span>}
            <h2 className="font-black text-base sm:text-lg uppercase tracking-tight text-neutral-900">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="neo-btn bg-white text-black font-black w-8 h-8 rounded-lg flex items-center justify-center"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
