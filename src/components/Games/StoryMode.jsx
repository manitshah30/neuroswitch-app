"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, useCursor, Html, Sparkles, Float, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { Link, useNavigate } from 'react-router-dom';
// Ensure you have 'react-icons' installed
import { FaLock, FaCheck, FaBookOpen } from 'react-icons/fa'; 
import logoImg from '../../assets/Logo.png'; 
import { useAuth } from '../../context/AuthContext';

// --- MAIN PLANET: THE RADIANT CORE (White/Gold) ---
// Added 'scale' prop for mobile resizing
const Planet = React.memo(({ scale = 1 }) => {
  const planetRef = useRef();
  
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const context = canvas.getContext('2d');
    // Pure White Base
    context.fillStyle = '#fffbeb'; // amber-50
    context.fillRect(0, 0, 1024, 512);
    // Gold/Amber swirls
    for (let i = 0; i < 40; i++) {
      context.fillStyle = `rgba(245, 158, 11, ${Math.random() * 0.2 + 0.05})`; // amber-500
      context.beginPath();
      context.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 150 + 50, 0, Math.PI * 2);
      context.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => { 
      if (planetRef.current) {
          planetRef.current.rotation.y += 0.0005; 
          // Slight pulse effect
          const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.005;
          // Apply scale prop multiplied by pulse
          planetRef.current.scale.set(scale * pulse, scale * pulse, scale * pulse);
      }
  });

  return (
    <Sphere ref={planetRef} args={[4, 64, 64]}>
      <meshStandardMaterial 
        map={texture} 
        emissive="#f59e0b"
        emissiveIntensity={0.2}
        roughness={0.4}
        metalness={0.1} 
      />
    </Sphere>
  );
});

// --- ATMOSPHERE: ETHEREAL HALO ---
// Added 'scale' prop
const Atmosphere = React.memo(({ scale = 1 }) => (
  <Sphere args={[4.3, 64, 64]} scale={[scale, scale, scale]}>
    <shaderMaterial
      vertexShader={`varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`}
      fragmentShader={`varying vec3 vNormal; void main() { float intensity = pow( 0.5 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 3.0 ); gl_FragColor = vec4( 1.0, 0.9, 0.6, 0.5 ) * intensity; }`}
      blending={THREE.AdditiveBlending}
      side={THREE.BackSide}
    />
  </Sphere>
));

