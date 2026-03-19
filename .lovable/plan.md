

# Lenzo Beam Central – Premium Discord Service Dashboard

## Design System
- **Theme**: Cyber-Noir with Blood Red (#990000) accents on Obsidian Black (#050505) background
- **Glass Water Effect**: All cards use backdrop-filter blur (30px+), semi-transparent surfaces with red-tinted glass, liquid ripple hover effects, inner glow, and floating shadows
- **Typography**: SF Pro Display Bold for headings, SF Pro Text for body (loaded from CDN/local fonts)
- **Motion**: Cursor-following ripple highlights on cards, smooth slide-in transitions for panels, subtle background noise/ripple texture to fill space

## Pages & Features

### 1. Public Landing Page (/)
- **Hero**: Large "Lenzo Beam Central" title in pure white SF Pro Display Bold
- **Service Cards** (4 advanced glass-water cards):
  - Immortal, Injures, Shockify, Bypasser Roblox
  - Each shows: name, link button, live status indicator (green dot = Live, red = Down), real-time latency in MS
  - Liquid ripple hover effect on each card
- **Announcements Banner**: Displays latest announcements posted by admin (slides in with animation)
- **Discord Join Section**: Glass-water card with real Discord logo, server invite link, "Join Our Server" CTA
- **Footer**: Created by — Discord @3r89, TikTok @qsi.uk, Instagram @qsi.uk2 with social icons
- **Music Player**: Floating dock/bar with built-in royalty-free chill tracks (lo-fi, ambient, various genres), shuffle, replay, play/pause, track info, and now-playing status
- **AI Chat**: Floating toggle that opens a slide-in chat panel — "Lenzo AI" powered by Lovable AI, answers questions about the services

### 2. Admin Login (/login)
- Secured email + password login using Supabase Auth
- Route protection — all /admin routes redirect to login if unauthenticated
- Clean glass-water styled login form

### 3. Admin Dashboard (/admin)
Full configuration panel with these sections:
- **Service Links Manager**: Edit names, URLs, and descriptions for all 4 services
- **Status & Latency**: Toggle auto-ping or manually set status (Online/Offline) and MS latency for each service
- **Announcements**: Create/edit/delete announcements that appear on the public page
- **Discord Config**: Change Discord server invite link and server icon
- **Site Settings**: Change website name, fonts
- **Account Security**: Change admin email and password
- **Music Manager**: View/manage the built-in track playlist

## Backend (Lovable Cloud / Supabase)
- **Database tables**: services (name, url, status, latency), announcements, site_settings, music_tracks
- **Auth**: Single admin account via Supabase Auth with RLS policies
- **Edge Function**: AI chat endpoint using Lovable AI gateway (Lenzo AI branding)
- **Route Protection**: Auth-guarded admin routes, public-facing landing page

## Key UX Details
- No empty spaces — noise textures, subtle animated backgrounds, dense card layouts
- All Discord logos use the real Discord SVG mark, themed in white/red (no default Discord blue)
- Fully responsive for mobile and desktop
- Status indicators auto-refresh periodically on the public page

