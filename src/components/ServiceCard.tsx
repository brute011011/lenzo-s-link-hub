import { ExternalLink } from 'lucide-react';
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
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="glass-water group cursor-pointer p-6 relative"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-foreground font-sf tracking-wide">{name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">{latencyMs}ms</span>
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                isOnline ? 'bg-green-500 status-online' : 'bg-red-500 status-offline'
              }`}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-widest ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
            {isOnline ? 'Live' : 'Down'}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-primary/20 px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/40 border border-primary/30"
            onClick={(e) => e.stopPropagation()}
          >
            Launch <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