// --- DECOR: ORBITING KNOWLEDGE RINGS ---
const GalaxyRing = ({ rotation, radius, color }) => {
    const ref = useRef();
    useFrame(() => { if (ref.current) ref.current.rotation.z -= 0.001; });
    
    return (
        <group rotation={rotation}>
            <mesh ref={ref}>
                <torusGeometry args={[radius, 0.02, 16, 100]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>
        </group>
    );
};

// --- ASTEROID COMPONENT (UPDATED) ---
const Asteroid = ({ lesson, index, userProgress, isMobile, onClick, onPointerOver, onPointerOut }) => {
    const pivotRef = useRef();
    const meshRef = useRef();
    
    // --- PHASE 4 OFFSET: 21 ---
    const globalIndex = 21 + index; 
    
    const isCompleted = userProgress > globalIndex;
    const isLocked = userProgress < globalIndex;

    const [hovered, setHovered] = useState(false);
    useCursor(hovered && !isLocked);

    const { position, rotation, speed } = useMemo(() => {
        const angle = index * (isMobile ? 1.1 : 0.9); 
        
        // FIX: Adjusted mobile radius for Z=28
        const baseRadius = isMobile ? 3.8 : 6.5;
        const radiusIncrement = isMobile ? 0.45 : 0.8;
        
        const radius = baseRadius + index * radiusIncrement;
        return {
            position: [
                radius * Math.cos(angle), 
                (Math.random() - 0.5) * (isMobile ? 4 : 2), 
                radius * Math.sin(angle)
            ],
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
            speed: 0.002 + Math.random() * 0.003
        };
    }, [index, isMobile]);

    useFrame((state, delta) => {
        if (pivotRef.current) pivotRef.current.rotation.y += speed;
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
            // Pulse Gold on hover
            meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
                meshRef.current.material.emissiveIntensity,
                hovered && !isLocked ? 0.8 : 0.1,
                delta * 10
            );
        }
     });

    // Theme: Golden/Amber/White
    const colorMap = { 'Story': 0xf59e0b, 'Easy': 0xd97706, 'Medium': 0xb45309, 'Hard': 0x78350f }; 
    let currentColor = colorMap[lesson.difficulty] || 0xf59e0b;
    
    if (isLocked) currentColor = 0x52525b; // Zinc-600
    if (isCompleted) currentColor = 0x10b981; // Emerald-500 (Success)

    // FIX: Larger Visual Size
    const asteroidSize = isMobile ? 0.75 : 0.7; 
    // FIX: Massive Hitbox
    const hitboxSize = isMobile ? asteroidSize * 3.0 : asteroidSize * 2.0;

    return (
        <group ref={pivotRef}>
            <group position={position} rotation={rotation}>
                {/* Invisible Hitbox Sphere */}
                <Sphere
                    args={[hitboxSize, 16, 16]}
                    onClick={(e) => { if (!isLocked) { e.stopPropagation(); onClick(index); } }}
                    onPointerOver={(e) => { if (!isLocked) { e.stopPropagation(); setHovered(true); onPointerOver(); } }}
                    onPointerOut={(e) => { if (!isLocked) { e.stopPropagation(); setHovered(false); onPointerOut(); } }}
                >
                    <meshBasicMaterial transparent opacity={0} depthWrite={false} />
                </Sphere>

                <mesh ref={meshRef}>
                    <octahedronGeometry args={[asteroidSize, 0]} />
                    <meshStandardMaterial
                        color={currentColor}
                        emissive={!isLocked ? 0xfcd34d : 0x000000} // Gold glow
                        emissiveIntensity={0.1}
                        flatShading={true}
                        transparent={isLocked}
                        opacity={isLocked ? 0.4 : 1.0}
                        roughness={0.2}
                        metalness={0.5}
                    />
                    
                    {/* FIX: Pointer Events None for Icons */}
                    {isLocked && (
                    <Html center distanceFactor={isMobile ? 15 : 10} style={{ pointerEvents: 'none' }}>
                        <div className="pointer-events-none"><FaLock className={`text-slate-400 opacity-70 ${isMobile ? 'text-lg' : 'text-2xl'}`} /></div>
                    </Html>
                    )}
                    {isCompleted && (
                    <Html center distanceFactor={isMobile ? 15 : 10} style={{ pointerEvents: 'none' }}>
                        <div className="pointer-events-none"><FaCheck className={`text-white ${isMobile ? 'text-lg' : 'text-2xl'}`} /></div>
                    </Html>
                    )}
                </mesh>
            </group>
        </group>
    );
};

