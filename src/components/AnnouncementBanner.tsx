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
            className="liquidGL safari-clean-glass-sm p-4"
          >
            <div className="surface-sheen" />
            <div className="flex items-start gap-3 relative z-10">
              <Bell className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#007AFF' }} />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm" style={{ color: '#1D1D1F' }}>{a.title}</h4>
                <p className="text-sm mt-1" style={{ color: '#86868B' }}>{a.content}</p>
              </div>
              <button
                onClick={() => setDismissed(prev => new Set(prev).add(a.id))}
                className="shrink-0 transition-colors"
                style={{ color: '#86868B' }}
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
