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
      className="glass-water group p-5 relative"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-foreground tracking-tight">{name}</h3>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-muted/50 rounded-md px-2 py-1">
              <Zap className="h-3 w-3" />
              {latencyMs}ms
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className={`h-2 w-2 rounded-full ${
                  isOnline ? 'bg-emerald-400 status-online' : 'bg-red-400 status-offline'
                }`}
              />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
                {isOnline ? 'Live' : 'Down'}
              </span>
            </div>
          </div>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">{description}</p>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/80 active:scale-[0.98]"
          onClick={(e) => e.stopPropagation()}
        >
          Launch <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </motion.div>
  );
};
