"use client";

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import { MeshDistortMaterial, Sphere, Icosahedron, TorusKnot, Float } from '@react-three/drei';

// --- PHASE 1: NEURAL CLOUD (Particles - Purple) ---
function Phase1Core() {
  const pointsRef = useRef();

  const particles = useMemo(() => {
    const temp = [];
    const numPoints = 600;
    const radius = 1.6;
    for (let i = 0; i < numPoints; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, []);

  useFrame((state) => {
    const { mouse, clock } = state;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = MathUtils.lerp(pointsRef.current.rotation.y, mouse.x * 0.5 + clock.getElapsedTime() * 0.1, 0.05);
      pointsRef.current.rotation.x = MathUtils.lerp(pointsRef.current.rotation.x, mouse.y * 0.5, 0.05);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#a78bfa" size={0.06} sizeAttenuation={true} transparent opacity={0.8} />
    </points>
  );
}

// --- PHASE 2: VISUAL CRYSTAL (Geometric - Cyan) ---
function Phase2Core() {
  const meshRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
      meshRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group>
      <Icosahedron ref={meshRef} args={[1.6, 0]}>
        <meshStandardMaterial color="#2dd4bf" wireframe />
      </Icosahedron>
      <Sphere args={[0.8, 16, 16]}>
         <meshBasicMaterial color="#0d9488" transparent opacity={0.5} />
      </Sphere>
    </group>
  );
}

// --- PHASE 3: RESONANCE CORE (Audio/Pulsing - Rose/Gold) ---
function Phase3Core() {
  const sphereRef = useRef();

  useFrame((state) => {
     if(sphereRef.current) {
         sphereRef.current.rotation.y += 0.005;
     }
  });

  return (
    <Sphere ref={sphereRef} args={[1.4, 64, 64]}>
      <MeshDistortMaterial 
        color="#f43f5e" 
        attach="material" 
        distort={0.4} 
        speed={2}     
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

// --- PHASE 4: SYNTACTIC CONSTRUCT (Golden Knot - Story Mode) ---
function Phase4Core() {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Complex rotation to show off the knot structure
      meshRef.current.rotation.x = t * 0.2;
      meshRef.current.rotation.y = t * 0.4;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        {/* The Golden Knot representing complex sentence structure */}
        <TorusKnot ref={meshRef} args={[1, 0.35, 128, 16]}>
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#d97706"
            emissiveIntensity={0.2}
            roughness={0.1} 
            metalness={0.6} 
          />
        </TorusKnot>
        
        {/* Inner Light Source */}
        <pointLight distance={3} intensity={2} color="#fffbeb" />
      </group>
    </Float>
  );
}

// --- MAIN ANIMATION CONTROLLER ---
function CognitiveCoreAnimation({ phase }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4] }}
      style={{ cursor: 'grab' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 2]} intensity={1.5} />
      
      {/* Logic to Switch Cores */}
      {phase === 1 && <Phase1Core />}
      {phase === 2 && <Phase2Core />}
      {phase === 3 && <Phase3Core />}
      {phase === 4 && <Phase4Core />}
      
      {/* Default Fallback */}
      {(!phase || phase === 0) && <Phase1Core />}
    </Canvas>
  );
}

export default CognitiveCoreAnimation;