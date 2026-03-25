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

  useEffect(() => {
    const fetchAll = async () => {
      const [sRes, aRes, stRes] = await Promise.all([
        supabase.from('services').select('*').order('display_order'),
        supabase.from('announcements').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*'),
      ]);
      if (sRes.data) setServices(sRes.data);
      if (aRes.data) setAnnouncements(aRes.data);
      if (stRes.data) {
        const map: Record<string, string> = {};
        stRes.data.forEach(s => { map[s.key] = s.value; });
        setSettings(map);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="ios26-mesh-bg" />
      <div className="fixed top-4 right-4 z-50">
        <Link to="/login">
          <LiquidGlassCard className="px-5 py-2.5 text-sm font-semibold flex items-center gap-2" style={{ borderRadius: '999px', background: 'rgba(255,255,255,0.1)' }}>
            <Shield className="h-4 w-4 text-[#007AFF]" />
            <span>Admin</span>
          </LiquidGlassCard>
        </Link>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 space-y-12">
        <header className="text-center py-10">
          <h1 className="text-6xl font-black tracking-tighter text-[#1D1D1F]">
            {settings.site_name || 'Lenzo Beam Central'}
          </h1>
          <p className="text-[#86868B] text-lg max-w-md mx-auto mt-4">
            Elite Discord tools and premium automation services.
          </p>
        </header>
        {announcements.length > 0 && <AnnouncementBanner announcements={announcements} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
        <DiscordSection inviteLink={settings.discord_invite || '#'} />
        <Footer />
      </div>
      <MusicPlayer />
      <LenzoAI />
    </div>
  );
};

export default Index;
