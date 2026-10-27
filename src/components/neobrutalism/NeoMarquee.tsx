import React from 'react';

interface NeoMarqueeProps {
  items?: string[];
  bgColor?: string;
  className?: string;
}

export const NeoMarquee: React.FC<NeoMarqueeProps> = ({
  items = [
    '⚡ KUBERNETES FABRIC',
    '★ GOLANG & RUST MICROSERVICES',
    '⚡ ENVOY XDS ROUTING',
    '★ SUB-2MS P99 LATENCY',
    '⚡ 3D SPATIAL ODYSSEY',
    '★ EBPF CILIUM MESH',
    '⚡ OPENTELEMETRY TRACING',
    '★ DECLARATIVE GITOPS CI/CD',
    '⚡ ZERO-BLINDSPOT SRE',
    '★ 99.999% AVAILABILITY',
  ],
  bgColor = 'bg-[#FFE600]',
  className = '',
}) => {
  return (
    <div
      className={`w-full overflow-hidden border-y-2 border-black ${bgColor} py-2.5 font-black uppercase text-xs sm:text-sm tracking-wider text-black select-none ${className}`}
    >
      <div className="neo-marquee-track">
        {/* Render items twice to ensure smooth infinite loop */}
        <div className="flex shrink-0 items-center gap-8 px-4">
          {items.map((item, idx) => (
            <span key={`m1-${idx}`} className="flex items-center gap-2 whitespace-nowrap">
              <span>{item}</span>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-8 px-4" aria-hidden="true">
          {items.map((item, idx) => (
            <span key={`m2-${idx}`} className="flex items-center gap-2 whitespace-nowrap">
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
