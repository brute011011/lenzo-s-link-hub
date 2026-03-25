import { FC, useId, ReactNode, CSSProperties, ElementType, HTMLAttributes } from 'react';

interface LiquidGlassCardProps extends Omit<HTMLAttributes<HTMLElement>, 'as'> {
  children?: ReactNode;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
}

export const LiquidGlassCard: FC<LiquidGlassCardProps> = ({
  children,
  className = '',
  as: Component = 'div',
  style,
  ...rest
}) => {
  const filterId = useId();
  const cleanId = `ios26-refraction-${filterId.replace(/:/g, '-')}`;

  return (
    <>
      {/* SVG Refraction + Chromatic Aberration Engine */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter
            id={cleanId}
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            filterUnits="objectBoundingBox"
            colorInterpolationFilters="sRGB"
          >
            {/* Turbulence for organic distortion */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves={3}
              seed={2}
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="1.5" result="softNoise" />

            {/* Primary displacement — physical warp */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale={20}
              xChannelSelector="R"
              yChannelSelector="G"
              result="warped"
            />

            {/* Chromatic Aberration: RGB channel split */}
            {/* Red channel — shift left */}
            <feOffset in="warped" dx={-1.2} dy={0} result="redShift" />
            <feColorMatrix
              in="redShift"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />

            {/* Green channel — center */}
            <feColorMatrix
              in="warped"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />

            {/* Blue channel — shift right */}
            <feOffset in="warped" dx={1.2} dy={0} result="blueShift" />
            <feColorMatrix
              in="blueShift"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />

            {/* Recombine RGB */}
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="chromatic" />

            {/* Specular highlight from the noise */}
            <feSpecularLighting
              in="softNoise"
              surfaceScale={3}
              specularConstant={0.8}
              specularExponent={80}
              lightingColor="white"
              result="specLight"
            >
              <fePointLight x={-150} y={-150} z={250} />
            </feSpecularLighting>
            <feComposite
              in="specLight"
              in2="SourceGraphic"
              operator="in"
              result="clippedSpec"
            />

            {/* Blend specular onto chromatic result */}
            <feBlend in="chromatic" in2="clippedSpec" mode="screen" />
          </filter>
        </defs>
      </svg>

      <Component
        className={`ios26-liquid-surface ${className}`}
        style={style}
        {...rest}
      >
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
        {/* Content — stays sharp above the warp */}
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      </Component>
    </>
  );
};
