import { FC, useId } from 'react';

export const RefractionEngine: FC<{ scale?: number }> = ({ scale = 25 }) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
      <filter id={`glass-filter-${id}`} colorInterpolationFilters="sRGB">
        {/* The "Water" Warp: High frequency turbulence for liquid feel */}
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="10" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={scale} xChannelSelector="R" yChannelSelector="G" result="warped" />
        
        {/* Chromatic Aberration: The $1M RGB Split Edge */}
        <feColorMatrix in="warped" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
        <feColorMatrix in="warped" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
        <feColorMatrix in="warped" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
        <feOffset in="red" dx="1.8" dy="0" result="redOffset" />
        <feOffset in="blue" dx="-1.8" dy="0" result="blueOffset" />
        <feBlend in="redOffset" in2="green" mode="screen" result="rg" />
        <feBlend in="rg" in2="blueOffset" mode="screen" />
      </filter>
    </svg>
  );
};
