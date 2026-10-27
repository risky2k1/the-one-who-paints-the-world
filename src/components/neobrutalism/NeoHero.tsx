'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PortfolioData } from '../../types/portfolio';

interface NeoHeroProps {
  persona: PortfolioData['persona'];
}

export const NeoHero: React.FC<NeoHeroProps> = ({ persona }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sora.lindqvist.demo@example.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section className="relative w-full py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Status Pill */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="neo-badge bg-[#FFE600] text-black rounded-md">
          <span className="w-2 h-2 rounded-full bg-black animate-ping mr-1" />
          AVAILABLE FOR HIGH-IMPACT ARCHITECTURE ROLES
        </span>
        <span className="neo-badge bg-[#A6FAFF] text-black rounded-md hidden sm:inline-flex">
          📍 {persona.location}
        </span>
      </div>

      {/* Main Big Typographic Headline */}
      <div className="max-w-5xl mb-8">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-neutral-950 leading-[1.08] mb-6">
          Architecting{' '}
          <span className="inline-block bg-[#FFE600] px-3 py-1 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] rotate-[-1deg] mx-1">
            Resilient
          </span>{' '}
          Cloud Fabrics &amp;{' '}
          <span className="inline-block bg-[#FF90E8] px-3 py-1 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] rotate-[1.5deg] mx-1">
            High-Throughput
          </span>{' '}
          API Meshes.
        </h1>

        <p className="text-lg sm:text-xl text-neutral-800 font-medium max-w-3xl leading-relaxed">
          {persona.introHeadline ||
            'Designing calm, self-healing platforms, Kubernetes control planes, and deterministic GitOps pipelines with sub-millisecond edge latency and zero blindspots.'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 mb-16">
        <Link
          href="/portfolio"
          className="neo-btn inline-flex items-center gap-2.5 bg-[#FFE600] text-black font-black uppercase text-base sm:text-lg px-6 py-3.5 rounded-xl"
        >
          <span>🚀</span>
          <span>Launch 3D Portfolio World</span>
          <span className="font-mono text-xl">→</span>
        </Link>

        <a
          href="#projects"
          className="neo-btn inline-flex items-center gap-2 bg-white text-black font-extrabold uppercase text-base sm:text-lg px-6 py-3.5 rounded-xl"
        >
          <span>View Production Projects</span>
          <span className="font-mono">↓</span>
        </a>

        <button
          type="button"
          onClick={handleCopyEmail}
          className="neo-btn relative inline-flex items-center gap-2 bg-[#A6FAFF] text-black font-bold uppercase text-sm sm:text-base px-5 py-3.5 rounded-xl"
          title="Click to copy sample email address"
        >
          <span>{copied ? '✅' : '📋'}</span>
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Contact Email'}</span>
        </button>
      </div>

      {/* Bento Quick-Hub Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: 3D Experience Hub Highlight */}
        <div className="neo-card bg-white rounded-2xl flex flex-col justify-between overflow-hidden">
          <div className="bg-[#FF90E8] border-b-2 border-black p-4 flex items-center justify-between">
            <span className="font-black text-xs uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
              3D Spatial Hub
            </span>
            <span className="text-xl">🚗</span>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h2 className="font-black text-lg uppercase tracking-tight text-neutral-900 mb-2">
                Interactive 3D Diorama
              </h2>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium mb-4">
                Drive the coral studio coupe along the continuous pastel highway to inspect 6 sculptural landmark stops.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="neo-btn-sm w-full inline-flex items-center justify-center gap-1.5 bg-[#FFE600] text-black text-xs font-black uppercase py-2 rounded-lg"
            >
              <span>Explore In 3D</span>
              <span className="font-mono">→</span>
            </Link>
          </div>
        </div>

        {/* Card 2: Core Platform Primitives */}
        <div className="neo-card bg-white rounded-2xl flex flex-col justify-between overflow-hidden">
          <div className="bg-[#A6FAFF] border-b-2 border-black p-4 flex items-center justify-between">
            <span className="font-black text-xs uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
              Core Primitives
            </span>
            <span className="text-xl">⚙️</span>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h2 className="font-black text-lg uppercase tracking-tight text-neutral-900 mb-2">
                Distributed Fabrics
              </h2>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {['Kubernetes', 'Envoy xDS', 'Rust WASM', 'Cilium eBPF', 'Crossplane'].map((pill) => (
                  <span
                    key={pill}
                    className="border border-black bg-neutral-100 font-mono text-[11px] font-bold px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
            <a
              href="#tech-stack"
              className="neo-btn-sm w-full inline-flex items-center justify-center gap-1.5 bg-white text-black text-xs font-bold uppercase py-2 rounded-lg"
            >
              <span>Inspect All Stack</span>
              <span className="font-mono">↓</span>
            </a>
          </div>
        </div>

        {/* Card 3: Performance Metrics */}
        <div className="neo-card bg-white rounded-2xl flex flex-col justify-between overflow-hidden">
          <div className="bg-[#B8FF9F] border-b-2 border-black p-4 flex items-center justify-between">
            <span className="font-black text-xs uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
              Benchmarks
            </span>
            <span className="text-xl">⚡</span>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="space-y-2 mb-2">
              <div className="border border-black bg-[#FAF7F2] p-2 rounded-lg">
                <div className="font-black text-lg text-black">1.8 ms</div>
                <div className="text-[10px] uppercase font-bold text-neutral-600">
                  Simulated P99 Gateway Overhead
                </div>
              </div>
              <div className="border border-black bg-[#FAF7F2] p-2 rounded-lg">
                <div className="font-black text-lg text-black">100%</div>
                <div className="text-[10px] uppercase font-bold text-neutral-600">
                  Declarative GitOps IaC
                </div>
              </div>
            </div>
            <span className="text-[10px] text-neutral-500 font-semibold uppercase">
              Demonstration Benchmarks
            </span>
          </div>
        </div>

        {/* Card 4: Architecture Quick Connect */}
        <div className="neo-card bg-white rounded-2xl flex flex-col justify-between overflow-hidden">
          <div className="bg-[#FFE600] border-b-2 border-black p-4 flex items-center justify-between">
            <span className="font-black text-xs uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
              Quick Connect
            </span>
            <span className="text-xl">📬</span>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h2 className="font-black text-lg uppercase tracking-tight text-neutral-900 mb-2">
                Open For Contracts
              </h2>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium mb-3">
                Principal Advisory, Platform Engineering, Ingress Mesh &amp; GitOps rollouts.
              </p>
            </div>
            <a
              href="#contact"
              className="neo-btn-sm w-full inline-flex items-center justify-center gap-1.5 bg-[#A6FAFF] text-black text-xs font-black uppercase py-2 rounded-lg"
            >
              <span>Get In Touch</span>
              <span className="font-mono">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
