import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// Rotating holographic globe showing connecting points
function SubscriptionGlobe() {
  const globeRef = useRef();
  const wireframeRef = useRef();

  useFrame((state) => {
    if (!globeRef.current || !wireframeRef.current) return;
    const time = state.clock.getElapsedTime();
    globeRef.current.rotation.y = time * 0.1;
    wireframeRef.current.rotation.y = -time * 0.05;
  });

  return (
    <group>
      {/* Translucent Solid core */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshPhysicalMaterial 
          color="#0b1329" 
          roughness={0.2}
          metalness={0.8}
          transmission={0.6}
          thickness={1.0}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Grid Wireframe overlay */}
      <mesh ref={wireframeRef}>
        <sphereGeometry args={[1.62, 18, 18]} />
        <meshBasicMaterial 
          color="#06b6d4" 
          wireframe 
          transparent 
          opacity={0.15} 
        />
      </mesh>

      {/* Orbiting financial rings */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.0, 0.02, 8, 64]} />
        <meshStandardMaterial 
          color="#d946ef" 
          emissive="#d946ef" 
          emissiveIntensity={1.0} 
        />
      </mesh>
      
      {/* Node Points representing server connection nodes */}
      <group>
        <mesh position={[1.0, 1.2, 0.4]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[-1.2, -0.6, 0.8]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0.2, -1.4, 0.9]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        <mesh position={[-0.4, 1.1, -1.2]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      </group>
    </group>
  );
}

// Hoverable Category Block
function CategoryBlock({ name, position, color, labelText }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Gentle rotation and float
    meshRef.current.rotation.x = time * 0.3;
    meshRef.current.rotation.y = time * 0.4;
    
    // Scale on hover
    const targetScale = hovered ? 1.3 : 1.0;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.7} 
          roughness={0.1}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.2}
        />
      </mesh>
      
      {/* Category Labels */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.16}
        color={hovered ? '#ffffff' : '#94a3b8'}
        fontWeight="bold"
        anchorX="center"
        anchorY="bottom"
      >
        {name}
      </Text>
      
      {hovered && (
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.12}
          color="#06b6d4"
          anchorX="center"
          anchorY="top"
        >
          {labelText}
        </Text>
      )}
    </group>
  );
}

export default function DashboardCanvas() {
  return (
    <div className="w-full h-[400px] md:h-[450px] relative select-none">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#020617']} />
        
        {/* Environment setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 5, 2]} intensity={1.0} />
        <pointLight position={[-6, 4, -4]} color="#d946ef" intensity={1.5} />
        <pointLight position={[6, -4, 4]} color="#06b6d4" intensity={1.5} />
        
        <Stars radius={60} depth={30} count={1200} factor={3} saturation={0.5} fade speed={1.0} />
        
        {/* Core Globe */}
        <SubscriptionGlobe />
        
        {/* Interactive cubes surrounding the globe */}
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
          <CategoryBlock 
            name="Media" 
            position={[-2.4, 0.8, 0]} 
            color="#ef4444" 
            labelText="Netflix, YouTube, Prime"
          />
          <CategoryBlock 
            name="Music" 
            position={[2.4, 0.8, 0]} 
            color="#22c55e" 
            labelText="Spotify, Apple Music"
          />
          <CategoryBlock 
            name="SaaS" 
            position={[-2.4, -0.8, 0]} 
            color="#06b6d4" 
            labelText="ChatGPT, Github, AWS"
          />
          <CategoryBlock 
            name="Cloud" 
            position={[2.4, -0.8, 0]} 
            color="#6366f1" 
            labelText="Google One, iCloud"
          />
        </Float>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2 + 0.2} 
          minPolarAngle={Math.PI / 2 - 0.2} 
        />
      </Canvas>
      
      {/* Interactive hover notice */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none glass-panel px-4 py-1.5 rounded-full text-xs text-slate-400 border border-white/5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
        Drag to Rotate Globe • Hover Categories
      </div>
    </div>
  );
}
