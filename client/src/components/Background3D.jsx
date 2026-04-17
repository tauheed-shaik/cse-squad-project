import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

function MemorySpheres({ count = 20 }) {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      p.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        ],
        size: Math.random() * 0.1 + 0.05,
        speed: Math.random() * 0.5 + 0.2,
      });
    }
    return p;
  }, [count]);

  return (
    <>
      {points.map((p, i) => (
        <Float key={i} speed={p.speed} rotationIntensity={2} floatIntensity={2}>
          <mesh position={p.position}>
            <sphereGeometry args={[p.size, 16, 16]} />
            <meshStandardMaterial 
              color="#FF6A00" 
              emissive="#FF6A00" 
              emissiveIntensity={0.5} 
              transparent 
              opacity={0.3} 
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

const Background3D = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#FF6A00" />
        <MemorySpheres />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

export default Background3D;
