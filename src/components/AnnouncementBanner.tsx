import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useState } from 'react';

interface Announcement {
  id: string;
  title: string;
  content: string;
}

export const AnnouncementBanner = ({ announcements }: { announcements: Announcement[] }) => {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = announcements.filter(a => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {visible.map((a) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="ios-26-liquid border-primary/30 p-4"
          >
            <div className="liquid-sheen" />
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground text-sm">{a.title}</h4>
                <p className="text-muted-foreground text-sm mt-1">{a.content}</p>
              </div>
              <button
                onClick={() => setDismissed(prev => new Set(prev).add(a.id))}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
