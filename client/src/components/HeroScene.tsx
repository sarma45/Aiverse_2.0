import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedSphere = () => {
  const sphereRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (sphereRef.current) {
      sphereRef.current.rotation.x = time * 0.2;
      sphereRef.current.rotation.y = time * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={sphereRef} args={[1, 100, 100]} scale={1.5}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0}
        />
      </Sphere>
    </Float>
  );
};

const HeroScene = () => {
  return (
    <div style={{ width: '100%', height: '400px', cursor: 'pointer' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} color="#10b981" intensity={0.5} />
        <AnimatedSphere />
      </Canvas>
    </div>
  );
};

export default HeroScene;
