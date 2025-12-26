"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, useCursor, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaCheck } from 'react-icons/fa';
import logoImg from '../../assets/Logo.png';
import { useAuth } from '../../context/AuthContext';

// --- MAIN PLANET ---
const Planet = React.memo(({ scale = 1 }) => {
  const planetRef = useRef();
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const context = canvas.getContext('2d');
    context.fillStyle = '#1e1b4b'; 
    context.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 20; i++) {
      context.fillStyle = `rgba(139, 92, 246, ${Math.random() * 0.3 + 0.1})`; 
      context.beginPath();
      context.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 100 + 50, 0, Math.PI * 2);
      context.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => { if (planetRef.current) planetRef.current.rotation.y += 0.0005; });

  return (
    <Sphere ref={planetRef} args={[4, 64, 64]} scale={[scale, scale, scale]}>
      <meshPhongMaterial map={texture} shininess={30} />
    </Sphere>
  );
});

// --- ATMOSPHERE GLOW ---
const Atmosphere = React.memo(({ scale = 1 }) => (
  <Sphere args={[4.2, 64, 64]} scale={[scale, scale, scale]}>
    <shaderMaterial
      vertexShader={`varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`}
      fragmentShader={`varying vec3 vNormal; void main() { float intensity = pow( 0.6 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 ); gl_FragColor = vec4( 0.5, 0.4, 0.9, 0.5 ) * intensity; }`}
      blending={THREE.AdditiveBlending}
      side={THREE.BackSide}
    />
  </Sphere>
));

// --- BACKGROUND DECOR 1 ---
const RingPlanet = ({ position, size, color, ringColor }) => {
    const planetRef = useRef();
    const ringRef = useRef();

    useFrame(() => {
        if (planetRef.current) planetRef.current.rotation.y += 0.001;
        if (ringRef.current) ringRef.current.rotation.z -= 0.0005;
    });

    return (
        <group position={position}>
            <mesh ref={planetRef}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            <mesh ref={ringRef} rotation={[1.8, 0, 0]}>
                <ringGeometry args={[size * 1.4, size * 2.2, 64]} />
                <meshBasicMaterial color={ringColor} side={THREE.DoubleSide} transparent opacity={0.4} />
            </mesh>
        </group>
    );
};

// --- BACKGROUND DECOR 2 ---
const DetailedMoon = ({ position, size, baseColor, spotColor }) => {
    const ref = useRef();
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, 512, 256);
        for (let i = 0; i < 15; i++) {
            ctx.fillStyle = spotColor;
            ctx.beginPath();
            ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 40 + 10, 0, Math.PI * 2);
            ctx.fill();
        }
        return new THREE.CanvasTexture(canvas);
    }, [baseColor, spotColor]);

    useFrame(() => { if (ref.current) ref.current.rotation.y -= 0.002; });

    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
};

// --- ASTEROID COMPONENT ---
const Asteroid = ({ lesson, index, userProgress, isMobile, onClick, onPointerOver, onPointerOut }) => {
    const pivotRef = useRef();
    const meshRef = useRef();
    const isCompleted = index < userProgress;
    const isLocked = index > userProgress;
    const [hovered, setHovered] = useState(false);
    useCursor(hovered && !isLocked);

    const { position, rotation, speed } = useMemo(() => {
        // Only tighten orbit on mobile
        const angle = index * (isMobile ? 1.1 : 0.9);
        
        // Restore original radius for Desktop (6), shrink only for mobile (3.5)
        const baseRadius = isMobile ? 3.5 : 6; 
        const radiusIncrement = isMobile ? 0.4 : 0.8; 
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
            meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
                meshRef.current.material.emissiveIntensity,
                hovered && !isLocked ? 0.7 : 0,
                delta * 10
            );
        }
     });

    const colorMap = { 'Easy': 0x87CEEB, 'Medium': 0x9370DB, 'Hard': 0xCC0000 };
    let currentColor = colorMap[lesson.difficulty];
    if (isLocked) currentColor = 0x666666;
    if (isCompleted) currentColor = 0x00ff00;

    const asteroidSize = isMobile ? 0.6 : 0.6; 

    return (
        <group ref={pivotRef}>
        <group position={position} rotation={rotation}>
            <Sphere
                args={[asteroidSize * 2.5, 16, 16]} 
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
                    emissive={!isLocked ? 0xaaaaaa : 0x000000}
                    emissiveIntensity={0}
                    flatShading={true}
                    transparent={isLocked}
                    opacity={isLocked ? 0.4 : 1.0}
                />
                {isLocked && (
                <Html center pointerEvents="none" distanceFactor={isMobile ? 15 : 10}>
                    <div><FaLock className={`text-white opacity-70 ${isMobile ? 'text-lg' : 'text-2xl'}`} /></div>
                </Html>
                )}
                {isCompleted && (
                <Html center pointerEvents="none" distanceFactor={isMobile ? 15 : 10}>
                    <div><FaCheck className={`text-white ${isMobile ? 'text-lg' : 'text-2xl'}`} /></div>
                </Html>
                )}
            </mesh>
        </group>
        </group>
    );
};

