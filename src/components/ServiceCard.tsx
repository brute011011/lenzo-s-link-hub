import { FC } from 'react';
import { LiquidGlassCard } from './LiquidGlassCard';

export const ServiceCard: FC<{ name: string; url: string; description: string; status: string; latencyMs: number }> = ({ name, url, description, status, latencyMs }) => {
  const isOnline = status.toLowerCase() === 'online';
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block group">
      <LiquidGlassCard className="p-7 h-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-[-4px]">
        <div className="flex justify-between items-start mb-5">
          <h3 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">{name}</h3>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.05]">
             <div className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-[#34C759]' : 'bg-[#FF3B30]'}`} />
             <span className="text-[10px] font-bold text-[#1D1D1F] tracking-tight uppercase">{status}</span>
          </div>
        </div>
        <p className="text-[#86868B] text-[15px] leading-snug font-medium flex-grow">{description}</p>
        <div className="mt-8 pt-5 border-t border-black/[0.04] flex justify-between items-center">
          <span className="text-[11px] font-bold text-[#1D1D1F] opacity-40 tracking-tight">{latencyMs}MS RESPONSE</span>
          <span className="text-[11px] font-bold text-[#007AFF] tracking-tight group-hover:translate-x-1 transition-transform">OPEN →</span>
        </div>
      </LiquidGlassCard>
    </a>
  );
};
