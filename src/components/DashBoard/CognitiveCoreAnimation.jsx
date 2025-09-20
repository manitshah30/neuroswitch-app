"use client"; // This directive is essential for components with interactivity and hooks

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

// This component creates the sphere of points
function PointSphere() {
  const pointsRef = useRef();

  // Generate the positions of the points on a sphere
  // useMemo ensures this calculation only runs once
  const particles = useMemo(() => {
    const temp = [];
    const numPoints = 500;
    const radius = 1.5;
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

  // useFrame is a hook that runs on every rendered frame
  useFrame((state) => {
    const { mouse } = state;
    if (pointsRef.current) {
      // This creates the smooth rotation effect based on mouse position
      // MathUtils.lerp is a smooth interpolation function
      pointsRef.current.rotation.y = MathUtils.lerp(pointsRef.current.rotation.y, mouse.x * 0.5, 0.05);
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
      <pointsMaterial
        color="#C1CFFB" // Color of the points
        size={0.05}     // Size of each point
        sizeAttenuation={true}
      />
    </points>
  );
}

// This is the main component that sets up the 3D canvas
function CognitiveCoreAnimation() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3] }} // Set initial camera position
      style={{ cursor: 'grab' }}
    >
      <PointSphere />
    </Canvas>
  );
}

export default CognitiveCoreAnimation;