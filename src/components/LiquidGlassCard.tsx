import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex shader for the glass mesh
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  uniform float uTime;
  uniform vec2 uMouse;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec3 pos = position;
    
    // Subtle wave distortion
    float wave1 = sin(pos.x * 3.0 + uTime * 0.8) * 0.008;
    float wave2 = cos(pos.y * 2.5 + uTime * 0.6) * 0.006;
    float wave3 = sin((pos.x + pos.y) * 2.0 + uTime * 1.0) * 0.004;
    
    // Mouse influence
    float mouseDist = length(pos.xy - uMouse);
    float mouseInfluence = smoothstep(0.5, 0.0, mouseDist) * 0.015;
    
    pos.z += wave1 + wave2 + wave3 + mouseInfluence;
    
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment shader for iOS 26 liquid glass look
const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  
  // Mesh gradient colors (Apple-style)
  vec3 gradient1 = vec3(0.92, 0.93, 0.95);  // Light silver
  vec3 gradient2 = vec3(0.85, 0.88, 0.94);  // Soft blue
  vec3 gradient3 = vec3(0.90, 0.86, 0.92);  // Soft lavender
  vec3 gradient4 = vec3(0.88, 0.92, 0.90);  // Soft mint
  
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Animated refraction distortion
    float t = uTime * 0.3;
    vec2 distortion = vec2(
      smoothNoise(uv * 3.0 + t) * 0.03,
      smoothNoise(uv * 3.0 + t + 100.0) * 0.03
    );
    
    vec2 refractedUv = uv + distortion;
    
    // Mesh gradient (4-point blend like Apple's)
    vec3 topLeft = gradient1;
    vec3 topRight = gradient2;
    vec3 bottomLeft = gradient4;
    vec3 bottomRight = gradient3;
    
    vec3 top = mix(topLeft, topRight, refractedUv.x);
    vec3 bottom = mix(bottomLeft, bottomRight, refractedUv.x);
    vec3 meshGradient = mix(bottom, top, refractedUv.y);
    
    // Add flowing caustic-like patterns
    float caustic1 = smoothNoise(refractedUv * 5.0 + t * 0.5);
    float caustic2 = smoothNoise(refractedUv * 8.0 - t * 0.3);
    float caustics = (caustic1 * caustic2) * 0.15;
    
    meshGradient += caustics;
    
    // Fresnel-like edge glow (subtle)
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
    meshGradient += fresnel * 0.08;
    
    // Specular highlight
    vec3 lightDir = normalize(vec3(0.3, 0.5, 1.0));
    float spec = pow(max(dot(reflect(-lightDir, vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 32.0);
    meshGradient += spec * 0.12;
    
    // Top edge light (like the Safari glass border-top)
    float topEdge = smoothstep(0.95, 1.0, uv.y) * 0.3;
    meshGradient += topEdge;
    
    // Overall transparency for glass feel
    float alpha = 0.55 + fresnel * 0.15 + caustics * 0.2;
    
    gl_FragColor = vec4(meshGradient, alpha);
  }
`;

interface GlassMeshProps {
  width: number;
  height: number;
}

const GlassMesh = ({ width, height }: GlassMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(width, height) },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), [width, height]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    
    // Smooth mouse follow
    material.uniforms.uMouse.value.lerp(mouseRef.current, 0.05);
  });

  const handlePointerMove = useCallback((e: any) => {
    mouseRef.current.set(
      (e.point.x / viewport.width) * 2,
      (e.point.y / viewport.height) * 2
    );
  }, [viewport]);

  // Aspect ratio for the plane
  const aspect = width / height;
  const planeHeight = 2;
  const planeWidth = planeHeight * aspect;

  return (
    <mesh
      ref={meshRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => mouseRef.current.set(0, 0)}
    >
      <planeGeometry args={[planeWidth, planeHeight, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const LiquidGlassCard = ({ children, className = '' }: LiquidGlassCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius: '14px' }}
    >
      {/* Three.js glass layer */}
      <div className="absolute inset-0 z-0" style={{ borderRadius: '14px', overflow: 'hidden' }}>
        <Canvas
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}
          camera={{ position: [0, 0, 1.5], fov: 50 }}
          style={{ background: 'transparent' }}
          dpr={Math.min(window.devicePixelRatio, 2)}
        >
          <GlassMesh width={dimensions.width} height={dimensions.height} />
        </Canvas>
      </div>

      {/* Frosted glass fallback overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(2px)',
          borderRadius: '14px',
        }}
      />

      {/* Top edge light */}
      <div
        className="absolute top-0 left-0 right-0 z-[2]"
        style={{
          height: '1.5px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '14px 14px 0 0',
        }}
      />

      {/* Subtle border */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          borderRadius: '14px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
