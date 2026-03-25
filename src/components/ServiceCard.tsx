import { FC } from 'react';
import { LiquidGlassCard } from './LiquidGlassCard';

interface ServiceCardProps {
  name: string;
  url: string;
  description: string;
  status: string;
  latencyMs: number;
}

export const ServiceCard: FC<ServiceCardProps> = ({ name, url, description, status, latencyMs }) => {
  const isOnline = status.toLowerCase() === 'online';
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">
      <LiquidGlassCard className="p-6 h-full flex flex-col hover:scale-[1.02] transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">{name}</h3>
          <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${isOnline ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
            {status}
          </div>
        </div>
        <p className="text-sm text-[#86868B] flex-grow leading-relaxed">{description}</p>
        <div className="mt-6 pt-4 border-t border-black/[0.03] flex justify-between items-center">
          <span className="text-[10px] font-bold text-[#007AFF]">{latencyMs}ms</span>
          <span className="text-[10px] font-bold text-[#1D1D1F] opacity-30">CONNECT →</span>
        </div>
      </LiquidGlassCard>
    </a>
  );
};
