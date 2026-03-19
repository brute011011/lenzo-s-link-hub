
-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline')),
  latency_ms INTEGER DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_settings table
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create music_tracks table
CREATE TABLE public.music_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL DEFAULT 'Unknown',
  genre TEXT DEFAULT 'Lo-Fi',
  audio_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Anyone can view announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Anyone can view site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can view music_tracks" ON public.music_tracks FOR SELECT USING (true);

-- Admin write access (authenticated users)
CREATE POLICY "Auth users can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update services" ON public.services FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete services" ON public.services FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can insert announcements" ON public.announcements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update announcements" ON public.announcements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete announcements" ON public.announcements FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can insert site_settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update site_settings" ON public.site_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete site_settings" ON public.site_settings FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can insert music_tracks" ON public.music_tracks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update music_tracks" ON public.music_tracks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete music_tracks" ON public.music_tracks FOR DELETE TO authenticated USING (true);

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed services
INSERT INTO public.services (name, url, description, status, latency_ms, display_order) VALUES
  ('Immortal', 'https://immortal.rs/?code=ODgyNDUyMDE0NDc4MDI0NTAzMA==', 'Premium security service', 'online', 12, 1),
  ('Injures', 'https://www.logged.tg/auth/lebc', 'Advanced logging service', 'online', 24, 2),
  ('Shockify', 'https://shockify.st/?code=ODgyNDUyMDE0NDc4MDI0NTAzMA==', 'High-performance booster', 'online', 18, 3),
  ('Bypasser Roblox', 'https://rbxbypasser.com/d/LEB', 'Roblox bypass tool', 'online', 31, 4);

-- Seed site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', 'Lenzo Beam Central'),
  ('discord_invite', 'https://discord.gg/your-server'),
  ('discord_icon', '');
