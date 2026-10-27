import React from 'react';
import './globals.css';
import './tailwind.css';

export const metadata = {
  title: 'Sora Lindqvist • Interactive 3D Platform & Cloud Portfolio',
  description:
    'Immersive single-viewport 3D portfolio world built with Next.js App Router, TypeScript, Three.js, and React Three Fiber.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans text-slate-800" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
