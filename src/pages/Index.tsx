import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { ServiceCard } from '@/components/ServiceCard';
import { DiscordSection } from '@/components/DiscordSection';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { MusicPlayer } from '@/components/MusicPlayer';
import { LenzoAI } from '@/components/LenzoAI';
import { Footer } from '@/components/Footer';
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

    // Auto-refresh status every 30s
    const interval = setInterval(async () => {
      const { data } = await supabase.from('services').select('*').order('display_order');
      if (data) setServices(data);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const siteName = settings.site_name || 'Lenzo Beam Central';
  const discordInvite = settings.discord_invite || 'https://discord.gg/your-server';

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background orbs */}
      <div className="bg-orb w-96 h-96 bg-primary/5 top-20 -left-48" />
      <div className="bg-orb w-[30rem] h-[30rem] bg-primary/3 bottom-40 -right-60" style={{ animationDelay: '5s' }} />
      <div className="bg-orb w-64 h-64 bg-primary/4 top-1/2 left-1/3" style={{ animationDelay: '10s' }} />

      {/* Noise overlay */}
      <div className="noise-overlay" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <h1 className="text-4xl sm:text-6xl font-bold text-foreground font-sf tracking-tight">
            {siteName}
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Premium Discord Service Dashboard — Your gateway to elite tools and services.
          </p>
        </motion.div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <AnnouncementBanner announcements={announcements} />
        )}

        {/* Service Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
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

        {/* Discord Section */}
        <DiscordSection inviteLink={discordInvite} />

        {/* Footer */}
        <Footer />
      </div>

      {/* Floating components */}
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
