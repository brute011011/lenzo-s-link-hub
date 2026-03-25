import { FC } from 'react';
import { LiquidGlassCard } from './LiquidGlassCard';

export const ServiceCard: FC<{ name: string; url: string; description: string; status: string; latencyMs: number }> = ({ name, url, description, status, latencyMs }) => {
  const isOnline = status.toLowerCase() === 'online';
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block group h-full">
      <LiquidGlassCard className="p-9 h-full flex flex-col group-hover:translate-y-[-6px]">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">{name}</h3>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.06]">
             <div className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-[#34C759]' : 'bg-[#FF3B30]'}`} />
             <span className="text-[10px] font-bold text-[#1D1D1F] uppercase tracking-tight">{status}</span>
          </div>
        </div>
        <p className="text-[#86868B] text-[16px] leading-relaxed font-medium flex-grow mb-8">{description}</p>
        <div className="mt-auto pt-6 border-t border-black/[0.04] flex justify-between items-center">
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black text-[#86868B] uppercase tracking-[0.12em] opacity-60">Status</span>
            <span className="text-xs font-bold text-[#007AFF]">{latencyMs}MS RESPONSE</span>
          </div>
          <span className="text-[11px] font-bold text-[#1D1D1F] group-hover:translate-x-1 transition-transform tracking-tight">CONNECT →</span>
        </div>
      </LiquidGlassCard>
    </a>
  );
};
