"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, useCursor, Html, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaCheck, FaHeadphones } from 'react-icons/fa'; 
import logoImg from '../../assets/Logo.png'; 
import { useAuth } from '../../context/AuthContext';

// --- MAIN PLANET (Phase 3: Crimson/Red Giant Theme) ---
// Added 'scale' prop for mobile resizing
const Planet = React.memo(({ scale = 1 }) => {
  const planetRef = useRef();
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const context = canvas.getContext('2d');
    // Deep Red Base
    context.fillStyle = '#4c0519'; // rose-950
    context.fillRect(0, 0, 1024, 512);
    // Fiery Orange/Gold Spots
    for (let i = 0; i < 25; i++) {
      context.fillStyle = `rgba(251, 146, 60, ${Math.random() * 0.2 + 0.1})`; // orange-400
      context.beginPath();
      context.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 100 + 50, 0, Math.PI * 2);
      context.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => { if (planetRef.current) planetRef.current.rotation.y += 0.0008; });

  return (
    <Sphere ref={planetRef} args={[4, 64, 64]} scale={[scale, scale, scale]}>
      <meshPhongMaterial map={texture} shininess={10} color="#fda4af" />
    </Sphere>
  );
});

// --- ATMOSPHERE GLOW (Warm Red) ---
// Added 'scale' prop
const Atmosphere = React.memo(({ scale = 1 }) => (
  <Sphere args={[4.2, 64, 64]} scale={[scale, scale, scale]}>
    <shaderMaterial
      vertexShader={`varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`}
      fragmentShader={`varying vec3 vNormal; void main() { float intensity = pow( 0.6 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 ); gl_FragColor = vec4( 0.9, 0.3, 0.3, 0.6 ) * intensity; }`}
      blending={THREE.AdditiveBlending}
      side={THREE.BackSide}
    />
  </Sphere>
));

// --- BACKGROUND DECOR: GOLDEN DWARF STAR ---
const GoldenStar = ({ position, size }) => {
    const ref = useRef();
    useFrame((state) => {
        if (ref.current) ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05); // Pulsing effect
    });

    return (
        <group position={position}>
            <mesh ref={ref}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshBasicMaterial color="#fbbf24" /> 
            </mesh>
            {/* Star Glow */}
            <mesh scale={[1.2, 1.2, 1.2]}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshBasicMaterial color="#f59e0b" transparent opacity={0.3} />
            </mesh>
        </group>
    );
};

// --- BACKGROUND DECOR: DARK MOON ---
const DarkMoon = ({ position, size }) => {
    return (
        <mesh position={position}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial color="#3f3f46" roughness={0.9} />
        </mesh>
    );
};

// --- HELPER FOR FLOATING ROCKS ---
const DistantPlanet = ({ position, size, color }) => (
    <mesh position={position}>
        <dodecahedronGeometry args={[size, 0]} />
        <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
);

