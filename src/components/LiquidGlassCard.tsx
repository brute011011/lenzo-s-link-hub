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
        <filter id={cleanId} colorInterpolationFilters="sRGB">
          {/* The Liquid Warp */}
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="1" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" xChannelSelector="R" yChannelSelector="G" result="warped" />
          
          {/* Chromatic Aberration (The Rainbow Edge Logic) */}
          <feColorMatrix in="warped" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
          <feColorMatrix in="warped" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
          <feColorMatrix in="warped" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
          <feOffset in="red" dx="1.5" dy="0" result="redOffset" />
          <feOffset in="blue" dx="-1.5" dy="0" result="blueOffset" />
          <feBlend in="redOffset" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blueOffset" mode="screen" />
        </filter>
      </svg>

      <Component
        className={className}
        style={{
          position: 'relative',
          borderRadius: '44px',
          transform: 'translateZ(0)',
          overflow: 'hidden',
          ...style,
        }}
        {...rest}
      >
        {/* Deep iOS Refraction Layer */}
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: 'rgba(255, 255, 255, 0.001)', 
            backdropFilter: 'blur(50px) saturate(220%) brightness(1.08)',
            WebkitBackdropFilter: 'blur(50px) saturate(220%) brightness(1.08)',
            filter: `url(#${cleanId})`,
          }}
        />
        
        {/* Specular Bezel (The 3D Edge) */}
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            border: '0.5px solid rgba(0, 0, 0, 0.08)',
            borderTop: '2.5px solid rgba(255, 255, 255, 0.95)',
            borderLeft: '1.2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 12px 40px -8px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      </Component>
    </>
  );
};
