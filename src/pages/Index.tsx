import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ServiceCard } from '@/components/ServiceCard';

const Index = () => {
  const [services, setServices] = useState<any[]>([]);
  const [siteName, setSiteName] = useState('Lenzo Beam Central');

  useEffect(() => {
    const getData = async () => {
      const { data: s } = await supabase.from('services').select('*').order('display_order');
      const { data: st } = await supabase.from('site_settings').select('*').eq('key', 'site_name').single();
      if (s) setServices(s);
      if (st) setSiteName(st.value);
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen relative selection:bg-[#007AFF]/20">
      <div className="ios26-mesh-bg" />
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-24 space-y-16">
        <header className="text-center space-y-6 pt-10">
          <h1 className="text-6xl md:text-8xl font-black text-[#1D1D1F] tracking-tighter">
            {siteName}
          </h1>
          <p className="text-[#86868B] text-xl md:text-2xl font-medium max-w-2xl mx-auto tracking-tight">
            Premium infrastructure for the technical elite.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