// --- MAIN PAGE COMPONENT ---
function StoryMode() {
  const navigate = useNavigate();
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const { currentUser, userProgress, totalXP, loading: authLoading } = useAuth();

  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // PHASE 4 LESSONS (22-28)
  const lessons = useMemo(() => [
    { id: '22', name: 'Chapter 1: The Market', description: 'Scenario: Buying fruit and paying.', difficulty: 'Story' },
    { id: '23', name: 'Chapter 2: The Restaurant', description: 'Scenario: Ordering and reading a menu.', difficulty: 'Story' },
    { id: '24', name: 'Chapter 3: The Journey', description: 'Scenario: Travel, tickets, and maps.', difficulty: 'Easy' },
    { id: '25', name: 'Chapter 4: The House', description: 'Scenario: Chores and daily life.', difficulty: 'Medium' },
    { id: '26', name: 'Chapter 5: The Hospital', description: 'Scenario: Doctors and symptoms.', difficulty: 'Medium' },
    { id: '27', name: 'Chapter 6: Shopping', description: 'Scenario: Clothes and sizes.', difficulty: 'Hard' },
    { id: '28', name: 'Epilogue: Mastery', description: 'The final challenge. Put it all together.', difficulty: 'Hard' },
  ], []);

  const selectedLesson = selectedLessonIndex !== null ? lessons[selectedLessonIndex] : null;

  const handleStartLesson = () => {
    if (selectedLesson) {
      const globalLessonIndex = 21 + selectedLessonIndex; 
      navigate(`/lesson/${selectedLesson.id}`, {
        state: { lessonIndex: globalLessonIndex } 
      });
    }
  };

  const getLessonStatus = (index) => {
    const globalIndex = 21 + index; 
    if (userProgress > globalIndex) return 'completed';
    if (userProgress === globalIndex) return 'unlocked';
    return 'locked';
  };

   if (authLoading || userProgress === null) {
     return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Loading...</div>;
   }

  // FIX: Camera Z set to 28 for mobile (closer zoom)
  const cameraSettings = isMobile
    ? { position: [0, 0, 28], fov: 65 }
    : { position: [0, 0, 15], fov: 75 };

  const planetScale = isMobile ? 0.6 : 1;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#451a03] via-[#0f172a] to-black text-white">
      
      <Canvas
        camera={cameraSettings}
        className="absolute inset-0"
        onPointerMissed={() => setSelectedLessonIndex(null)}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={2} color="#fffbeb" />
        
        <Stars radius={200} depth={50} count={6000} factor={4} saturation={0} fade speed={0.5} />
        <Sparkles count={300} scale={30} size={4} speed={0.2} opacity={0.6} color="#fcd34d" />

        <GalaxyRing rotation={[1.2, 0.5, 0]} radius={12} color="#fbbf24" />
        <GalaxyRing rotation={[0.8, -0.5, 0]} radius={15} color="#d97706" />

        <Planet scale={planetScale} />
        <Atmosphere scale={planetScale} />

        {lessons.map((lesson, index) => (
          <Asteroid
            key={lesson.id}
            lesson={lesson}
            index={index}
            userProgress={userProgress}
            isMobile={isMobile}
            onClick={setSelectedLessonIndex}
            onPointerOver={() => setIsHovering(true)}
            onPointerOut={() => setIsHovering(false)}
          />
        ))}
      </Canvas>

      <div className="absolute inset-0 flex flex-col p-3 sm:p-4 md:p-8 ui-overlay pointer-events-none">
        <header className="w-full max-w-7xl mx-auto flex justify-between items-center pointer-events-auto px-1 sm:px-0">
           
           <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3">
            <img src={logoImg} alt="Logo" className="w-8 h-8 sm:w-11 sm:h-11" />
            <span className="hidden md:block text-lg sm:text-2xl font-bold text-white">NeuroSwitch</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
             <div className="bg-amber-900/50 border border-amber-500/30 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <span className="text-[10px] sm:text-sm font-bold text-amber-300 uppercase tracking-wider">Phase 4</span>
             </div>

            <div className="text-right">
              <p className="font-semibold text-xs sm:text-sm max-w-[80px] sm:max-w-none truncate">
                {currentUser?.name || 'Player'}
              </p>
              <p className="text-[10px] sm:text-xs text-amber-400 font-bold">
                XP: {totalXP !== null ? totalXP : '...'}
              </p>
            </div>
             
             <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=d97706&color=fff`} 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-amber-400 flex-shrink-0" 
              alt="User" 
            />
          </div>
        </header>

        <main className="flex-grow flex flex-col justify-end items-center text-center pb-4 sm:pb-8">
          <div
            className={`glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-[95%] sm:max-w-md md:max-w-lg mb-4 sm:mb-8 transition-all duration-300 ease-out border-amber-500/30 bg-slate-900/80
              ${selectedLesson ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-5 pointer-events-none'}`}
          >
            {selectedLesson && (
              <>
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-100 text-left leading-tight flex items-center gap-2">
                    {selectedLesson.name}
                    <FaBookOpen className="text-amber-400 text-base" />
                  </h2>
                  {getLessonStatus(selectedLessonIndex) === 'completed' && (
                    <FaCheck className="text-emerald-400 text-xl sm:text-2xl flex-shrink-0 ml-3 mt-1" />
                  )}
                </div>
                <p className="text-gray-300 text-sm sm:text-base mt-1 sm:mt-2 text-left mb-4 sm:mb-5">{selectedLesson.description}</p>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                    <button
                        onClick={handleStartLesson}
                        className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105 text-base shadow-lg hover:shadow-amber-500/20"
                    >
                    {getLessonStatus(selectedLessonIndex) === 'completed' ? 'Replay Story' : 'Start Story'}
                    </button>
                </div>
              </>
            )}
          </div>
          {!selectedLesson && !isHovering && (
             <p className="text-amber-200/70 text-base sm:text-lg animate-pulse">
              Select a Chapter to begin.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default StoryMode;