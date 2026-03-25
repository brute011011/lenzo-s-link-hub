import { FC, ReactNode, ElementType, HTMLAttributes, useId } from 'react';
import { RefractionEngine } from './glass/RefractionEngine';

export const LiquidGlassCard: FC<Omit<HTMLAttributes<HTMLElement>, 'as'> & { children?: ReactNode; as?: ElementType }> = ({
  children,
  className = '',
  as: Component = 'div',
  style,
  ...rest
}) => {
  const id = useId().replace(/:/g, '');
  return (
    <Component
      className={`relative overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      style={{ borderRadius: '48px', transform: 'translateZ(0)', ...style }}
      {...rest}
    >
      <RefractionEngine scale={28} />
      
      {/* Layer 1: The Refraction Engine */}
      <div className="absolute inset-0 z-0" 
        style={{
          background: 'rgba(255, 255, 255, 0.0001)',
          backdropFilter: 'blur(60px) saturate(210%) brightness(1.15)',
          WebkitBackdropFilter: 'blur(60px) saturate(210%) brightness(1.15)',
          filter: `url(#glass-filter-${id})`
        }} 
      />

      {/* Layer 2: The Physical Bezel (The White Edge) */}
      <div className="pointer-events-none absolute inset-0 z-10"
        style={{
          borderRadius: 'inherit',
          border: '0.5px solid rgba(0, 0, 0, 0.1)',
          borderTop: '3px solid rgba(255, 255, 255, 0.98)',
          borderLeft: '1.5px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.12), inset 0 1px 3px rgba(255, 255, 255, 0.5)',
        }}
      />
      
      <div className="relative z-20">{children}</div>
    </Component>
  );
};
