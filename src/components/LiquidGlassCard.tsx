import { FC, ReactNode, ElementType, HTMLAttributes } from 'react';

export const LiquidGlassCard: FC<Omit<HTMLAttributes<HTMLElement>, 'as'> & { children?: ReactNode; as?: ElementType }> = ({
  children,
  className = '',
  as: Component = 'div',
  style,
  ...rest
}) => {
  return (
    <Component
      className={`relative transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      style={{ borderRadius: '44px', transform: 'translateZ(0)', ...style }}
      {...rest}
    >
      {/* Layer 1: The Deep Blur (Vercel Style) */}
      <div className="absolute inset-0 z-0"
        style={{
          background: 'rgba(255, 255, 255, 0.001)', 
          backdropFilter: 'blur(50px) saturate(220%) brightness(1.1)',
          WebkitBackdropFilter: 'blur(50px) saturate(220%) brightness(1.1)',
          borderRadius: 'inherit',
        }}
      />
      
      {/* Layer 2: The Liquid Grain */}
      <div className="glass-water-texture z-10" style={{ borderRadius: 'inherit' }} />
      
      {/* Layer 3: The 3D Bezel (Linear.app Style) */}
      <div className="pointer-events-none absolute inset-0 z-20"
        style={{
          borderRadius: 'inherit',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          borderTop: '3px solid rgba(255, 255, 255, 0.95)', // The ultra-bright highlight
          borderLeft: '1.5px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
        }}
      />
      
      <div className="relative z-30">{children}</div>
    </Component>
  );
};
