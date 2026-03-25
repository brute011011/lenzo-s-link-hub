import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { ServiceCard } from '@/components/ServiceCard';
import { LiquidGlassCard } from '@/components/LiquidGlassCard';
import { DiscordSection } from '@/components/DiscordSection';
import { MusicPlayer } from '@/components/MusicPlayer';
import { LenzoAI } from '@/components/LenzoAI';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Index = () => {
  const [services, setServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [musicTracks, setMusicTracks] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [sRes, stRes, mRes] = await Promise.all([
        supabase.from('services').select('*').order('display_order'),
        supabase.from('site_settings').select('*'),
        supabase.from('music_tracks').select('*').eq('is_active', true).order('display_order'),
      ]);
      if (sRes.data) setServices(sRes.data);
      if (stRes.data) {
        const map: Record<string, string> = {};
        stRes.data.forEach(s => { map[s.key] = s.value; });
        setSettings(map);
      }
      if (mRes.data) setMusicTracks(mRes.data);
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen relative selection:bg-[#007AFF]/20 overflow-x-hidden">
      <div className="ios26-mesh-bg" />
      
      {/* Dedicated Global Top Bar */}
      <div className="w-full max-w-6xl mx-auto px-8 pt-8 flex justify-end">
        <Link to="/login">
          <LiquidGlassCard className="px-6 py-3 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all" style={{ borderRadius: '100px' }}>
            <ShieldCheck className="h-4 w-4 text-[#007AFF]" />
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#1D1D1F]">Admin</span>
          </LiquidGlassCard>
        </Link>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-8 py-16 space-y-24">
        <header className="space-y-6">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-7xl md:text-9xl font-black text-[#1D1D1F] tracking-tighter leading-[0.85]">
            {settings.site_name || 'Lenzo Beam Central'}
          </motion.h1>
          <p className="text-[#86868B] text-xl md:text-2xl font-medium tracking-tight max-w-xl">
            Technical infrastructure for high-performance automation.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {services.map((s) => (
            <ServiceCard key={s.id} {...s} />
          ))}
        </div>

        <DiscordSection inviteLink={settings.discord_invite || '#'} />
        <Footer />
      </main>

      <MusicPlayer dbTracks={musicTracks} />
      <LenzoAI />
    </div>
  );
};

export default Index;
