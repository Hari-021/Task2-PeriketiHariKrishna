import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// A floating credit card that tilts in response to cursor position
function FloatingCard() {
  const cardRef = useRef();
  
  useFrame((state) => {
    if (!cardRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Tilt calculations matching pointer coords
    const targetX = state.pointer.x * 0.5;
    const targetY = state.pointer.y * 0.5;
    
    // Smooth lerping to position
    cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, -targetY, 0.1);
    cardRef.current.rotation.y = THREE.MathUtils.lerp(cardRef.current.rotation.y, targetX + Math.sin(time * 0.3) * 0.15, 0.1);
    cardRef.current.rotation.z = THREE.MathUtils.lerp(cardRef.current.rotation.z, Math.cos(time * 0.2) * 0.05, 0.1);
  });

  return (
    <mesh ref={cardRef} castShadow receiveShadow>
      {/* Main card body */}
      <boxGeometry args={[4.2, 2.6, 0.12]} />
      <meshPhysicalMaterial 
        color="#090d16" 
        metalness={0.9} 
        roughness={0.15} 
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        transmission={0.4}
        thickness={0.5}
        ior={1.6}
      />
      
      {/* Card design gradient plate */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[3.9, 2.3, 0.01]} />
        <meshStandardMaterial 
          color="#1e1b4b" 
          metalness={0.7}
          roughness={0.3}
          emissive="#312e81"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Holographic credit card chip */}
      <mesh position={[-1.3, 0.45, 0.085]}>
        <boxGeometry args={[0.6, 0.45, 0.01]} />
        <meshStandardMaterial 
          color="#eab308" 
          metalness={0.9} 
          roughness={0.1} 
          emissive="#ca8a04"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Card Brand */}
      <Text
        position={[1.2, 0.7, 0.09]}
        fontSize={0.25}
        color="#22d3ee"
        fontWeight="bold"
      >
        CYBERPAY
      </Text>
      
      {/* Card Number */}
      <Text 
        position={[-0.2, -0.3, 0.09]} 
        fontSize={0.22} 
        color="#94a3b8" 
        letterSpacing={0.12}
      >
        ••••  ••••  ••••  8892
      </Text>
      
      {/* Card Holder */}
      <Text 
        position={[-1.1, -0.8, 0.09]} 
        fontSize={0.12} 
        color="#64748b" 
        anchorX="left"
      >
        FINTECH EXPERT
      </Text>
    </mesh>
  );
}

// Orbiting subscription meshes with labels
function OrbitingIcon({ serviceName, color, radius, speed, offset }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * speed + offset;
    meshRef.current.position.x = Math.sin(time) * radius;
    meshRef.current.position.z = Math.cos(time) * radius;
    meshRef.current.position.y = Math.sin(time * 1.5) * 0.7;
    
    // Face the viewer
    meshRef.current.rotation.y = time + Math.PI / 2;
  });

  return (
    <group ref={meshRef}>
      {/* Glowing neon ring */}
      <mesh>
        <torusGeometry args={[0.42, 0.03, 8, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={1.2} 
        />
      </mesh>
      
      {/* Small center sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Billboards */}
      <Text
        fontSize={0.16}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0.08]}
        fontWeight="bold"
      >
        {serviceName}
      </Text>
    </group>
  );
}

function GridBackground() {
  const gridRef = useRef();

  useFrame((state) => {
    if (!gridRef.current) return;
    gridRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
  });

  return (
    <group ref={gridRef} position={[0, -2.5, 0]}>
      {/* Large glowing floor grid */}
      <gridHelper args={[30, 30, '#1e293b', '#0f172a']} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export default function HeroCanvas() {
  return (
    <div className="w-full h-[450px] md:h-[600px] relative select-none">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#020617']} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[4, 5, 3]} 
          intensity={1.0} 
          castShadow 
          shadow-mapSize={[512, 512]}
        />
        <pointLight position={[-4, 4, -4]} color="#d946ef" intensity={1.5} />
        <pointLight position={[4, -4, 4]} color="#06b6d4" intensity={2.0} />
        
        {/* Particles */}
        <Stars 
          radius={80} 
          depth={40} 
          count={2500} 
          factor={4} 
          saturation={0.6} 
          fade 
          speed={1.0} 
        />
        
        {/* Floating Credit Card */}
        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
          <FloatingCard />
        </Float>
        
        {/* Orbiting Icons */}
        <OrbitingIcon serviceName="Netflix" color="#ef4444" radius={3.2} speed={0.4} offset={0} />
        <OrbitingIcon serviceName="Spotify" color="#22c55e" radius={3.6} speed={0.35} offset={Math.PI * 0.5} />
        <OrbitingIcon serviceName="Prime" color="#06b6d4" radius={4.0} speed={0.28} offset={Math.PI} />
        <OrbitingIcon serviceName="ChatGPT" color="#10b981" radius={3.4} speed={0.45} offset={Math.PI * 1.5} />
        
        <GridBackground />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2 + 0.15} 
          minPolarAngle={Math.PI / 2 - 0.35} 
        />
      </Canvas>
      
      {/* Ambient gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
    </div>
  );
}
