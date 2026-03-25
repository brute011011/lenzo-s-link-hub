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
      className={`relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${className}`}
      style={{ borderRadius: '44px', transform: 'translateZ(0)', ...style }}
      {...rest}
    >
      {/* 1. The Real Water Layer */}
      <div className="glass-refraction absolute inset-0 z-0" style={{ borderRadius: 'inherit' }} />
      
      {/* 2. The High-End Chrome Edge (Apple Style) */}
      <div className="pointer-events-none absolute inset-0 z-10"
        style={{
          borderRadius: 'inherit',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          borderTop: '2.5px solid rgba(255, 255, 255, 0.95)', // The specular highlight
          borderLeft: '1.2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
        }}
      />
      
      <div className="relative z-20 h-full">{children}</div>
    </Component>
  );
};
