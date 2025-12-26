"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, useCursor, Html, Sparkles, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaCheck } from 'react-icons/fa';
import logoImg from '../../assets/Logo.png'; 
import { useAuth } from '../../context/AuthContext';

// --- MAIN INTERACTIVE PLANET (Cyan) ---
// Added scale prop for mobile resizing
const Planet = React.memo(({ scale = 1 }) => {
  const planetRef = useRef();
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const context = canvas.getContext('2d');
    context.fillStyle = '#042f2e'; 
    context.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 20; i++) {
      context.fillStyle = `rgba(45, 212, 191, ${Math.random() * 0.3 + 0.1})`; 
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
// Added scale prop
const Atmosphere = React.memo(({ scale = 1 }) => (
  <Sphere args={[4.2, 64, 64]} scale={[scale, scale, scale]}>
    <shaderMaterial
      vertexShader={`varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`}
      fragmentShader={`varying vec3 vNormal; void main() { float intensity = pow( 0.6 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 ); gl_FragColor = vec4( 0.2, 0.9, 0.9, 0.5 ) * intensity; }`}
      blending={THREE.AdditiveBlending}
      side={THREE.BackSide}
    />
  </Sphere>
));

// --- BACKGROUND DECOR 1: RINGED PLANET ---
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

// --- BACKGROUND DECOR 2: DETAILED MOON ---
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
    
    const globalIndex = 7 + index; 
    const isCompleted = userProgress > globalIndex;
    const isLocked = userProgress < globalIndex;

    const [hovered, setHovered] = useState(false);
    useCursor(hovered && !isLocked);

    const { position, rotation, speed } = useMemo(() => {
        // MOBILE FIX: Tighten angle spread on mobile
        const angle = index * (isMobile ? 1.1 : 0.9); 
        
        // MOBILE FIX: Reduce radius on mobile (3.5), keep Desktop large (6)
        const baseRadius = isMobile ? 3.5 : 6;
        const radiusIncrement = isMobile ? 0.4 : 0.8;
        
        const radius = baseRadius + index * radiusIncrement;
        return {
            // MOBILE FIX: Increase vertical spread on mobile to use screen height
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

    const colorMap = { 'Revision': 0xFCD34D, 'Easy': 0x2DD4BF, 'Medium': 0x3B82F6, 'Hard': 0xEC4899 }; 
    let currentColor = colorMap[lesson.difficulty] || 0x2DD4BF;
    
    if (isLocked) currentColor = 0x475569; 
    if (isCompleted) currentColor = 0x34D399; 

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
                        emissive={!isLocked ? 0xaaaaaa : 0x000000}
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
function PictureAssociation() {
  const navigate = useNavigate();
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const { currentUser, userProgress, totalXP, loading: authLoading } = useAuth();

  // CRITICAL FIX: Default to FALSE so Laptop starts with correct 'Big' view
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    // Determine initial state client-side
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const lessons = useMemo(() => [
    { id: '8', name: 'Vocabulary Revision', description: 'Warm-up with a matching game.', difficulty: 'Revision' },
    { id: '9', name: 'Home Objects', description: 'Learn items around the house.', difficulty: 'Easy' },
    { id: '10', name: 'Kitchen & Dining', description: 'Essentials for cooking and eating.', difficulty: 'Easy' },
    { id: '11', name: 'Living Space & City', description: 'Furniture and city landmarks.', difficulty: 'Medium' },
    { id: '12', name: 'Professions & People', description: 'Learn job titles and people.', difficulty: 'Medium' },
    { id: '13', name: 'Food & Dining', description: 'More delicious food vocabulary.', difficulty: 'Hard' },
    { id: '14', name: 'Travel & Navigation', description: 'Words for getting around.', difficulty: 'Hard' },
  ], []);

  const selectedLesson = selectedLessonIndex !== null ? lessons[selectedLessonIndex] : null;

  const handleStartLesson = () => {
    if (selectedLesson) {
      const globalLessonIndex = 7 + selectedLessonIndex; 
      navigate(`/lesson/${selectedLesson.id}`, {
        state: { lessonIndex: globalLessonIndex } 
      });
    }
  };

  const getLessonStatus = (index) => {
    const globalIndex = 7 + index; 
    if (userProgress > globalIndex) return 'completed';
    if (userProgress === globalIndex) return 'unlocked';
    return 'locked';
  };

   if (authLoading || userProgress === null) {
     return (
       <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
         <div className="text-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
           <p>Loading Phase 2...</p>
         </div>
       </div>
     );
   }

  // CAMERA LOGIC
  // If isMobile is TRUE: Zoom way out (Z=32) so phone users see everything
  // If isMobile is FALSE (Laptop): Keep normal zoom (Z=15) so it looks big and nice
  const cameraSettings = isMobile
    ? { position: [0, 0, 32], fov: 65 }
    : { position: [0, 0, 15], fov: 75 };

  // Shrink the central planet only on mobile
  const planetScale = isMobile ? 0.6 : 1;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f3638] via-[#020617] to-black text-white">
      
      <Canvas
        camera={cameraSettings}
        className="absolute inset-0"
        onPointerMissed={() => setSelectedLessonIndex(null)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        
        <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={150} scale={25} size={2} speed={0.4} opacity={0.4} color="#2dd4bf" />

        {/* --- DECORATIVE BACKGROUND PLANETS --- */}
        {/* Adjusted positions for mobile to avoid overlap */}
        <RingPlanet 
            position={isMobile ? [-12, 12, -30] : [-18, 6, -25]} 
            size={3.5} 
            color="#5b21b6" 
            ringColor="#a78bfa" 
        />

        <DetailedMoon 
            position={isMobile ? [12, -12, -25] : [14, -5, -20]} 
            size={2} 
            baseColor="#1e3a8a" 
            spotColor="#3b82f6" 
        />

        <DetailedMoon 
            position={[10, 10, -30]} 
            size={1} 
            baseColor="#0f766e" 
            spotColor="#14b8a6" 
        />

        {/* Pass Scale to Planet */}
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
            {/* FIX: Hide text on mobile to create space */}
            <span className="hidden md:block text-lg sm:text-2xl font-bold text-white">NeuroSwitch</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
             {/* FIX: Smaller badge text/padding on mobile */}
             <div className="bg-cyan-900/50 border border-cyan-500/30 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full whitespace-nowrap">
                <span className="text-[10px] sm:text-sm font-bold text-cyan-300 uppercase tracking-wider">Phase 2</span>
             </div>

            <div className="text-right">
              {/* FIX: Truncate long names on mobile */}
              <p className="font-semibold text-xs sm:text-sm max-w-[80px] sm:max-w-none truncate">
                {currentUser?.name || 'Player'}
              </p>
              <p className="text-[10px] sm:text-xs text-cyan-400 font-bold">
                XP: {totalXP !== null ? totalXP.toLocaleString() : '...'}
              </p>
            </div>
             
             <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=06b6d4&color=fff`} 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-cyan-400 flex-shrink-0" 
              alt="User Avatar" 
            />
          </div>
        </header>

        <main className="flex-grow flex flex-col justify-end items-center text-center pb-4 sm:pb-8">
          <div
            className={`glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-[95%] sm:max-w-md md:max-w-lg mb-4 sm:mb-8 transition-all duration-300 ease-out border-cyan-500/30 bg-slate-900/80
              ${selectedLesson ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-5 pointer-events-none'}`}
          >
            {selectedLesson && (
              <>
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-100 text-left leading-tight">
                    {selectedLesson.name}
                  </h2>
                  {getLessonStatus(selectedLessonIndex) === 'completed' && (
                    <FaCheck className="text-emerald-400 text-xl sm:text-2xl flex-shrink-0 ml-3 mt-1" />
                  )}
                </div>
                <p className="text-gray-300 text-sm sm:text-base mt-1 sm:mt-2 text-left mb-4 sm:mb-5">{selectedLesson.description}</p>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                    <button
                        onClick={handleStartLesson}
                        className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105 text-base shadow-lg hover:shadow-cyan-500/20"
                    >
                    {getLessonStatus(selectedLessonIndex) === 'completed' ? 'Replay Mission' : 'Start Mission'}
                    </button>
                </div>
              </>
            )}
          </div>
          {!selectedLesson && !isHovering && (
             <p className="text-cyan-200/70 text-base sm:text-lg animate-pulse">
              Select a Phase 2 mission to begin.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default PictureAssociation;