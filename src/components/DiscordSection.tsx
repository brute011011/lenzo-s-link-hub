import { motion } from 'framer-motion';

const DiscordLogo = () => (
  <svg width="28" height="22" viewBox="0 0 127.14 96.36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
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
      transition={{ delay: 0.6 }}
      className="glass-water p-8 text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-foreground">
          <DiscordLogo />
        </div>
        <h2 className="text-2xl font-bold text-foreground font-sf">Join Our Community</h2>
        <p className="text-muted-foreground max-w-md">
          Connect with the Lenzo Beam community. Get updates, support, and exclusive access.
        </p>
        <a
          href={inviteLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground transition-all hover:bg-primary/80 hover:scale-105"
        >
          <DiscordLogo />
          Join Discord Server
        </a>
      </div>
    </motion.div>
  );
};
