import React, { useState, useEffect } from 'react';
import { FaVolumeUp, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

function Step_AudioExposure({ data, onStepComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play audio when slide changes (optional, but good for immersion)
  useEffect(() => {
    // Optional: playAudio(); 
  }, [currentIndex]);

  const currentItem = data[currentIndex];

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(currentItem.spanish);
      utterance.lang = 'es-ES'; // Spanish (Spain) or 'es-MX' for Mexico
      utterance.rate = 0.9; // Slightly slower for clarity
      
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Your browser does not support text-to-speech.");
    }
  };

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onStepComplete(true); // Unlock "Next" button in LessonPage
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Calculate Progress
  const progress = ((currentIndex + 1) / data.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 text-center">
      
      {/* Progress Indicator */}
      <div className="mb-8 w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
        <div 
            className="h-full bg-cyan-400 transition-all duration-300" 
            style={{ width: `${progress}%` }}
        ></div>
      </div>

      <h2 className="text-xl sm:text-2xl text-cyan-200 mb-2 font-light tracking-wide">
        Listen & Learn
      </h2>
      
      {/* Main Card */}
      <div className="glass-card bg-slate-800/60 border-cyan-500/30 p-8 sm:p-12 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-xl flex flex-col items-center gap-6 relative overflow-hidden group">
        
        {/* Decorative Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Audio Button */}
        <button 
            onClick={playAudio}
            className={`relative z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-4xl sm:text-5xl transition-all duration-300
                ${isPlaying 
                    ? 'bg-cyan-400 text-slate-900 scale-110 shadow-[0_0_40px_rgba(34,211,238,0.6)]' 
                    : 'bg-slate-700 text-cyan-400 hover:bg-slate-600 hover:scale-105 shadow-xl'
                }`}
        >
            <FaVolumeUp className={isPlaying ? 'animate-pulse' : ''} />
        </button>

        <p className="text-sm text-gray-400 mt-2">Tap to listen</p>

        {/* Text Content */}
        <div className="mt-4 space-y-2">
            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
                {currentItem.spanish}
            </h1>
            <p className="text-xl sm:text-2xl text-cyan-300/80 font-medium">
                {currentItem.english}
            </p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-8 px-4">
        <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            className="p-3 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
        >
            <FaArrowLeft size={24} />
        </button>

        <span className="text-slate-500 font-mono text-sm">
            {currentIndex + 1} / {data.length}
        </span>

        <button 
            onClick={handleNext} 
            className={`p-3 rounded-full transition-all duration-300 flex items-center gap-2
                ${currentIndex === data.length - 1 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 px-6' 
                    : 'text-white hover:text-cyan-300'
                }`}
        >
            {currentIndex === data.length - 1 ? 'Finish' : <FaArrowRight size={24} />}
        </button>
      </div>

    </div>
  );
}

export default Step_AudioExposure;