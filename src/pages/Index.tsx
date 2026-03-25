import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { ServiceCard } from '@/components/ServiceCard';
import { LiquidGlassCard } from '@/components/LiquidGlassCard';
import { DiscordSection } from '@/components/DiscordSection';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { MusicPlayer } from '@/components/MusicPlayer';
import { LenzoAI } from '@/components/LenzoAI';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Index = () => {
  const [services, setServices] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [musicTracks, setMusicTracks] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [sRes, aRes, stRes, mRes] = await Promise.all([
        supabase.from('services').select('*').order('display_order'),
        supabase.from('announcements').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*'),
        supabase.from('music_tracks').select('*').eq('is_active', true).order('display_order'),
      ]);
      if (sRes.data) setServices(sRes.data);
      if (aRes.data) setAnnouncements(aRes.data);
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
      {/* iOS Background Layer */}
      <div className="ios26-mesh-bg" />

      {/* Admin Button - iOS Style */}
      <div className="fixed top-6 right-6 z-50">
        <Link to="/login">
          <LiquidGlassCard className="px-5 py-2.5 flex items-center gap-2 hover:scale-105 transition-transform">
            <Shield className="h-4 w-4 text-[#007AFF]" />
            <span className="text-sm font-bold text-[#1D1D1F]">Admin</span>
          </LiquidGlassCard>
        </Link>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-24 space-y-16">
        <header className="text-center space-y-6 pt-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-[#1D1D1F] tracking-tighter"
          >
            {settings.site_name || 'Lenzo Beam Central'}
          </motion.h1>
          <p className="text-[#86868B] text-xl md:text-2xl font-medium max-w-2xl mx-auto tracking-tight">
            Premium infrastructure for the technical elite.
          </p>
        </header>

        {announcements.length > 0 && (
          <AnnouncementBanner announcements={announcements} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>

        <DiscordSection inviteLink={settings.discord_invite || '#'} />
        <Footer />
      </main>

      {/* Floating UI Components */}
      <MusicPlayer dbTracks={musicTracks} />
      <LenzoAI />
    </div>
  );
};

export default Index;
