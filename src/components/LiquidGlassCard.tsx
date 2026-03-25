import { FC, useId, ReactNode, ElementType, HTMLAttributes } from 'react';

export const LiquidGlassCard: FC<Omit<HTMLAttributes<HTMLElement>, 'as'> & { children?: ReactNode; as?: ElementType }> = ({
  children,
  className = '',
  as: Component = 'div',
  style,
  ...rest
}) => {
  const filterId = useId();
  const cleanId = `refraction-${filterId.replace(/:/g, '')}`;

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
        <filter id={cleanId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="1" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <Component
        className={className}
        style={{
          position: 'relative',
          borderRadius: '38px',
          transform: 'translateZ(0)',
          willChange: 'filter, backdrop-filter',
          overflow: 'hidden',
          ...style,
        }}
        {...rest}
      >
        {/* Pure Glass Layer */}
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: 'rgba(255, 255, 255, 0.01)',
            backdropFilter: 'blur(30px) saturate(180%) brightness(1.02)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%) brightness(1.02)',
            filter: `url(#${cleanId})`,
          }}
        />
        {/* iOS Light Catchers (The Bezel) */}
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            border: '0.5px solid rgba(0, 0, 0, 0.05)',
            borderTop: '1.5px solid rgba(255, 255, 255, 0.9)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      </Component>
    </>
  );
};
