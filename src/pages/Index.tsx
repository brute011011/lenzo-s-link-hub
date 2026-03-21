import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { ServiceCard } from '@/components/ServiceCard';
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
    <div className="min-h-screen relative overflow-hidden dark" style={{
      background: 'linear-gradient(135deg, #0a0a2e 0%, #1a0533 25%, #0d1b3e 50%, #1c0a3a 75%, #050520 100%)'
    }}>
      {/* Vibrant mesh gradient orbs for liquid glass refraction */}
      <div className="bg-orb w-[700px] h-[700px] top-[-15%] left-[-15%]" style={{ background: 'radial-gradient(circle, hsla(211, 100%, 55%, 0.3), transparent 70%)' }} />
      <div className="bg-orb w-[600px] h-[600px] top-[20%] right-[-15%]" style={{ background: 'radial-gradient(circle, hsla(280, 90%, 50%, 0.25), transparent 70%)', animationDelay: '5s' }} />
      <div className="bg-orb w-[500px] h-[500px] bottom-[-10%] left-[15%]" style={{ background: 'radial-gradient(circle, hsla(190, 100%, 50%, 0.2), transparent 70%)', animationDelay: '10s' }} />
      <div className="bg-orb w-[400px] h-[400px] top-[60%] left-[50%]" style={{ background: 'radial-gradient(circle, hsla(330, 90%, 50%, 0.15), transparent 70%)', animationDelay: '15s' }} />
      <div className="noise-overlay" />

      {/* Admin link */}
      <div className="fixed top-4 right-4 z-50">
        <Link
          to="/login"
          className="ios-liquid-glass flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-foreground hover:scale-105 transition-transform"
          style={{ borderRadius: '999px' }}
        >
          <div className="surface-sheen" style={{ borderRadius: '999px' }} />
          <Shield className="h-4 w-4 text-primary relative z-10" />
          <span className="relative z-10">Admin</span>
        </Link>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 space-y-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center gap-2 pill-btn bg-primary/10 border border-primary/20 px-5 py-2 text-xs font-medium text-primary mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Service Dashboard
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-foreground tracking-tight text-glow">
            {siteName}
          </h1>
          <p className="mt-5 text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
            Premium Discord services — your gateway to elite tools and automation.
          </p>
        </motion.div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <AnnouncementBanner announcements={announcements} />
        )}

        {/* Service Cards Grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest px-1">Services</h2>
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
            <div className="ios-liquid-glass p-12 text-center">
              <div className="surface-sheen" />
              <p className="text-muted-foreground text-sm relative z-10">No services configured yet. Add them from the admin panel.</p>
            </div>
          )}
        </div>

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
