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
          resolution: 2.0,
          refraction: 0.01,
          bevelDepth: 0.052,
          bevelWidth: 0.211,
          frost: 2,
          shadow: true,
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

    // Wait for content to render + scripts to load
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

  return (
    <div
      className="liquidGL"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        maxWidth: '1100px',
        height: '80vh',
        borderRadius: '28px',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    />
  );
};
