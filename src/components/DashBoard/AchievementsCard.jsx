import React, { useState } from 'react';

// --- Internal SVG Icons ---
const IconLock = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

const IconChevronLeft = ({ size = 24, className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const IconChevronRight = ({ size = 24, className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

// --- Define ALL Possible Achievements with SVGs ---
const ALL_ACHIEVEMENTS_CONFIG = [
  // --- Getting Started ---
  { id: 'lesson1', name: 'First Steps', description: 'Complete your first lesson.',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>,
    achievedClass: 'text-yellow-400' },
    
  // --- Phase Completion Achievements ---
  { id: 'phase1', name: 'Phase 1 Complete', description: 'Master Vocabulary (Lessons 1-7).',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 4.517 1.48-8.279-6.064-5.828 8.332-1.151z"/></svg>,
    achievedClass: 'text-purple-400' },
    
  { id: 'phase2', name: 'Visual Virtuoso', description: 'Master Visual Association (Lessons 8-14).',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>,
    achievedClass: 'text-cyan-400' },

  { id: 'phase3', name: 'Sonic Sage', description: 'Master Auditory Skills (Lessons 15-21).',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/></svg>,
    achievedClass: 'text-rose-400' },

  { id: 'phase4', name: 'Grandmaster', description: 'Complete Story Mode (Lessons 22-28).',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>,
    achievedClass: 'text-amber-400' },

  // --- XP Milestones ---
  { id: 'xp100', name: 'XP Explorer', description: 'Reach 100 Total XP.',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M7 21H17V19H7V21M17 3H7V1H17V3M16 11V5H8V11L5 14V17H19V14L16 11Z"/></svg>,
    achievedClass: 'text-blue-400' },
  { id: 'xp500', name: 'XP Adept', description: 'Reach 500 Total XP.',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>,
    achievedClass: 'text-green-400' },
  { id: 'xp1000', name: 'XP Master', description: 'Reach 1000 Total XP.',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>,
    achievedClass: 'text-orange-400' },
  { id: 'xp5000', name: 'XP Legend', description: 'Reach 5000 Total XP.',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>,
    achievedClass: 'text-indigo-400' },

  // --- Performance Achievements ---
  { id: 'perfAttention', name: 'Sharp Shooter', description: '100% Attention.',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l1.41-1.41L12 16.17l4.09-4.09L17.5 13.5 12 19 6.5 13.5z"/></svg>,
    achievedClass: 'text-red-400' },
  { id: 'perfMemory', name: 'Memory Whiz', description: '100% Memory.',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14h-2v-2h2zm0-4h-2V7h2z"/></svg>,
    achievedClass: 'text-cyan-400' },
  { id: 'perfSpeed', name: 'Lightning Fast', description: '100% Speed.',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>,
    achievedClass: 'text-lime-400' },
  { id: 'perfPerfect', name: 'Perfectionist', description: '100% in all scores.',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20.5 10 L23 12 L19.5 15.5 L19.5 19.5 L15.5 19.5 L12 23 L8.5 19.5 L4.5 19.5 L4.5 15.5 L1 12 L4.5 8.5 L4.5 4.5 L8.5 4.5 L12 1 L15.5 4.5 L19.5 4.5 L19.5 8.5 Z M10 17 L18 9 L16.59 7.58 L10 14.17 L7.41 11.59 L6 13 L10 17 Z"/></svg>,
    achievedClass: 'text-emerald-400' },
];

// Component to display a single achievement (badge or lock)
const AchievementItem = ({ config, earned }) => {
  const SvgIcon = config.svg;
  const displayClass = earned ? config.achievedClass : "text-gray-500"; 

  return (
    // FIX: Changed width to w-20 for mobile, w-32 for tablet/desktop
    <div className="flex flex-col items-center gap-1 sm:gap-2 p-1 sm:p-2 w-20 sm:w-32 text-center group relative" title={config.description}>
      
      {/* FIX: Smaller Icon Container on Mobile (w-10 h-10 vs w-16 h-16) */}
      <div className={`w-10 h-10 sm:w-16 sm:h-16 relative transition-transform duration-300 ${earned ? 'group-hover:scale-110' : ''}`}>
        <SvgIcon className={displayClass} /> 
        {!earned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full backdrop-blur-[1px]">
            <IconLock className="text-gray-400 text-xs sm:text-xl" />
          </div>
        )}
      </div>
      
      {/* FIX: Smaller Text on Mobile (text-[9px] vs text-sm) and leading-tight to prevent overlap */}
      <p className={`font-semibold text-[9px] sm:text-sm leading-tight ${earned ? 'text-gray-200' : 'text-gray-500'}`}>{config.name}</p>
      
      {/* Tooltip on hover */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 sm:w-40 bg-slate-900 text-[10px] sm:text-xs text-gray-300 p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-slate-700 shadow-xl hidden sm:block">
        {config.description}
      </div>
    </div>
  );
};

// Main Card Component with Carousel
function AchievementsCard({ achievements = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3; 

  const earnedIds = new Set(achievements.map(a => a.id));
  const displayedConfigs = ALL_ACHIEVEMENTS_CONFIG.slice(currentIndex, currentIndex + itemsPerPage);

  const handleNext = () => {
    const nextIndex = (currentIndex + itemsPerPage);
    if (nextIndex < ALL_ACHIEVEMENTS_CONFIG.length) {
      setCurrentIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - itemsPerPage);
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
    }
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex + itemsPerPage < ALL_ACHIEVEMENTS_CONFIG.length;

  return (
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 p-4 sm:p-6 rounded-2xl shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
         <h3 className="text-lg sm:text-xl font-bold text-white">Achievements</h3>
         <span className="text-[10px] sm:text-xs text-gray-400 font-mono bg-slate-900/50 px-2 py-1 rounded-md border border-slate-700">
            {achievements.length} / {ALL_ACHIEVEMENTS_CONFIG.length} Unlocked
         </span>
      </div>
      
      {/* FIX: Adjusted padding (px-6 mobile) and gap (gap-1 mobile) */}
      <div className="flex-grow flex items-center justify-center relative px-6 sm:px-8">
        
        {/* Previous Button */}
        <button 
            onClick={handlePrev} 
            disabled={!canGoPrev}
            className={`absolute left-0 p-1 sm:p-2 text-gray-400 hover:text-white transition-colors z-10 ${!canGoPrev ? 'opacity-20 cursor-not-allowed' : ''}`}
            aria-label="Previous achievements"
        >
          <IconChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Achievements Display Area */}
        <div className="flex justify-center items-start gap-1 sm:gap-6 overflow-hidden w-full">
          {displayedConfigs.map(config => (
            <AchievementItem 
              key={config.id}
              config={config}
              earned={earnedIds.has(config.id)} 
            />
          ))}
          {/* Add placeholder items if the last page isn't full (adjusted width for placeholder too) */}
          {displayedConfigs.length < itemsPerPage && Array(itemsPerPage - displayedConfigs.length).fill(null).map((_, index) => (
             <div key={`placeholder-${index}`} className="w-20 sm:w-32"></div> 
          ))}
        </div>

        {/* Next Button */}
        <button 
            onClick={handleNext} 
            disabled={!canGoNext}
            className={`absolute right-0 p-1 sm:p-2 text-gray-400 hover:text-white transition-colors z-10 ${!canGoNext ? 'opacity-20 cursor-not-allowed' : ''}`}
            aria-label="Next achievements"
        >
          <IconChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}

export default AchievementsCard;