// --- ASTEROID COMPONENT ---
const Asteroid = ({ lesson, index, userProgress, isMobile, onClick, onPointerOver, onPointerOut }) => {
    const pivotRef = useRef();
    const meshRef = useRef();
    
    // --- PHASE 3 OFFSET: 14 ---
    const globalIndex = 14 + index; 
    
    const isCompleted = userProgress > globalIndex;
    const isLocked = userProgress < globalIndex;

    const [hovered, setHovered] = useState(false);
    useCursor(hovered && !isLocked);

    const { position, rotation, speed } = useMemo(() => {
        // MOBILE ADJUSTMENT: Tighten orbits spread on mobile
        const angle = index * (isMobile ? 1.1 : 0.9); 
        
        // MOBILE ADJUSTMENT: Reduced radius (3.5) for mobile, kept (6) for desktop
        const baseRadius = isMobile ? 3.5 : 6;
        const radiusIncrement = isMobile ? 0.4 : 0.8;
        
        const radius = baseRadius + index * radiusIncrement;
        return {
            // MOBILE ADJUSTMENT: Increase vertical spread to use phone height
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
            meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
                meshRef.current.material.emissiveIntensity,
                hovered && !isLocked ? 0.6 : 0,
                delta * 10
            );
        }
     });

    // Warm Color Palette for Levels
    const colorMap = { 'Exposure': 0xfbbf24, 'Easy': 0xf43f5e, 'Medium': 0xe11d48, 'Hard': 0xbe123c }; 
    let currentColor = colorMap[lesson.difficulty] || 0xf43f5e;
    
    if (isLocked) currentColor = 0x52525b; // Zinc-600
    if (isCompleted) currentColor = 0x22c55e; // Green check

    const asteroidSize = isMobile ? 0.55 : 0.6;
    const hitboxSize = isMobile ? asteroidSize * 2.0 : asteroidSize * 1.5; 

    return (
        <group ref={pivotRef}>
            <group position={position} rotation={rotation}>
                <Sphere
                    args={[hitboxSize, 16, 16]}
                    onClick={(e) => { if (!isLocked) { e.stopPropagation(); onClick(index); } }}
                    onPointerOver={(e) => { if (!isLocked) { e.stopPropagation(); setHovered(true); onPointerOver(); } }}
                    onPointerOut={(e) => { if (!isLocked) { e.stopPropagation(); setHovered(false); onPointerOut(); } }}
                >
                    <meshBasicMaterial transparent opacity={0} depthWrite={false} />
                </Sphere>

                <mesh ref={meshRef}>
                    <icosahedronGeometry args={[asteroidSize, 1]} />
                    <meshPhongMaterial
                        color={currentColor}
                        emissive={!isLocked ? 0xfecdd3 : 0x000000} // Rose glow
                        emissiveIntensity={0}
                        flatShading={true}
                        transparent={isLocked}
                        opacity={isLocked ? 0.4 : 1.0}
                    />
                    {isLocked && (
                    <Html center pointerEvents="none" distanceFactor={isMobile ? 15 : 10}>
                        <div><FaLock className={`text-slate-400 opacity-70 ${isMobile ? 'text-xl' : 'text-2xl'}`} /></div>
                    </Html>
                    )}
                    {isCompleted && (
                    <Html center pointerEvents="none" distanceFactor={isMobile ? 15 : 10}>
                        <div><FaCheck className={`text-white ${isMobile ? 'text-xl' : 'text-2xl'}`} /></div>
                    </Html>
                    )}
                </mesh>
            </group>
        </group>
    );
};

