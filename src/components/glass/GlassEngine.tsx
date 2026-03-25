import { FC, useId } from 'react';

export const GlassEngine: FC<{ scale?: number }> = ({ scale = 20 }) => {
  const filterId = useId();
  const cleanId = `refraction-engine-${filterId.replace(/:/g, '')}`;

  return (
    <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
      <filter id={cleanId} colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="1" seed="5" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={scale} xChannelSelector="R" yChannelSelector="G" result="warped" />
        
        {/* RGB Split Logic */}
        <feColorMatrix in="warped" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
        <feColorMatrix in="warped" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
        <feColorMatrix in="warped" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
        <feOffset in="red" dx="1.2" dy="0" result="redOffset" />
        <feOffset in="blue" dx="-1.2" dy="0" result="blueOffset" />
        <feBlend in="redOffset" in2="green" mode="screen" result="rg" />
        <feBlend in="rg" in2="blueOffset" mode="screen" />
      </filter>
    </svg>
  );
};
