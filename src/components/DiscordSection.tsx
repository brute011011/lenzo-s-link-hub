import { motion } from 'framer-motion';

const DiscordLogo = () => (
  <svg width="28" height="22" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60.1 4.9A58.5 58.5 0 0 0 45.4.2a.2.2 0 0 0-.2.1 41 41 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0A37 37 0 0 0 25.4.3a.2.2 0 0 0-.2-.1A58.4 58.4 0 0 0 10.5 5a.2.2 0 0 0-.1 0C1.5 17.6-.9 29.8.3 41.9v.1a58.7 58.7 0 0 0 17.7 9 .2.2 0 0 0 .3-.1 42 42 0 0 0 3.6-5.9.2.2 0 0 0-.1-.3 38.6 38.6 0 0 1-5.5-2.6.2.2 0 0 1 0-.4l1.1-.9a.2.2 0 0 1 .2 0 41.9 41.9 0 0 0 35.6 0 .2.2 0 0 1 .2 0l1.1.9a.2.2 0 0 1 0 .3 36.2 36.2 0 0 1-5.5 2.7.2.2 0 0 0-.1.3 47.2 47.2 0 0 0 3.6 5.8.2.2 0 0 0 .2.1A58.5 58.5 0 0 0 70.3 42v-.1c1.4-14.5-2.4-27.1-10.1-38.2a.2.2 0 0 0-.1 0ZM23.7 34.4c-3.3 0-6-3-6-6.7s2.7-6.7 6-6.7 6.1 3 6 6.7c0 3.7-2.6 6.7-6 6.7Zm22.2 0c-3.3 0-6-3-6-6.7s2.6-6.7 6-6.7 6 3 6 6.7c0 3.7-2.6 6.7-6 6.7Z" fill="currentColor"/>
  </svg>
);

interface DiscordSectionProps {
  inviteLink: string;
}

export const DiscordSection = ({ inviteLink }: DiscordSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass-water p-8 text-center"
    >
      <div className="flex items-center justify-center mb-4">
        <div className="h-14 w-14 rounded-2xl bg-[hsl(235,86%,65%)]/15 flex items-center justify-center text-[hsl(235,86%,65%)]">
          <DiscordLogo />
        </div>
      </div>
      <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">Join Our Community</h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
        Connect with other users, get support, and stay updated with the latest news.
      </p>
      <a
        href={inviteLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 rounded-lg bg-[hsl(235,86%,65%)] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[hsl(235,86%,58%)] active:scale-[0.98]"
      >
        <DiscordLogo />
        Join Discord Server
      </a>
    </motion.div>
  );
};
