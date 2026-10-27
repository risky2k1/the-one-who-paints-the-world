import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Góc luyện Toán',
  robots: { index: false, follow: false },
};

export default function KidsLayout({ children }: { children: ReactNode }) {
  return <div lang="vi">{children}</div>;
}
