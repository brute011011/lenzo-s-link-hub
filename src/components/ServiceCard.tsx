import { ExternalLink, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  name: string;
  url: string;
  description: string;
  status: string;
  latencyMs: number;
}

export const ServiceCard = ({ name, url, description, status, latencyMs }: ServiceCardProps) => {
  const isOnline = status === 'online';

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="safari-clean-glass group p-6 relative"
    >
      <div className="surface-sheen" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold" style={{ color: '#1D1D1F' }}>{name}</h3>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-mono rounded-full px-2.5 py-1" style={{ background: 'rgba(0,0,0,0.04)', color: '#86868B' }}>
              <Zap className="h-3 w-3" />
              {latencyMs}ms
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className={`h-2 w-2 rounded-full ${
                  isOnline ? 'bg-emerald-500 status-online' : 'bg-red-500 status-offline'
                }`}
              />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isOnline ? 'text-emerald-600' : 'text-red-500'}`}>
                {isOnline ? 'Live' : 'Down'}
              </span>
            </div>
          </div>
        </div>
        {description && (
          <p className="text-sm mb-4 leading-relaxed line-clamp-2" style={{ color: '#86868B' }}>{description}</p>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 pill-btn px-5 py-2.5 text-sm font-semibold text-white active:scale-[0.98]"
          style={{ background: '#007AFF' }}
          onClick={(e) => e.stopPropagation()}
        >
          Launch <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </motion.div>
  );
};