// --- MAIN PAGE COMPONENT ---
function AudioScramble() {
  const navigate = useNavigate();
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const { currentUser, userProgress, totalXP, loading: authLoading } = useAuth();

  // FIX: Initialize as FALSE so Laptop defaults to the correct desktop view
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    // Initial check
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // PHASE 3 LESSONS (15-21)
  const lessons = useMemo(() => [
    { id: '15', name: 'Sound Soak: First Contact', description: 'Listen and learn 10 new words.', difficulty: 'Exposure' },
    { id: '16', name: 'Ear Match: Round One', description: 'Test your ear on the first 5 words.', difficulty: 'Easy' },
    { id: '17', name: 'Ear Match: Round Two', description: 'Test your ear on the next 5 words.', difficulty: 'Easy' },
    { id: '18', name: 'Hear & React: Home & Places', description: 'Listen to 10 new city words.', difficulty: 'Exposure' },
    { id: '19', name: 'Meaning Match: Professions', description: 'Can you recognize these professions?', difficulty: 'Medium' },
    { id: '20', name: 'Hear & React: Food & Travel', description: 'Listen to 10 travel-related words.', difficulty: 'Exposure' },
    { id: '21', name: 'Meaning Match: Moves & Maps', description: 'Final auditory challenge.', difficulty: 'Hard' },
  ], []);

  const selectedLesson = selectedLessonIndex !== null ? lessons[selectedLessonIndex] : null;

  const handleStartLesson = () => {
    if (selectedLesson) {
      // Phase 1 (0-6), Phase 2 (7-13), Phase 3 starts at 14.
      const globalLessonIndex = 14 + selectedLessonIndex; 
      
      navigate(`/lesson/${selectedLesson.id}`, {
        state: { lessonIndex: globalLessonIndex } 
      });
    }
  };

  const getLessonStatus = (index) => {
    const globalIndex = 14 + index; 
    if (userProgress > globalIndex) return 'completed';
    if (userProgress === globalIndex) return 'unlocked';
    return 'locked';
  };

   if (authLoading || userProgress === null) {
     return (
       <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
         <div className="text-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
           <p>Loading Phase 3...</p>
         </div>
       </div>
     );
   }

  // CAMERA LOGIC: Zoom out on mobile (Z=32), Standard on Desktop (Z=15)
  const cameraSettings = isMobile
    ? { position: [0, 0, 32], fov: 65 }
    : { position: [0, 0, 15], fov: 75 };

  // Shrink Planet only on Mobile
  const planetScale = isMobile ? 0.6 : 1;

  return (
    // --- BACKGROUND: Warm Radial Gradient (Red/Rose to Black) ---
    <div className="relative w-full h-screen overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4c0519] via-[#1e1b4b] to-black text-white">
      
      <Canvas
        camera={cameraSettings}
        className="absolute inset-0"
        onPointerMissed={() => setSelectedLessonIndex(null)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fbbf24" /> {/* Golden Sunlight */}
        
        <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={150} scale={25} size={3} speed={0.4} opacity={0.5} color="#fbbf24" />

        {/* --- BACKGROUND DECOR --- */}
        {/* Pulsing Golden Star (Top Left) - Adjusted for Mobile */}
        <GoldenStar position={isMobile ? [-10, 15, -30] : [-15, 8, -25]} size={2} />
        
        {/* Mysterious Dark Moon (Bottom Right) - Adjusted for Mobile */}
        <DarkMoon position={isMobile ? [10, -15, -25] : [12, -6, -15]} size={3} />

        {/* Floating Rocks/Debris using Float */}
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <DistantPlanet position={[18, 5, -30]} size={0.5} color="#881337" />
        </Float>

        {/* Pass Scale to Planet Components */}
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

      {/* --- HEADER FIX --- */}
      <div className="absolute inset-0 flex flex-col p-3 sm:p-4 md:p-8 ui-overlay pointer-events-none">
        <header className="w-full max-w-7xl mx-auto flex justify-between items-center pointer-events-auto px-1 sm:px-0">
           
           <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3">
            <img src={logoImg} alt="NeuroSwitch Logo" className="w-8 h-8 sm:w-11 sm:h-11" />
            {/* FIX: Hidden on mobile to prevent overlap */}
            <span className="hidden md:block text-lg sm:text-2xl font-bold text-white">NeuroSwitch</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
             {/* Phase 3 Badge - Smaller on Mobile */}
             <div className="bg-rose-900/50 border border-rose-500/30 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full whitespace-nowrap">
                <span className="text-[10px] sm:text-sm font-bold text-rose-300 uppercase tracking-wider">Phase 3</span>
             </div>

            <div className="text-right">
              {/* FIX: Truncate name on Mobile */}
              <p className="font-semibold text-xs sm:text-sm max-w-[80px] sm:max-w-none truncate">
                {currentUser?.name || 'Player'}
              </p>
              <p className="text-[10px] sm:text-xs text-rose-400 font-bold">
                XP: {totalXP !== null ? totalXP.toLocaleString() : '...'}
              </p>
            </div>
             
             <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=f43f5e&color=fff`} 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-rose-400 flex-shrink-0" 
              alt="User Avatar" 
            />
          </div>
        </header>

        <main className="flex-grow flex flex-col justify-end items-center text-center pb-4 sm:pb-8">
          <div
            className={`glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-[95%] sm:max-w-md md:max-w-lg mb-4 sm:mb-8 transition-all duration-300 ease-out border-rose-500/30 bg-slate-900/80
              ${selectedLesson ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-5 pointer-events-none'}`}
          >
            {selectedLesson && (
              <>
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-rose-100 text-left leading-tight flex items-center gap-2">
                    {selectedLesson.name}
                    {selectedLesson.difficulty === 'Exposure' && <FaHeadphones className="text-rose-400 text-base" />}
                  </h2>
                  {getLessonStatus(selectedLessonIndex) === 'completed' && (
                    <FaCheck className="text-emerald-400 text-xl sm:text-2xl flex-shrink-0 ml-3 mt-1" />
                  )}
                </div>
                <p className="text-gray-300 text-sm sm:text-base mt-1 sm:mt-2 text-left mb-4 sm:mb-5">{selectedLesson.description}</p>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                    <button
                        onClick={handleStartLesson}
                        className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105 text-base shadow-lg hover:shadow-rose-500/20"
                    >
                    {getLessonStatus(selectedLessonIndex) === 'completed' ? 'Replay Mission' : 'Start Mission'}
                    </button>
                </div>
              </>
            )}
          </div>
          {!selectedLesson && !isHovering && (
             <p className="text-rose-200/70 text-base sm:text-lg animate-pulse">
              Select a Phase 3 mission to begin.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default AudioScramble;