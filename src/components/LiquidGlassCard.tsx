import { FC, useId, useState, ReactNode, CSSProperties, ElementType, HTMLAttributes } from 'react';

// Browser detection for Safari/iOS fallback
const IOS_REGEX = /iPad|iPhone|iPod/;
const SAFARI_REGEX = /^((?!chrome|android).)*safari/i;

const hasLimitedFilterSupport = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  return IOS_REGEX.test(ua) || SAFARI_REGEX.test(ua);
};

interface LiquidGlassCardProps extends Omit<HTMLAttributes<HTMLElement>, 'as'> {
  children?: ReactNode;
  className?: string;
  backdropBlur?: number;
  tintColor?: string;
  displacementScale?: number;
  turbulenceBaseFrequency?: string;
  turbulenceSeed?: number;
  as?: ElementType;
  style?: CSSProperties;
}

export const LiquidGlassCard: FC<LiquidGlassCardProps> = ({
  children,
  className = '',
  backdropBlur = 40,
  tintColor = 'rgba(255, 255, 255, 0.05)',
  displacementScale = 150,
  turbulenceBaseFrequency = '0.008 0.008',
  turbulenceSeed = 1.5,
  as: Component = 'div',
  style,
  ...rest
}) => {
  const filterId = useId();
  const cleanFilterId = `liquid-glass-${filterId.replace(/:/g, '-')}`;
  const [useSimplifiedFilter] = useState(() => hasLimitedFilterSupport());

  return (
    <>
      <svg style={{ display: 'none' }} suppressHydrationWarning>
        {useSimplifiedFilter ? (
          <filter
            id={cleanFilterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency={turbulenceBaseFrequency}
              numOctaves={2}
              seed={turbulenceSeed}
              result="turbulence"
            />
            <feGaussianBlur in="turbulence" stdDeviation="2" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 0.15 0"
              result="transparency"
            />
            <feBlend in="SourceGraphic" in2="transparency" mode="normal" />
          </filter>
        ) : (
          <filter
            id={cleanFilterId}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency={turbulenceBaseFrequency}
              numOctaves={1}
              seed={turbulenceSeed}
              result="turbulence"
            />
            <feComponentTransfer in="turbulence" result="mapped">
              <feFuncR type="gamma" amplitude={1} exponent={10} offset={0.5} />
              <feFuncG type="gamma" amplitude={0} exponent={1} offset={0} />
              <feFuncB type="gamma" amplitude={0} exponent={1} offset={0.5} />
            </feComponentTransfer>
            <feGaussianBlur in="turbulence" stdDeviation={3} result="softMap" />
            <feSpecularLighting
              in="softMap"
              surfaceScale={5}
              specularConstant={1}
              specularExponent={100}
              lightingColor="white"
              result="specLight"
            >
              <fePointLight x={-200} y={-200} z={300} />
            </feSpecularLighting>
            <feComposite
              in="specLight"
              operator="arithmetic"
              k1={0}
              k2={1}
              k3={1}
              k4={0}
              result="litImage"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softMap"
              scale={displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        )}
      </svg>

      <Component
        className={className}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '22px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          borderTop: '1.5px solid rgba(255, 255, 255, 0.4)',
          borderLeft: '1.5px solid rgba(255, 255, 255, 0.4)',
          boxShadow:
            'inset 0 1px 1px rgba(255, 255, 255, 0.3), 0 8px 24px rgba(0, 0, 0, 0.06)',
          ...style,
        }}
        {...rest}
      >
        {/* SVG filter refraction layer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
            backdropFilter: `blur(${backdropBlur}px) saturate(210%)`,
            WebkitBackdropFilter: `blur(${backdropBlur}px) saturate(210%)`,
            filter: `url(#${cleanFilterId})`,
            isolation: 'isolate',
            borderRadius: '22px',
            ...(useSimplifiedFilter && {
              transform: 'translateZ(0)',
              willChange: 'transform',
            }),
          }}
        />

        {/* Tint overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: tintColor,
            borderRadius: '22px',
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      </Component>
    </>
  );
};
