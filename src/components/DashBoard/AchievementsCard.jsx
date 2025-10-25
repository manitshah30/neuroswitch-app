import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaLock } from 'react-icons/fa';

// --- Define ALL Possible Achievements with SVGs ---
const ALL_ACHIEVEMENTS_CONFIG = [
  { id: 'lesson1', name: 'First Steps', description: 'Complete your first lesson.',
    // Store Tailwind class instead of hex
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>,
    achievedClass: 'text-yellow-400' },
  { id: 'phase1', name: 'Phase 1 Complete', description: 'Complete all 7 lessons.',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 4.517 1.48-8.279-6.064-5.828 8.332-1.151z"/></svg>,
    achievedClass: 'text-purple-400' },
  { id: 'xp100', name: 'XP Explorer', description: 'Reach 100 Total XP.',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M7 21H17V19H7V21M17 3H7V1H17V3M16 11V5H8V11L5 14V17H19V14L16 11Z"/></svg>,
    achievedClass: 'text-blue-400' },
  { id: 'xp500', name: 'XP Adept', description: 'Reach 500 Total XP.',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>,
    achievedClass: 'text-green-400' },
  { id: 'xp1000', name: 'XP Master', description: 'Reach 1000 Total XP.',
    svg: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>,
    achievedClass: 'text-orange-400' },
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
  // Determine the CSS class based on earned status
  const displayClass = earned ? config.achievedClass : "text-gray-500"; 

  return (
    <div className="flex flex-col items-center gap-2 p-2 w-32 text-center" title={config.description}>
      <div className="w-16 h-16 relative">
        {/* Apply the Tailwind class to the SVG element */}
        <SvgIcon className={displayClass} /> 
        {!earned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <FaLock className="text-gray-400 text-2xl" />
          </div>
        )}
      </div>
      <p className={`font-semibold text-sm ${earned ? 'text-gray-200' : 'text-gray-500'}`}>{config.name}</p>
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
     // Stop at the last page
    if (nextIndex < ALL_ACHIEVEMENTS_CONFIG.length) {
      setCurrentIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - itemsPerPage);
    // Stop at the first page
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
    }
  };

  // Determine if buttons should be disabled 
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex + itemsPerPage < ALL_ACHIEVEMENTS_CONFIG.length;


  return (
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-6 text-center">Achievements</h3>
      
      <div className="flex-grow flex items-center justify-center relative">
        {/* Previous Button */}
        <button 
            onClick={handlePrev} 
            disabled={!canGoPrev}
            className={`absolute left-0 p-2 text-gray-400 hover:text-white transition-colors z-10 ${!canGoPrev ? 'opacity-30 cursor-not-allowed' : ''}`}
            aria-label="Previous achievements"
        >
          <FaChevronLeft size={24} />
        </button>

        {/* Achievements Display Area */}
        <div className="flex justify-center items-center gap-4 overflow-hidden">
          {displayedConfigs.map(config => (
            <AchievementItem 
              key={config.id}
              config={config}
              earned={earnedIds.has(config.id)} 
            />
          ))}
          {/* Add placeholder items if the last page isn't full */}
          {displayedConfigs.length < itemsPerPage && Array(itemsPerPage - displayedConfigs.length).fill(null).map((_, index) => (
             <div key={`placeholder-${index}`} className="w-32 p-2"></div> 
          ))}
        </div>

        {/* Next Button */}
        <button 
            onClick={handleNext} 
            disabled={!canGoNext}
            className={`absolute right-0 p-2 text-gray-400 hover:text-white transition-colors z-10 ${!canGoNext ? 'opacity-30 cursor-not-allowed' : ''}`}
            aria-label="Next achievements"
        >
          <FaChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

export default AchievementsCard;

