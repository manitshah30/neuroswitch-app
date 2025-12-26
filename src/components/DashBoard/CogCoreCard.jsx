import React, { useMemo } from 'react';
import CognitiveCoreAnimation from './CognitiveCoreAnimation.jsx';
import { useAuth } from '../../context/AuthContext.jsx'; 

function CogCoreCard() {
  const { userProgress } = useAuth();

  // Determinar Fase basado en el ID de la Lección
  const currentPhase = useMemo(() => {
    // Si no hay progreso (carga o nuevo usuario), por defecto Fase 1
    if (!userProgress) return 1;
    
    // Lógica:
    // Fase 4 comienza en Lección 22 (Modo Historia)
    if (userProgress >= 22) return 4;
    // Fase 3 comienza en Lección 15 (Audio)
    if (userProgress >= 15) return 3;
    // Fase 2 comienza en Lección 8 (Visual)
    if (userProgress >= 8) return 2;
    
    return 1;
  }, [userProgress]);

  // Contenido para cada fase
  const phaseInfo = {
    1: { title: "Neural Formation", color: "text-purple-400", glow: "bg-purple-600", desc: "Building vocabulary connections." },
    2: { title: "Visual Synthesis", color: "text-cyan-400", glow: "bg-cyan-500", desc: "Mapping images to language." },
    3: { title: "Auditory Resonance", color: "text-rose-400", glow: "bg-rose-600", desc: "Tuning ear for recognition." },
    4: { title: "Syntactic Mastery", color: "text-amber-400", glow: "bg-amber-500", desc: "Constructing complex scenarios." }
  };

  // Asegura que siempre haya info, incluso si la fase no coincide exactamente
  const info = phaseInfo[currentPhase] || phaseInfo[1];

  return (
    <div className={`bg-slate-800/40 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-2xl flex flex-col items-center justify-center h-full w-full relative overflow-hidden group`}>
      
      {/* Encabezado */}
      <div className="z-10 text-center mb-2">
        <h2 className="text-2xl font-bold text-white">Cognitive Core</h2>
        <p className={`text-sm font-medium ${info.color} uppercase tracking-wider`}>
            Phase {currentPhase}: {info.title}
        </p>
      </div>
      
      {/* Canvas 3D */}
      <div className="w-full h-64 relative z-10">
        <CognitiveCoreAnimation phase={currentPhase} />
      </div>

      {/* Resplandor de Fondo Dinámico */}
      <div className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none transition-colors duration-1000 ${info.glow}`}></div>

      <p className="text-gray-400 text-xs text-center mt-2 z-10">{info.desc}</p>
    </div>
  );
}

export default CogCoreCard;