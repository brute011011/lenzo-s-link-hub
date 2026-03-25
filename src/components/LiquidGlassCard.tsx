import { FC, ReactNode, ElementType, HTMLAttributes, useId } from 'react';

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
      style={{ 
        borderRadius: '38px', 
        transform: 'translateZ(0)',
        ...style 
      }}
      {...rest}
    >
      {/* The Actual Glass Layer */}
      <div className="absolute inset-0 z-0"
        style={{
          background: 'rgba(255, 255, 255, 0.01)', // Almost zero white
          backdropFilter: 'blur(40px) saturate(180%) brightness(1.05)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%) brightness(1.05)',
          borderRadius: 'inherit',
        }}
      />
      
      {/* The Specular Rim Light (Top Edge) */}
      <div className="pointer-events-none absolute inset-0 z-10"
        style={{
          borderRadius: 'inherit',
          border: '0.5px solid rgba(0, 0, 0, 0.05)',
          borderTop: '2px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
        }}
      />
      
      <div className="relative z-20">{children}</div>
    </Component>
  );
};
