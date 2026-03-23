import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    liquidGL: any;
  }
}

interface LiquidGLOptions {
  target?: string;
  snapshot?: string;
  resolution?: number;
  refraction?: number;
  bevelDepth?: number;
  bevelWidth?: number;
  frost?: number;
  shadow?: boolean;
  specular?: boolean;
  reveal?: string;
  tilt?: boolean;
  tiltFactor?: number;
  magnify?: number;
}

export const useLiquidGL = (options: LiquidGLOptions = {}) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const init = () => {
      if (typeof window.liquidGL !== 'function') return false;
      if (typeof window.html2canvas !== 'function') return false;

      const targets = document.querySelectorAll(options.target || '.liquidGL');
      if (targets.length === 0) return false;

      try {
        window.liquidGL({
          snapshot: options.snapshot || 'body',
          target: options.target || '.liquidGL',
          resolution: options.resolution ?? 2.0,
          refraction: options.refraction ?? 0.01,
          bevelDepth: options.bevelDepth ?? 0.052,
          bevelWidth: options.bevelWidth ?? 0.211,
          frost: options.frost ?? 2,
          shadow: options.shadow ?? true,
          specular: options.specular ?? true,
          reveal: options.reveal || 'fade',
          tilt: options.tilt ?? false,
          tiltFactor: options.tiltFactor ?? 5,
          magnify: options.magnify ?? 1,
          on: {
            init(instance: any) {
              console.log('liquidGL ready!', instance);
            },
          },
        });
        initialized.current = true;
        return true;
      } catch (e) {
        console.warn('liquidGL init error:', e);
        return false;
      }
    };

    // Poll for scripts to load since they're deferred
    let attempts = 0;
    const interval = setInterval(() => {
      if (init() || attempts++ > 50) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [options.target]);
};
