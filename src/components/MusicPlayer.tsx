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
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    activeNodesRef.current.forEach(({ osc, gain }) => {
      try {
        gain.gain.exponentialRampToValueAtTime(0.0001, (audioCtxRef.current?.currentTime ?? 0) + 0.1);
        osc.stop((audioCtxRef.current?.currentTime ?? 0) + 0.15);
      } catch {}
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
    osc.onended = () => { activeNodesRef.current = activeNodesRef.current.filter(n => n !== node); };
  }, []);

  const startMelody = useCallback(() => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
      const seed = currentIndex * 3;
      let noteIdx = 0;
      const getFreq = () => NOTES[(seed + noteIdx) % NOTES.length] * (currentIndex % 2 === 0 ? 1 : 0.5);
      playNote(getFreq(), 1.2);
      noteIdx++;
      intervalRef.current = setInterval(() => {
        playNote(getFreq(), 1.2);
        noteIdx++;
        if (noteIdx > 100) noteIdx = 0;
      }, 800);
    } catch {}
  }, [currentIndex, playNote]);

  useEffect(() => {
    if (isPlaying) startMelody(); else stopAllNotes();
    return () => stopAllNotes();
  }, [isPlaying, startMelody, stopAllNotes]);

  const next = () => { stopAllNotes(); setCurrentIndex(shuffled ? Math.floor(Math.random() * tracks.length) : (currentIndex + 1) % tracks.length); };
  const prev = () => { stopAllNotes(); setCurrentIndex((p) => (p - 1 + tracks.length) % tracks.length); };

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
            className="safari-clean-glass h-14 w-14 flex items-center justify-center hover:scale-110 transition-transform"
            style={{ borderRadius: '999px' }}
          >
            <div className="surface-sheen" style={{ borderRadius: '999px' }} />
            <Music className="h-6 w-6 relative z-10" style={{ color: '#007AFF' }} />
            {isPlaying && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </motion.button>
        ) : (
          <motion.div
            key="full"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="safari-clean-glass w-80 p-5"
            style={{ borderRadius: '28px' }}
          >
            <div className="surface-sheen" style={{ borderRadius: '28px' }} />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(0,122,255,0.1)' }}>
                  <Music className="h-5 w-5" style={{ color: '#007AFF' }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: '#1D1D1F' }}>{current.title}</p>
                  <p className="text-xs truncate" style={{ color: '#86868B' }}>{current.artist} • {current.genre}</p>
                </div>
              </div>
              <button onClick={() => setExpanded(false)} className="text-xs shrink-0 ml-2" style={{ color: '#86868B' }}>✕</button>
            </div>

            <div className="h-1 w-full rounded-full mb-3 overflow-hidden relative z-10" style={{ background: 'rgba(0,0,0,0.06)' }}>
              {isPlaying && (
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: '#007AFF' }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </div>

            <div className="flex items-center justify-center gap-3 relative z-10">
              <button onClick={() => setShuffled(!shuffled)} className="p-1.5 rounded-full transition-colors" style={{ color: shuffled ? '#007AFF' : '#86868B' }}>
                <Shuffle className="h-4 w-4" />
              </button>
              <button onClick={prev} className="p-1.5 transition-colors" style={{ color: '#86868B' }}>
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-10 w-10 rounded-full flex items-center justify-center text-white transition-colors"
                style={{ background: '#007AFF' }}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>
              <button onClick={next} className="p-1.5 transition-colors" style={{ color: '#86868B' }}>
                <SkipForward className="h-4 w-4" />
              </button>
              <button onClick={() => setRepeat(!repeat)} className="p-1.5 rounded-full transition-colors" style={{ color: repeat ? '#007AFF' : '#86868B' }}>
                <Repeat className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs relative z-10" style={{ color: '#86868B' }}>
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
