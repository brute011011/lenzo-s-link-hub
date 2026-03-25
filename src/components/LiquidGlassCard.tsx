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
      {/* 1. The Water Refraction */}
      <div className="glass-water-surface" style={{ borderRadius: 'inherit' }} />
      
      {/* 2. The Specular Highlight (The Apple Rim) */}
      <div className="pointer-events-none absolute inset-0 z-10"
        style={{
          borderRadius: 'inherit',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          borderTop: '2.5px solid rgba(255, 255, 255, 0.9)', // Bright top edge
          borderLeft: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 12px 40px -8px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
        }}
      />
      
      <div className="relative z-20">{children}</div>
    </Component>
  );
};
