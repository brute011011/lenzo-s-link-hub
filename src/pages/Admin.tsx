import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Settings, Link2, Bell, Shield, Music, Globe, LogOut,
  Save, Plus, Trash2, Edit2, Check, X, Home
} from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Tab = 'services' | 'announcements' | 'discord' | 'site' | 'security' | 'music';

const Admin = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('services');
  const [services, setServices] = useState<Tables<'services'>[]>([]);
  const [announcements, setAnnouncements] = useState<Tables<'announcements'>[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [musicTracks, setMusicTracks] = useState<Tables<'music_tracks'>[]>([]);

  // Edit states
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ name: '', url: '', description: '', status: 'online', latency_ms: '0' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [sRes, aRes, stRes, mRes] = await Promise.all([
      supabase.from('services').select('*').order('display_order'),
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
      supabase.from('site_settings').select('*'),
      supabase.from('music_tracks').select('*').order('display_order'),
    ]);
    if (sRes.data) setServices(sRes.data);
    if (aRes.data) setAnnouncements(aRes.data);
    if (stRes.data) {
      const map: Record<string, string> = {};
      stRes.data.forEach(s => { map[s.key] = s.value; });
      setSettings(map);
      setSettingsForm(map);
    }
    if (mRes.data) setMusicTracks(mRes.data);
  };

  const addService = async () => {
    if (!newService.name || !newService.url) {
      toast({ title: 'Error', description: 'Name and URL are required.', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('services').insert({
      name: newService.name,
      url: newService.url,
      description: newService.description,
      status: newService.status,
      latency_ms: parseInt(newService.latency_ms || '0'),
      display_order: services.length + 1,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Added', description: 'New service created.' });
      setNewService({ name: '', url: '', description: '', status: 'online', latency_ms: '0' });
      setShowAddService(false);
      fetchAll();
    }
  };

  const deleteService = async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Service removed.' });
      fetchAll();
    }
  };

  const saveService = async (id: string) => {
    const { error } = await supabase.from('services').update({
      name: editForm.name,
      url: editForm.url,
      description: editForm.description,
      status: editForm.status as 'online' | 'offline',
      latency_ms: parseInt(editForm.latency_ms || '0'),
    }).eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Saved', description: 'Service updated successfully.' });
      setEditingService(null);
      fetchAll();
    }
  };

  const createAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    const { error } = await supabase.from('announcements').insert(newAnnouncement);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Created', description: 'Announcement published.' });
      setNewAnnouncement({ title: '', content: '' });
      fetchAll();
    }
  };

  const deleteAnnouncement = async (id: string) => {
    await supabase.from('announcements').delete().eq('id', id);
    toast({ title: 'Deleted', description: 'Announcement removed.' });
    fetchAll();
  };

  const saveSiteSettings = async () => {
    for (const [key, value] of Object.entries(settingsForm)) {
      if (settings[key] !== value) {
        await supabase.from('site_settings').update({ value }).eq('key', key);
      }
    }
    toast({ title: 'Saved', description: 'Site settings updated.' });
    fetchAll();
  };

  const changePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters.', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Updated', description: 'Password changed successfully.' });
      setNewPassword('');
    }
  };

  const changeEmail = async () => {
    if (!newEmail) return;
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Updated', description: 'Confirmation email sent to new address.' });
      setNewEmail('');
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'services', label: 'Services', icon: <Link2 className="h-4 w-4" /> },
    { id: 'announcements', label: 'Announce', icon: <Bell className="h-4 w-4" /> },
    { id: 'discord', label: 'Discord', icon: <Globe className="h-4 w-4" /> },
    { id: 'site', label: 'Site', icon: <Settings className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'music', label: 'Music', icon: <Music className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-sf">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm text-foreground hover:bg-muted/80 transition-colors">
              <Home className="h-4 w-4" /> View Site
            </button>
            <button onClick={signOut} className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm text-foreground hover:bg-muted/80 transition-colors">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass-water p-6">
          {/* Services Tab */}
          {tab === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Service Links Manager</h2>
                <button
                  onClick={() => setShowAddService(!showAddService)}
                  className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Add Service
                </button>
              </div>

              {/* Add Service Form */}
              {showAddService && (
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-3">
                  <h3 className="text-sm font-bold text-foreground">New Service</h3>
                  <input value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground" placeholder="Service Name" />
                  <input value={newService.url} onChange={e => setNewService({ ...newService, url: e.target.value })} className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground" placeholder="https://..." />
                  <input value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground" placeholder="Description" />
                  <div className="flex gap-3">
                    <select value={newService.status} onChange={e => setNewService({ ...newService, status: e.target.value })} className="rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground">
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                    <input type="number" value={newService.latency_ms} onChange={e => setNewService({ ...newService, latency_ms: e.target.value })} className="w-24 rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground" placeholder="MS" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addService} className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Check className="h-4 w-4" /> Create</button>
                    <button onClick={() => setShowAddService(false)} className="flex items-center gap-1 rounded-lg bg-muted px-4 py-2 text-sm text-foreground"><X className="h-4 w-4" /> Cancel</button>
                  </div>
                </div>
              )}

              {services.map(s => (
                <div key={s.id} className="rounded-lg bg-muted/50 p-4 border border-border">
                  {editingService === s.id ? (
                    <div className="space-y-3">
                      <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground" placeholder="Name" />
                      <input value={editForm.url} onChange={e => setEditForm({ ...editForm, url: e.target.value })} className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground" placeholder="URL" />
                      <input value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground" placeholder="Description" />
                      <div className="flex gap-3">
                        <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground">
                          <option value="online">Online</option>
                          <option value="offline">Offline</option>
                        </select>
                        <input type="number" value={editForm.latency_ms} onChange={e => setEditForm({ ...editForm, latency_ms: e.target.value })} className="w-24 rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground" placeholder="MS" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => saveService(s.id)} className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground"><Check className="h-3.5 w-3.5" /> Save</button>
                        <button onClick={() => setEditingService(null)} className="flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-sm text-foreground"><X className="h-3.5 w-3.5" /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{s.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{s.status}</span>
                          <span className="text-xs text-muted-foreground">{s.latency_ms}ms</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 truncate max-w-md">{s.url}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingService(s.id);
                            setEditForm({
                              name: s.name,
                              url: s.url,
                              description: s.description || '',
                              status: s.status,
                              latency_ms: String(s.latency_ms || 0),
                            });
                          }}
                          className="flex items-center gap-1 rounded-lg bg-primary/20 px-3 py-1.5 text-sm text-foreground hover:bg-primary/30"
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => deleteService(s.id)}
                          className="flex items-center gap-1 rounded-lg bg-destructive/20 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {services.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No services yet. Click "Add Service" to create one.</p>
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {tab === 'announcements' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Announcements</h2>
              <div className="rounded-lg bg-muted/50 p-4 border border-border space-y-3">
                <input value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground" placeholder="Title" />
                <textarea value={newAnnouncement.content} onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground min-h-[80px]" placeholder="Content" />
                <button onClick={createAnnouncement} className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4" /> Publish</button>
              </div>
              {announcements.map(a => (
                <div key={a.id} className="flex items-start justify-between rounded-lg bg-muted/50 p-4 border border-border">
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{a.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
                    <span className="text-xs text-muted-foreground mt-2 block">{new Date(a.created_at).toLocaleString()}</span>
                  </div>
                  <button onClick={() => deleteAnnouncement(a.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          )}

          {/* Discord Tab */}
          {tab === 'discord' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Discord Configuration</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Server Invite Link</label>
                  <input value={settingsForm.discord_invite || ''} onChange={e => setSettingsForm({ ...settingsForm, discord_invite: e.target.value })} className="w-full rounded-lg bg-muted border border-border px-3 py-2 text-sm text-foreground" placeholder="https://discord.gg/..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Server Icon URL</label>
                  <input value={settingsForm.discord_icon || ''} onChange={e => setSettingsForm({ ...settingsForm, discord_icon: e.target.value })} className="w-full rounded-lg bg-muted border border-border px-3 py-2 text-sm text-foreground" placeholder="https://..." />
                </div>
                <button onClick={saveSiteSettings} className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Save className="h-4 w-4" /> Save</button>
              </div>
            </div>
          )}

          {/* Site Settings Tab */}
          {tab === 'site' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Site Settings</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Website Name</label>
                  <input value={settingsForm.site_name || ''} onChange={e => setSettingsForm({ ...settingsForm, site_name: e.target.value })} className="w-full rounded-lg bg-muted border border-border px-3 py-2 text-sm text-foreground" />
                </div>
                <button onClick={saveSiteSettings} className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Save className="h-4 w-4" /> Save</button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {tab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-foreground">Account Security</h2>
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">Change Email</h3>
                <input value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full rounded-lg bg-muted border border-border px-3 py-2 text-sm text-foreground" placeholder="new-email@example.com" type="email" />
                <button onClick={changeEmail} className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Save className="h-4 w-4" /> Update Email</button>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">Change Password</h3>
                <input value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full rounded-lg bg-muted border border-border px-3 py-2 text-sm text-foreground" placeholder="New password (min 6 chars)" type="password" />
                <button onClick={changePassword} className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Shield className="h-4 w-4" /> Update Password</button>
              </div>
            </div>
          )}

          {/* Music Tab */}
          {tab === 'music' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Music Tracks</h2>
              <p className="text-sm text-muted-foreground">Built-in tracks are pre-loaded. Database tracks will override built-in ones when added.</p>
              {musicTracks.length > 0 ? musicTracks.map(t => (
                <div key={t.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3 border border-border">
                  <div>
                    <span className="font-medium text-foreground text-sm">{t.title}</span>
                    <span className="text-muted-foreground text-sm ml-2">— {t.artist}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{t.genre}</span>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">Using 8 built-in demo tracks. Add tracks via the database to customize.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
