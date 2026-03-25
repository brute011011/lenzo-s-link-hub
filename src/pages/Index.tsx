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
import { Shield } from 'lucide-react';

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
    <div className="min-h-screen relative selection:bg-[#007AFF]/20">
      <div className="ios26-mesh-bg" />
      <div className="fixed top-8 right-8 z-50">
        <Link to="/login">
          <LiquidGlassCard className="px-6 py-3 flex items-center gap-2 hover:scale-105" style={{ borderRadius: '999px' }}>
            <Shield className="h-4 w-4 text-[#007AFF]" />
            <span className="text-sm font-bold text-[#1D1D1F]">Admin Console</span>
          </LiquidGlassCard>
        </Link>
      </div>
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-24 space-y-20">
        <header className="text-center space-y-6 pt-12">
          <motion.h1 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-7xl md:text-9xl font-black text-[#1D1D1F] tracking-tighter">
            {settings.site_name || 'Lenzo Beam'}
          </motion.h1>
          <p className="text-[#86868B] text-xl md:text-2xl font-medium tracking-tight max-w-2xl mx-auto">Premium infrastructure for technical automation.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {services.map((s) => (
            <ServiceCard key={s.id} name={s.name} url={s.url} description={s.description} status={s.status} latencyMs={s.latencyMs} />
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
