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
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="ios26-mesh-bg" />
      
      {/* Fixed Header Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center pointer-events-none">
        <div /> {/* Spacer */}
        <Link to="/login" className="pointer-events-auto">
          <LiquidGlassCard className="px-5 py-2.5 flex items-center gap-2 hover:scale-105 transition-transform" style={{ borderRadius: '100px' }}>
            <ShieldCheck className="h-4 w-4 text-[#007AFF]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1D1D1F]">Admin</span>
          </LiquidGlassCard>
        </Link>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 space-y-16">
        <header className="text-left space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-6xl md:text-8xl font-black text-[#1D1D1F] leading-[0.9]"
          >
            {settings.site_name || 'Lenzo Beam Central'}
          </motion.h1>
          <p className="text-[#86868B] text-lg font-medium max-w-md">
            The next generation of technical infrastructure.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
