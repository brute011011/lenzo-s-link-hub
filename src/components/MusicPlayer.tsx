import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string | null;
  audio_url: string;
}

// Built-in royalty-free tracks (placeholder URLs — will use Web Audio API generated tones)
const BUILTIN_TRACKS: Track[] = [
  { id: '1', title: 'Midnight Drift', artist: 'Lenzo Beats', genre: 'Lo-Fi', audio_url: '' },
  { id: '2', title: 'Neon Rain', artist: 'Lenzo Beats', genre: 'Ambient', audio_url: '' },
  { id: '3', title: 'Cyber Dreams', artist: 'Lenzo Beats', genre: 'Chillhop', audio_url: '' },
  { id: '4', title: 'Velvet Haze', artist: 'Lenzo Beats', genre: 'Lo-Fi', audio_url: '' },
  { id: '5', title: 'Starlight Express', artist: 'Lenzo Beats', genre: 'Synthwave', audio_url: '' },
  { id: '6', title: 'Ocean Static', artist: 'Lenzo Beats', genre: 'Ambient', audio_url: '' },
  { id: '7', title: 'Red Horizon', artist: 'Lenzo Beats', genre: 'Chillhop', audio_url: '' },
  { id: '8', title: 'Shadow Lane', artist: 'Lenzo Beats', genre: 'Lo-Fi', audio_url: '' },
];

export const MusicPlayer = ({ dbTracks }: { dbTracks?: Track[] }) => {
  const tracks = dbTracks && dbTracks.length > 0 ? dbTracks : BUILTIN_TRACKS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const current = tracks[currentIndex];

  // Simple tone generator for demo (no real audio files)
  const startTone = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch {}
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    // Different frequency per track for variety
    osc.frequency.value = 220 + currentIndex * 40;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    oscRef.current = osc;
    gainRef.current = gain;
  }, [currentIndex]);

  const stopTone = useCallback(() => {
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch {}
      oscRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startTone();
    } else {
      stopTone();
    }
    return () => stopTone();
  }, [isPlaying, startTone, stopTone]);

  const next = () => {
    if (shuffled) {
      setCurrentIndex(Math.floor(Math.random() * tracks.length));
    } else {
      setCurrentIndex((prev) => (prev + 1) % tracks.length);
    }
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  return (
    <motion.div
      layout
      className="fixed bottom-4 right-4 z-40"
    >
      <AnimatePresence>
        {!expanded ? (
          <motion.button
            key="mini"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setExpanded(true)}
            className="glass-water h-14 w-14 flex items-center justify-center rounded-2xl hover:scale-110 transition-transform"
          >
            <Music className="h-6 w-6 text-primary" />
          </motion.button>
        ) : (
          <motion.div
            key="full"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass-water w-80 p-4 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Music className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{current.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{current.artist} • {current.genre}</p>
                </div>
              </div>
              <button onClick={() => setExpanded(false)} className="text-muted-foreground hover:text-foreground text-xs">
                ✕
              </button>
            </div>

            {/* Progress bar placeholder */}
            <div className="h-1 w-full rounded-full bg-muted mb-3 overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={isPlaying ? { width: ['0%', '100%'] } : {}}
                transition={isPlaying ? { duration: 30, repeat: Infinity } : {}}
                style={{ width: isPlaying ? undefined : '0%' }}
              />
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShuffled(!shuffled)}
                className={`p-1.5 rounded-lg transition-colors ${shuffled ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Shuffle className="h-4 w-4" />
              </button>
              <button onClick={prev} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/80 transition-colors"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>
              <button onClick={next} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <SkipForward className="h-4 w-4" />
              </button>
              <button
                onClick={() => setRepeat(!repeat)}
                className={`p-1.5 rounded-lg transition-colors ${repeat ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Repeat className="h-4 w-4" />
              </button>
            </div>

            {/* Track status */}
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Volume2 className="h-3 w-3" />
                {isPlaying ? 'Now Playing' : 'Paused'}
              </span>
              <span>{currentIndex + 1}/{tracks.length} tracks</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
