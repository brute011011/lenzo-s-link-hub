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

const BUILTIN_TRACKS: Track[] = [
  { id: '1', title: 'Midnight Drift', artist: 'Lenzo Beats', genre: 'Lo-Fi', audio_url: '' },
  { id: '2', title: 'Neon Rain', artist: 'Lenzo Beats', genre: 'Ambient', audio_url: '' },
  { id: '3', title: 'Cyber Dreams', artist: 'Lenzo Beats', genre: 'Chillhop', audio_url: '' },
  { id: '4', title: 'Velvet Haze', artist: 'Lenzo Beats', genre: 'Lo-Fi', audio_url: '' },
  { id: '5', title: 'Starlight Express', artist: 'Lenzo Beats', genre: 'Synthwave', audio_url: '' },
  { id: '6', title: 'Ocean Static', artist: 'Lenzo Beats', genre: 'Ambient', audio_url: '' },
  { id: '7', title: 'Red Horizon', artist: 'Lenzo Beats', genre: 'Chillhop', audio_url: '' },
  { id: '8', title: 'Shadow Lane', artist: 'Lenzo Beats', genre: 'Lo-Fi', audio_url: '' },
  { id: '9', title: 'Crystal Rain', artist: 'Lenzo Beats', genre: 'Downtempo', audio_url: '' },
  { id: '10', title: 'Electric Dusk', artist: 'Lenzo Beats', genre: 'Synthwave', audio_url: '' },
  { id: '11', title: 'Vapor Trail', artist: 'Lenzo Beats', genre: 'Vaporwave', audio_url: '' },
  { id: '12', title: 'Moonlit Walk', artist: 'Lenzo Beats', genre: 'Lo-Fi', audio_url: '' },
  { id: '13', title: 'Deep Focus', artist: 'Lenzo Beats', genre: 'Ambient', audio_url: '' },
  { id: '14', title: 'Night Drive', artist: 'Lenzo Beats', genre: 'Chillwave', audio_url: '' },
  { id: '15', title: 'Pulse Code', artist: 'Lenzo Beats', genre: 'Electronic', audio_url: '' },
  { id: '16', title: 'Soft Static', artist: 'Lenzo Beats', genre: 'Lo-Fi', audio_url: '' },
];

// Musical note frequencies for pleasant melodies
const NOTES = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

export const MusicPlayer = ({ dbTracks }: { dbTracks?: Track[] }) => {
  const tracks = dbTracks && dbTracks.length > 0 ? dbTracks : BUILTIN_TRACKS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeNodesRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);

  const current = tracks[currentIndex] ?? tracks[0];

  const stopAllNotes = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    activeNodesRef.current.forEach(({ osc, gain }) => {
      try {
        gain.gain.exponentialRampToValueAtTime(0.0001, (audioCtxRef.current?.currentTime ?? 0) + 0.1);
        osc.stop((audioCtxRef.current?.currentTime ?? 0) + 0.15);
      } catch {
        // already stopped
      }
    });
    activeNodesRef.current = [];
  }, []);

  const playNote = useCallback((freq: number, duration: number) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
    const node = { osc, gain };
    activeNodesRef.current.push(node);
    osc.onended = () => {
      activeNodesRef.current = activeNodesRef.current.filter(n => n !== node);
    };
  }, []);

  const startMelody = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      // Play a sequence of notes based on track index for variety
      const seed = currentIndex * 3;
      let noteIdx = 0;
      // Play first note immediately
      const getFreq = () => NOTES[(seed + noteIdx) % NOTES.length] * (currentIndex % 2 === 0 ? 1 : 0.5);
      playNote(getFreq(), 1.2);
      noteIdx++;

      intervalRef.current = setInterval(() => {
        playNote(getFreq(), 1.2);
        noteIdx++;
        if (noteIdx > 100) noteIdx = 0;
      }, 800);
    } catch {
      // AudioContext not available
    }
  }, [currentIndex, playNote]);

  useEffect(() => {
    if (isPlaying) {
      startMelody();
    } else {
      stopAllNotes();
    }
    return () => stopAllNotes();
  }, [isPlaying, startMelody, stopAllNotes]);

  const next = () => {
    stopAllNotes();
    const nextIdx = shuffled
      ? Math.floor(Math.random() * tracks.length)
      : (currentIndex + 1) % tracks.length;
    setCurrentIndex(nextIdx);
  };

  const prev = () => {
    stopAllNotes();
    setCurrentIndex((p) => (p - 1 + tracks.length) % tracks.length);
  };

  if (!current) return null;

  return (
    <motion.div layout className="fixed bottom-4 right-4 z-40">
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.button
            key="mini"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setExpanded(true)}
            className="ios-liquid-glass h-14 w-14 flex items-center justify-center hover:scale-110 transition-transform"
            style={{ borderRadius: '999px' }}
          >
            <div className="surface-sheen" style={{ borderRadius: '999px' }} />
            <Music className="h-6 w-6 text-primary relative z-10" />
            {isPlaying && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </motion.button>
        ) : (
          <motion.div
            key="full"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="ios-liquid-glass w-80 p-5"
            style={{ borderRadius: '28px' }}
          >
            <div className="surface-sheen" style={{ borderRadius: '28px' }} />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Music className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{current.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{current.artist} • {current.genre}</p>
                </div>
              </div>
              <button onClick={() => setExpanded(false)} className="text-muted-foreground hover:text-foreground text-xs shrink-0 ml-2">
                ✕
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full rounded-full bg-muted/40 mb-3 overflow-hidden relative z-10">
              {isPlaying && (
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </div>

            <div className="flex items-center justify-center gap-3 relative z-10">
              <button
                onClick={() => setShuffled(!shuffled)}
                className={`p-1.5 rounded-full transition-colors ${shuffled ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
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
                className={`p-1.5 rounded-full transition-colors ${repeat ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Repeat className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground relative z-10">
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
