'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { PATHS } from '@/shared/config/paths';
import { logoutParent } from '../lib/parentAuth';

export interface ParentHeaderProps {
  onOpenSetPin?: () => void;
}

const NAV_ITEMS = [
  { label: '📊 TỔNG QUAN', href: PATHS.kids.parent, color: 'bg-[#FFE600]' },
  { label: '👶 BÉ YÊU', href: PATHS.kids.parentChildren, color: 'bg-[#FF90E8]' },
  { label: '📝 GIAO BÀI', href: PATHS.kids.parentAssignments, color: 'bg-[#A6FAFF]' },
  { label: '📈 KẾT QUẢ', href: PATHS.kids.parentResults, color: 'bg-[#B8FF9F]' },
];

export function ParentHeader({ onOpenSetPin }: ParentHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleExitToKids = () => {
    logoutParent();
    router.replace(PATHS.kids.root);
  };

  return (
    <header className="neo-box bg-white sticky top-0 z-30 mb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 border-b-2 border-black">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label="Khóa">🛡️</span>
            <div>
              <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-neutral-950 leading-tight">
                Góc Bố Mẹ
              </h1>
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                Bảng điều khiển &amp; Đồng hành cùng con
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSetPin && (
              <button
                type="button"
                onClick={onOpenSetPin}
                className="neo-btn bg-white text-black font-extrabold uppercase text-xs sm:text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <span>🔑</span>
                <span className="hidden sm:inline">Cài đặt PIN</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExitToKids}
              className="neo-btn bg-black text-white font-extrabold uppercase text-xs sm:text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              <span>🧸</span>
              <span>Về góc của bé</span>
            </button>
          </div>
        </div>

        <nav className="flex space-x-2 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-xs sm:text-sm uppercase tracking-wide rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? `neo-box-sm font-black text-black ${item.color}`
                    : 'text-neutral-700 hover:text-black font-extrabold'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
