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
              in="SourceGraphic"
              in2="softNoise"
              scale={15} 
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <Component
        className={className}
        style={{
          position: 'relative',
          borderRadius: '44px',
          /* Hardware Acceleration */
          transform: 'translateZ(0)',
          willChange: 'filter, backdrop-filter',
          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          ...style,
        }}
        {...rest}
      >
        {/* The Liquid Backdrop - Reduced opacity to 0.005 to kill 'milkiness' */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            borderRadius: 'inherit',
            background: 'rgba(255, 255, 255, 0.005)',
            backdropFilter: 'blur(40px) saturate(210%) brightness(1.1)',
            WebkitBackdropFilter: 'blur(40px) saturate(210%) brightness(1.1)',
            filter: `url(#${cleanId})`,
            /* Prevents the 'box' from clipping weirdly */
            margin: '-2px',
          }}
        />

        {/* 3D Glass Edge/Lip */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
            borderRadius: 'inherit',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderTop: '2.5px solid rgba(255, 255, 255, 0.8)',
            borderLeft: '1.5px solid rgba(255, 255, 255, 0.6)',
            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3)',
          }}
        />

        {/* Sharp Content Layer */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </Component>
    </>
  );
};
              numOctaves={3}
              seed={2}
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="1.5" result="softNoise" />

            {/* Physical warp */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale={20}
              xChannelSelector="R"
              yChannelSelector="G"
              result="warped"
            />

            {/* Chromatic Aberration — RGB split */}
            <feOffset in="warped" dx={-1.2} dy={0} result="redShift" />
            <feColorMatrix in="redShift" type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />

            <feColorMatrix in="warped" type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />

            <feOffset in="warped" dx={1.2} dy={0} result="blueShift" />
            <feColorMatrix in="blueShift" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />

            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="chromatic" />

            {/* Specular highlight */}
            <feSpecularLighting in="softNoise" surfaceScale={3} specularConstant={0.8}
              specularExponent={80} lightingColor="white" result="specLight">
              <fePointLight x={-150} y={-150} z={250} />
            </feSpecularLighting>
            <feComposite in="specLight" in2="SourceGraphic" operator="in" result="clippedSpec" />
            <feBlend in="chromatic" in2="clippedSpec" mode="screen" />
          </filter>
        </defs>
      </svg>

      <Component
        className={className}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '44px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderTop: '2.5px solid rgba(255, 255, 255, 0.7)',
          borderLeft: '2.5px solid rgba(255, 255, 255, 0.6)',
          boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.4), 0 30px 60px rgba(0,0,0,0.2)',
          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          ...style,
        }}
        {...rest}
      >
        {/* Refraction backdrop layer — blur + SVG filter */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            borderRadius: 'inherit',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(50px) saturate(210%) brightness(1.1)',
            WebkitBackdropFilter: 'blur(50px) saturate(210%) brightness(1.1)',
            filter: `url(#${cleanId})`,
            isolation: 'isolate',
          }}
        />

        {/* Sheen highlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%)',
            pointerEvents: 'none',
            zIndex: 1,
            borderRadius: 'inherit',
          }}
        />

        {/* Content — sharp, above the warp */}
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      </Component>
    </>
  );
};
