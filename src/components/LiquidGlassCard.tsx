import { FC, ReactNode, ElementType, HTMLAttributes, useId } from 'react';
import { GlassEngine } from './glass/GlassEngine';

export const LiquidGlassCard: FC<Omit<HTMLAttributes<HTMLElement>, 'as'> & { children?: ReactNode; as?: ElementType }> = ({
  children,
  className = '',
  as: Component = 'div',
  style,
  ...rest
}) => {
  const filterId = useId();
  const engineId = `refraction-engine-${filterId.replace(/:/g, '')}`;

  return (
    <Component
      className={`relative overflow-hidden transition-all duration-700 ${className}`}
      style={{ borderRadius: '44px', transform: 'translateZ(0)', ...style }}
      {...rest}
    >
      <GlassEngine scale={22} />
      <div className="absolute inset-0 z-0"
        style={{
          background: 'rgba(255, 255, 255, 0.001)',
          backdropFilter: 'blur(50px) saturate(220%) brightness(1.1)',
          WebkitBackdropFilter: 'blur(50px) saturate(220%) brightness(1.1)',
          filter: `url(#${engineId})`
        }}
      />
      {/* Specular Edge Bezel */}
      <div className="pointer-events-none absolute inset-0 z-10"
        style={{
          borderRadius: 'inherit',
          border: '0.5px solid rgba(0, 0, 0, 0.08)',
          borderTop: '2.5px solid rgba(255, 255, 255, 0.95)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 12px 40px -8px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
        }}
      />
      <div className="relative z-20">{children}</div>
    </Component>
  );
};
