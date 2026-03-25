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
import type { Tables } from '@/integrations/supabase/types';

const Index = () => {
  const [services, setServices] = useState<Tables<'services'>[]>([]);
  const [announcements, setAnnouncements] = useState<Tables<'announcements'>[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [musicTracks, setMusicTracks] = useState<Tables<'music_tracks'>[]>([]);

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

    const interval = setInterval(async () => {
      const { data } = await supabase.from('services').select('*').order('display_order');
      if (data) setServices(data);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const siteName = settings.site_name || 'Lenzo Beam Central';
  const discordInvite = settings.discord_invite || 'https://discord.gg/your-server';

  return (
    <div className="min-h-screen relative ios26-mesh-bg">
      {/* Admin link */}
      <div className="fixed top-4 right-4 z-50">
        <LiquidGlassCard as={Link} to="/login"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold hover:scale-105 transition-transform"
          style={{ borderRadius: '999px', color: '#1D1D1F' }}
        >
          <Shield className="h-4 w-4" style={{ color: '#007AFF' }} />
          <span>Admin</span>
        </LiquidGlassCard>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 space-y-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center gap-2 pill-btn px-5 py-2 text-xs font-medium mb-6" style={{ background: 'rgba(0,122,255,0.08)', color: '#007AFF', border: '1px solid rgba(0,122,255,0.15)' }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#007AFF' }} />
            Service Dashboard
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight" style={{ color: '#1D1D1F' }}>
            {siteName}
          </h1>
          <p className="mt-5 text-lg max-w-lg mx-auto leading-relaxed" style={{ color: '#86868B' }}>
            Premium Discord services — your gateway to elite tools and automation.
          </p>
        </motion.div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <AnnouncementBanner announcements={announcements} />
        )}

        {/* Service Cards Grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest px-1" style={{ color: '#86868B' }}>Services</h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <ServiceCard
                  name={service.name}
                  url={service.url}
                  description={service.description || ''}
                  status={service.status}
                  latencyMs={service.latency_ms || 0}
                />
              </motion.div>
            ))}
          </motion.div>
          {services.length === 0 && (
            <div className="ios26-liquid-surface p-12 text-center">
              <p className="text-sm relative z-10" style={{ color: '#86868B' }}>No services configured yet. Add them from the admin panel.</p>
            </div>
          )}
        </div>

        {/* Discord Section */}
        <DiscordSection inviteLink={discordInvite} />

        {/* Footer */}
        <Footer />
      </div>

      {/* Floating components */}
      {/* Liquid glass is now built into each card */}
      <MusicPlayer dbTracks={musicTracks.length > 0 ? musicTracks.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        genre: t.genre,
        audio_url: t.audio_url,
      })) : undefined} />
      <LenzoAI />
    </div>
  );
};

export default Index;
