// Inside Index.tsx, update your h1 class:
<motion.h1 
  initial={{ opacity: 0, y: 10 }} 
  animate={{ opacity: 1, y: 0 }} 
  className="text-7xl md:text-9xl font-black text-[#1D1D1F] tracking-[-0.06em] leading-[0.85]"
>
  {settings.site_name || 'Lenzo Beam Central'}
</motion.h1>
