import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    liquidGL: any;
    html2canvas: any;
  }
}

export const LiquidGlassOverlay = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const init = () => {
      if (typeof window.liquidGL !== 'function') return false;
      if (typeof window.html2canvas !== 'function') return false;

      const targets = document.querySelectorAll('.liquidGL');
      if (targets.length === 0) return false;

      try {
        window.liquidGL({
          snapshot: '.main-content',
          target: '.liquidGL',
          resolution: 1.5,
          refraction: 0.008,
          bevelDepth: 0.04,
          bevelWidth: 0.15,
          frost: 2.5,
          shadow: false,
          specular: true,
          reveal: 'fade',
          tilt: false,
          magnify: 1,
        });
        initialized.current = true;
        return true;
      } catch (e) {
        console.warn('liquidGL init error:', e);
        return false;
      }
    };

    const timeout = setTimeout(() => {
      let attempts = 0;
      const interval = setInterval(() => {
        if (init() || attempts++ > 30) {
          clearInterval(interval);
        }
      }, 300);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  // No standalone overlay — liquidGL targets individual .liquidGL elements
  return null;
};
