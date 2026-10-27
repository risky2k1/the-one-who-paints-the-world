'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NeoNavbarProps {
  isLive?: boolean;
}

export const NeoNavbar: React.FC<NeoNavbarProps> = ({ isLive = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-black bg-[#FAF7F2]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 group font-black text-lg tracking-tight"
          >
            <span className="bg-[#FFE600] text-black border-2 border-black px-2.5 py-1 rounded-md shadow-[2px_2px_0px_0px_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
              SL
            </span>
            <span className="font-extrabold uppercase tracking-tight text-neutral-900 group-hover:text-black">
              Sora Lindqvist
            </span>
          </Link>

          {/* CMS Status Pill */}
          <span
            className={`hidden md:inline-flex items-center gap-1.5 border-2 border-black rounded-full px-2.5 py-0.5 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_#000] ${
              isLive ? 'bg-[#B8FF9F]' : 'bg-[#FFE600]'
            }`}
            title={isLive ? 'Connected live to Botble CMS' : 'Running in local demonstration mode'}
          >
            <span
              className={`w-2 h-2 rounded-full border border-black ${
                isLive ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
              }`}
            />
            {isLive ? 'CMS Live' : 'Demo Standby'}
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-black uppercase">
          <a
            href="#projects"
            className="hover:underline underline-offset-4 decoration-2 decoration-black transition-all"
          >
            01. Works
          </a>
          <a
            href="#tech-stack"
            className="hover:underline underline-offset-4 decoration-2 decoration-black transition-all"
          >
            02. Tech Stack
          </a>
          <a
            href="#about"
            className="hover:underline underline-offset-4 decoration-2 decoration-black transition-all"
          >
            03. Philosophy
          </a>
          <a
            href="#contact"
            className="hover:underline underline-offset-4 decoration-2 decoration-black transition-all"
          >
            04. Contact
          </a>
        </nav>

        {/* CTA: Navigate to 3D Portfolio */}
        <div className="flex items-center gap-3">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 bg-[#FF90E8] hover:bg-[#ff7be5] text-black font-black uppercase text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all"
          >
            <span className="text-base">🚀</span>
            <span>3D World Experience</span>
            <span className="hidden sm:inline font-mono">→</span>
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-5 h-5 stroke-current stroke-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-black bg-[#FAF7F2] p-4 flex flex-col gap-3 font-black text-sm uppercase">
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 border-2 border-black rounded-md bg-white shadow-[2px_2px_0px_0px_#000]"
          >
            01. Works
          </a>
          <a
            href="#tech-stack"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 border-2 border-black rounded-md bg-white shadow-[2px_2px_0px_0px_#000]"
          >
            02. Tech Stack
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 border-2 border-black rounded-md bg-white shadow-[2px_2px_0px_0px_#000]"
          >
            03. Philosophy
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 border-2 border-black rounded-md bg-white shadow-[2px_2px_0px_0px_#000]"
          >
            04. Contact
          </a>
          <Link
            href="/portfolio"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2.5 text-center bg-[#FF90E8] border-2 border-black rounded-md shadow-[3px_3px_0px_0px_#000] font-black"
          >
            🚀 Launch 3D Portfolio Experience →
          </Link>
        </div>
      )}
    </header>
  );
};
