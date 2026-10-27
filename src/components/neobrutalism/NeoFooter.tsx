'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NeoFooterProps {
  isLive?: boolean;
}

export const NeoFooter: React.FC<NeoFooterProps> = ({ isLive = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('sora.lindqvist.demo@example.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="w-full border-t-3 border-black bg-[#FAF7F2]">
      {/* Contact Section Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="neo-card bg-white rounded-3xl p-8 sm:p-12 mb-16 border-3 border-black shadow-[6px_6px_0px_0px_#000]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="neo-badge bg-[#FFE600] text-black rounded-md">
                {"//"} GET IN TOUCH
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950">
                Let&apos;s build resilient systems together.
              </h2>
              <p className="text-sm sm:text-base text-neutral-700 font-medium max-w-xl">
                Available for advisory roles, high-throughput backend design, Kubernetes platform architecture, and GitOps implementations.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="border-2 border-black bg-[#FAF7F2] p-4 rounded-xl shadow-[3px_3px_0px_0px_#000]">
                <div className="text-[10px] font-black uppercase text-neutral-500 mb-1">
                  Sample Demonstration Contact
                </div>
                <div className="font-mono font-bold text-sm sm:text-base text-neutral-950 truncate mb-3">
                  sora.lindqvist.demo@example.com
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="neo-btn-sm w-full inline-flex items-center justify-center gap-2 bg-[#FFE600] text-black text-xs font-black uppercase py-2.5 rounded-lg"
                >
                  <span>{copied ? '✅' : '📋'}</span>
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Email Address'}</span>
                </button>
              </div>

              <Link
                href="/portfolio"
                className="neo-btn-sm w-full inline-flex items-center justify-center gap-2 bg-[#FF90E8] text-black text-xs font-black uppercase py-3 rounded-xl"
              >
                <span>🚗 Or Visit In 3D World Experience</span>
                <span className="font-mono">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Navigation & Legal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b-2 border-black text-sm">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 font-black text-lg">
              <span className="bg-[#FFE600] text-black border-2 border-black px-2 py-0.5 rounded shadow-[2px_2px_0px_0px_#000]">
                SL
              </span>
              <span>Sora Lindqvist</span>
            </div>
            <p className="text-xs text-neutral-600 max-w-sm font-medium">
              Staff Platform &amp; Cloud Infrastructure Architect. Engineered with Next.js App Router, Tailwind CSS, Neobrutalism, and Three.js.
            </p>
            <div className="pt-2">
              <span
                className={`inline-flex items-center gap-1.5 border border-black rounded-md px-2 py-0.5 text-[11px] font-bold uppercase ${
                  isLive ? 'bg-[#B8FF9F]' : 'bg-[#FFE600]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isLive ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}
                />
                {isLive ? 'CMS Connected' : 'Demo Mode Active'}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <div className="font-black text-xs uppercase tracking-wider text-neutral-900 mb-3">
              Navigation
            </div>
            <ul className="space-y-2 text-xs font-bold uppercase text-neutral-700">
              <li>
                <Link href="/" className="hover:underline">
                  Home (Neobrutalism)
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:underline text-[#ff2ec7] font-black">
                  🚀 3D Portfolio World
                </Link>
              </li>
              <li>
                <a href="#projects" className="hover:underline">
                  Featured Works
                </a>
              </li>
              <li>
                <a href="#tech-stack" className="hover:underline">
                  Tech Stack
                </a>
              </li>
              <li>
                <a href="#about" className="hover:underline">
                  Philosophy
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: External / Stack */}
          <div className="space-y-2">
            <div className="font-black text-xs uppercase tracking-wider text-neutral-900 mb-3">
              Stack &amp; Architecture
            </div>
            <ul className="space-y-2 text-xs font-bold uppercase text-neutral-700">
              <li>
                <a
                  href="https://www.neobrutalism.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  Neobrutalism.dev ↗
                </a>
              </li>
              <li>
                <span className="text-neutral-500">Next.js 14 App Router</span>
              </li>
              <li>
                <span className="text-neutral-500">Three.js / React Three Fiber</span>
              </li>
              <li>
                <span className="text-neutral-500">Botble CMS (Laravel 13)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-neutral-600">
          <div>
            © {new Date().getFullYear()} Sora Lindqvist. Sample Demonstration Portfolio.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="neo-btn-sm inline-flex items-center gap-1.5 bg-white text-black font-black uppercase text-xs px-3 py-1.5 rounded-lg"
          >
            <span>Back to top</span>
            <span className="font-mono">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
