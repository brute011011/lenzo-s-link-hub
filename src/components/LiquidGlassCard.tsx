import { FC, useId, ReactNode, ElementType, HTMLAttributes } from 'react';

export const LiquidGlassCard: FC<Omit<HTMLAttributes<HTMLElement>, 'as'> & { children?: ReactNode; as?: ElementType }> = ({
  children,
  className = '',
  as: Component = 'div',
  style,
  ...rest
}) => {
  const filterId = useId();
  const cleanId = `ios26-ref-${filterId.replace(/:/g, '')}`;

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
        <filter id={cleanId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="1" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <Component
        className={className}
        style={{
          position: 'relative',
          borderRadius: '44px',
          transform: 'translateZ(0)',
          willChange: 'filter, backdrop-filter',
          overflow: 'hidden',
          ...style,
        }}
        {...rest}
      >
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            borderRadius: 'inherit',
            background: 'rgba(255, 255, 255, 0.003)',
            backdropFilter: 'blur(40px) saturate(210%) brightness(1.05)',
            WebkitBackdropFilter: 'blur(40px) saturate(210%) brightness(1.05)',
            filter: `url(#${cleanId})`,
          }}
        />
        <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
            borderRadius: 'inherit',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderTop: '2.5px solid rgba(255, 255, 255, 0.8)',
            borderLeft: '1.5px solid rgba(255, 255, 255, 0.5)',
            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      </Component>
    </>
  );
};
