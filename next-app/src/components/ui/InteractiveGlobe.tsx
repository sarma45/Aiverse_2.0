'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

const globeVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * vec4(normal, 0.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const globeFragmentShader = `
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  float intensity = 1.05 - dot(vNormal, vec3(0.0, 0.0, 1.0));
  vec3 atmosphere = vec3(0.3, 0.4, 0.9) * pow(intensity, 1.5);
  
  // Base dark globe
  vec3 baseColor = vec3(0.0, 0.0, 0.05);
  
  // Add wireframe-like lines (simplified procedural grid)
  float grid = sin(vUv.x * 200.0) * sin(vUv.y * 100.0);
  grid = smoothstep(0.9, 1.0, grid) * 0.2;
  
  vec3 finalColor = baseColor + atmosphere + (vec3(0.4, 0.5, 1.0) * grid);
  
  gl_FragColor = vec4(finalColor, 0.9);
}
`;

const GlobeContent = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  
  const [pointsData, setPointsData] = useState<{positions: Float32Array, colors: Float32Array} | null>(null);

  useEffect(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const r = 1.01 + Math.random() * 0.05; // Slightly above surface
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const color = new THREE.Color();
      // Mix between indigo and purple
      color.lerpColors(new THREE.Color('#818cf8'), new THREE.Color('#c084fc'), Math.random());
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    // eslint-disable-next-line
    setPointsData({ positions, colors });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) meshRef.current.rotation.y = time * 0.05;
    if (pointsRef.current) pointsRef.current.rotation.y = time * 0.05;
  });

  return (
    <group>
      {/* Custom Shader Globe */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={globeVertexShader}
          fragmentShader={globeFragmentShader}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer Glow / Atmosphere */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={globeVertexShader}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
              gl_FragColor = vec4(0.3, 0.4, 0.9, 1.0) * intensity;
            }
          `}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
        />
      </mesh>

      {/* AI Hotspots */}
      {pointsData && (
        <points ref={pointsRef}>
          <bufferGeometry>
            {/* @ts-expect-error -- known type mismatch in R3F/Lenis */}
        {/* @ts-expect-error -- known type mismatch in R3F/Lenis */}
        <bufferAttribute attach="attributes-position" count={pointsData.positions.length / 3} array={pointsData.positions} itemSize={3} />
            {/* @ts-expect-error -- known type mismatch in R3F/Lenis */}
        {/* @ts-expect-error -- known type mismatch in R3F/Lenis */}
        <bufferAttribute attach="attributes-color" count={pointsData.colors.length / 3} array={pointsData.colors} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.015} vertexColors transparent blending={THREE.AdditiveBlending} sizeAttenuation />
        </points>
      )}
    </group>
  );
};

export default function InteractiveGlobe() {
  return (
    <div className="w-full h-full min-h-[400px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <GlobeContent />
        </Float>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </div>
  );
}