// --- MAIN PAGE COMPONENT ---
function VocabularyGamePage() {
  const navigate = useNavigate();
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const { currentUser, userProgress, totalXP, loading: authLoading } = useAuth();

  // FIX: Initialize as FALSE (Desktop) to ensure laptop always looks correct initially
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check purely on client side
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    
    // Call once to set initial state correctly based on current window
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const difficultyMap = {
    'Easy': { className: 'bg-blue-500/20 text-blue-300' },
    'Medium': { className: 'bg-purple-500/20 text-purple-300' },
    'Hard': { className: 'bg-red-500/20 text-red-300' }
  };

  const lessons = useMemo(() => [
    { id: '1', name: 'Greetings & Essentials', description: 'Master foundational greetings and introductions.', difficulty: 'Easy' },
    { id: '2', name: 'Pronouns & People', description: 'Learn pronouns and how to describe people.', difficulty: 'Easy' },
    { id: '3', name: 'Numbers', description: 'Count from 1 to 100 and use numbers in context.', difficulty: 'Medium' },
    { id: '4', name: 'Colors', description: 'Learn the names of primary and secondary colors.', difficulty: 'Medium' },
    { id: '5', name: 'Everyday Verbs', description: 'Understand the basics of present tense verbs.', difficulty: 'Medium' },
    { id: '6', name: 'Food Items', description: 'Talk about your favorite foods and order at a restaurant.', difficulty: 'Hard' },
    { id: '7', name: 'Family & Daily Life', description: 'Describe your family and daily routines.', difficulty: 'Hard' },
  ], []);

  const selectedLesson = selectedLessonIndex !== null ? lessons[selectedLessonIndex] : null;

  const handleStartLesson = () => {
    if (selectedLesson) {
      navigate(`/lesson/${selectedLesson.id}`, {
        state: { lessonIndex: selectedLessonIndex }
      });
    }
  };

  const getLessonStatus = (index) => {
    if (index < userProgress) return 'completed';
    if (index === userProgress) return 'unlocked';
    return 'locked';
  };

   if (authLoading || userProgress === null) {
     return (
       <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
         <div className="text-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
           <p>Loading Your Progress...</p>
         </div>
       </div>
     );
   }

  // CAMERA SETTINGS
  // Desktop (False): [0, 0, 15] -> EXACTLY your original perfect laptop settings
  // Mobile (True): [0, 0, 32] -> Zoomed out only for phone
  const cameraSettings = isMobile
    ? { position: [0, 0, 32], fov: 65 } 
    : { position: [0, 0, 15], fov: 75 }; 

  const planetScale = isMobile ? 0.6 : 1;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e1b4b] via-[#020617] to-black text-white">
      
      <Canvas
        camera={cameraSettings}
        className="absolute inset-0"
        onPointerMissed={() => setSelectedLessonIndex(null)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        
        <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={150} scale={25} size={2} speed={0.4} opacity={0.4} color="#a78bfa" />

        <RingPlanet 
            position={isMobile ? [-10, 15, -30] : [-16, 7, -25]} 
            size={3} 
            color="#b45309" 
            ringColor="#fcd34d" 
        />

        <DetailedMoon 
            position={isMobile ? [10, -15, -25] : [15, -6, -20]} 
            size={2.2} 
            baseColor="#172554" 
            spotColor="#60a5fa" 
        />

        <DetailedMoon 
            position={[10, 12, -35]} 
            size={1.2} 
            baseColor="#831843" 
            spotColor="#f472b6" 
        />

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

      {/* --- HEADER --- */}
      <div className="absolute inset-0 flex flex-col p-3 sm:p-4 md:p-8 ui-overlay pointer-events-none">
        
        {/* Added px-1 for safe spacing on mobile edges */}
        <header className="w-full max-w-7xl mx-auto flex justify-between items-center pointer-events-auto px-1 sm:px-0">
           
           <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3">
            <img src={logoImg} alt="NeuroSwitch Logo" className="w-8 h-8 sm:w-11 sm:h-11" />
            {/* FIX: 'hidden md:block' -> Hides text entirely on mobile to prevent overlap */}
            <span className="hidden md:block text-lg sm:text-2xl font-bold text-white">NeuroSwitch</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
             {/* Phase 1 Badge - Adjusted sizing */}
             <div className="bg-purple-900/50 border border-purple-500/30 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full whitespace-nowrap">
                <span className="text-[10px] sm:text-sm font-bold text-purple-300 uppercase tracking-wider">Phase 1</span>
             </div>

            <div className="text-right">
              {/* Truncate name on mobile to prevent layout breaking */}
              <p className="font-semibold text-xs sm:text-sm max-w-[80px] sm:max-w-none truncate">
                {currentUser?.name || currentUser?.email || 'Player'}
              </p>
              <p className="text-[10px] sm:text-xs text-yellow-400 font-bold">
                XP: {totalXP !== null ? totalXP.toLocaleString() : '...'}
              </p>
            </div>
             
             {/* User Avatar */}
             <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || currentUser?.email || 'U')}&background=7c3aed&color=fff`} 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-purple-400 flex-shrink-0" 
              alt="User Avatar" 
            />
          </div>
        </header>

        <main className="flex-grow flex flex-col justify-end items-center text-center pb-4 sm:pb-8">
          <div
            className={`glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-[95%] sm:max-w-md md:max-w-lg mb-4 sm:mb-8 transition-all duration-300 ease-out border-purple-500/30 bg-slate-900/80
              ${selectedLesson ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-5 pointer-events-none'}`}
          >
            {selectedLesson && (
              <>
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-left leading-tight">
                    Lesson {selectedLessonIndex + 1}: {selectedLesson.name}
                  </h2>
                  {getLessonStatus(selectedLessonIndex) === 'completed' && (
                    <FaCheck className="text-green-400 text-xl sm:text-2xl flex-shrink-0 ml-3 mt-1" />
                  )}
                </div>
                <p className="text-gray-300 text-sm sm:text-base mt-1 sm:mt-2 text-left mb-4 sm:mb-5">{selectedLesson.description}</p>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyMap[selectedLesson.difficulty]?.className} self-start sm:self-center`}>
                    Difficulty: {selectedLesson.difficulty}
                    </span>
                    <button
                        onClick={handleStartLesson}
                        className="w-full sm:w-auto bg-gradient-to-r from-[#A78BFA] to-[#C1CFFB] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105 text-base shadow-md hover:shadow-lg"
                    >
                    {getLessonStatus(selectedLessonIndex) === 'completed' ? 'Replay Mission' : 'Start Mission'}
                    </button>
                </div>
              </>
            )}
          </div>
          {!selectedLesson && !isHovering && (
             <p className="text-purple-300/70 text-base sm:text-lg animate-pulse">
              Select an asteroid to begin.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default VocabularyGamePage;