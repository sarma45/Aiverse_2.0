'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

const vertexShader = `
uniform float uTime;
attribute float size;
varying vec3 vColor;

void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  
  // Add some fluid motion
  mvPosition.y += sin(uTime * 2.0 + position.x) * 0.1;
  mvPosition.x += cos(uTime * 1.5 + position.y) * 0.1;

  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying vec3 vColor;

void main() {
  // Create a soft glowing circle
  float distance = length(gl_PointCoord - vec2(0.5));
  if (distance > 0.5) discard;
  
  float intensity = 1.0 - (distance * 2.0);
  intensity = pow(intensity, 1.5);
  
  gl_FragColor = vec4(vColor, intensity * 0.8);
}
`;

const ShaderParticles = () => {
  const count = 3000;
  const mesh = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const [particlesData, setParticlesData] = useState<{positions: Float32Array, colors: Float32Array, sizes: Float32Array} | null>(null);

  useEffect(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const colorA = new THREE.Color('#6366f1'); // Indigo
    const colorB = new THREE.Color('#a855f7'); // Purple

    for (let i = 0; i < count; i++) {
      // Sphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 4 + Math.random() * 2;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Interpolate colors
      const mixedColor = colorA.clone().lerp(colorB, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 0.05 + 0.01;
    }
    // eslint-disable-next-line
    setParticlesData({ positions, colors, sizes });
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  useFrame((state) => {
    const { mouse, clock } = state;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
    
    if (mesh.current) {
      // Smooth parallax
      mesh.current.rotation.y += (mouse.x * 0.2 - mesh.current.rotation.y) * 0.05;
      mesh.current.rotation.x += (-mouse.y * 0.2 - mesh.current.rotation.x) * 0.05;
      mesh.current.rotation.z = clock.getElapsedTime() * 0.05;
    }
  });

  if (!particlesData) return null;

  return (
    <points ref={mesh}>
      <bufferGeometry>
        {/* @ts-expect-error -- known type mismatch in R3F/Lenis */}
        {/* @ts-expect-error -- known type mismatch in R3F/Lenis */}
        <bufferAttribute attach="attributes-position" count={count} array={particlesData.positions} itemSize={3} />
        {/* @ts-expect-error -- known type mismatch in R3F/Lenis */}
        {/* @ts-expect-error -- known type mismatch in R3F/Lenis */}
        <bufferAttribute attach="attributes-color" count={count} array={particlesData.colors} itemSize={3} />
        {/* @ts-expect-error -- known type mismatch in R3F/Lenis */}
        {/* @ts-expect-error -- known type mismatch in R3F/Lenis */}
        <bufferAttribute attach="attributes-size" count={count} array={particlesData.sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
};

export default function NeuralBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ShaderParticles />
      </Canvas>
    </div>
  );
}
