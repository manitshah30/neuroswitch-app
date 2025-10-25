import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// CSS (remains the same)
const flipCardCSS = `
.perspective-1000 { perspective: 1000px; }
.flip-card { transform-style: preserve-3d; transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1); }
.flip-card-inner { position: relative; width: 100%; height: 100%; text-align: center; transform-style: preserve-3d; }
.flip-card.flipped .flip-card-inner { transform: rotateY(180deg); }
.flip-card-front, .flip-card-back {
    position: absolute; width: 100%; height: 100%;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 1rem; cursor: pointer; border-radius: 1rem; overflow: hidden;
    border: 1px solid; transition: all 0.3s ease;
}
@media (min-width: 640px) { .flip-card-front, .flip-card-back { padding: 2rem; } }
.flip-card-back { transform: rotateY(180deg); }
`;

// NEW: Accept onStepComplete prop
function Step1_FlipCard({ data, onAnswer, onStepComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const performanceRef = useRef();

  // --- Logic for reporting performance (mostly the same) ---
  useEffect(() => {
    performanceRef.current = { currentIndex, flipCount, onAnswer, data };
  });
  useEffect(() => {
    return () => {
      const { currentIndex, flipCount, onAnswer, data } = performanceRef.current || {};
      if (onAnswer && flipCount > 0 && data && data[currentIndex]) {
        onAnswer({ type: 'flipCard', word: data[currentIndex].english, flipCount: flipCount });
      }
    };
  }, []);
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = flipCardCSS;
    document.head.appendChild(styleElement);
    return () => { document.head.removeChild(styleElement); };
  }, []);

  // --- NEW: Effect to report completion status ---
  useEffect(() => {
    // Determine if the current card is the last one
    const isLastCard = currentIndex === data.length - 1;
    // Call the callback from the parent to report status
    if (onStepComplete) {
      onStepComplete(isLastCard);
    }
    // Rerun whenever the index changes
  }, [currentIndex, data.length, onStepComplete]);
  // --- END NEW ---


  const handleFlip = () => {
     setIsFlipped(!isFlipped);
     setFlipCount(prev => prev + 1);
  };
  const reportCurrentCardPerformance = () => {
     if (onAnswer && flipCount > 0 && data && data[currentIndex]) {
       onAnswer({
         type: 'flipCard',
         word: data[currentIndex].english,
         flipCount: flipCount,
       });
     }
  };

  // --- UPDATED Navigation handlers to also trigger completion check ---
  const handleNextCard = () => {
    reportCurrentCardPerformance();
    setIsFlipped(false); setFlipCount(0);
    // Use modulo for wrapping, but state update triggers useEffect check
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };
  const handlePrevCard = () => {
    reportCurrentCardPerformance();
    setIsFlipped(false); setFlipCount(0);
     // Use modulo for wrapping, but state update triggers useEffect check
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };
  // --- END UPDATED ---

  // --- Data Validation (remains the same) ---
  if (!Array.isArray(data) || data.length === 0) {
      return <div className="text-red-400">Error: No card data found.</div>;
  }
  const currentCard = data[currentIndex];
  if (!currentCard) {
      console.error("Invalid current card index:", currentIndex);
      return <div className="text-red-400">Error: Could not load card.</div>;
  }
  // --- End Data Validation ---


  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-0">
      {/* Card container (remains same) */}
      <div className="relative w-full max-w-[300px] h-[200px] sm:max-w-[420px] sm:w-[420px] sm:h-[260px] perspective-1000 mb-6 sm:mb-8 group">
         {/* Card Content */}
         <div
          className={`flip-card w-full h-full ${isFlipped ? 'flipped' : ''} transition-transform duration-700 ease-in-out group-hover:scale-[1.03]`}
          onClick={handleFlip}
        >
          <div className="flip-card-inner relative w-full h-full text-center shadow-2xl rounded-xl">
            {/* Front Face */}
            <div className="flip-card-front bg-gradient-to-br from-purple-900 via-slate-800 to-indigo-900 backdrop-blur-sm border-purple-600/50 text-white hover:border-purple-400/80 hover:shadow-[0_0_20px_rgba(192,132,252,0.4)]">
              <p className="text-xs sm:text-sm font-medium text-purple-300 tracking-wider uppercase mb-1 opacity-80">English</p>
              <h3 className="text-4xl sm:text-5xl font-bold my-1 sm:my-2 text-white drop-shadow-sm">{currentCard.english}</h3>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3 opacity-70">(Click to flip)</p>
            </div>
            {/* Back Face */}
            <div className="flip-card-back bg-gradient-to-br from-indigo-900 via-slate-800 to-blue-900 backdrop-blur-sm border-blue-600/50 text-white hover:border-blue-400/80 hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]">
              <div className="transform [-scale-x-100]">
                <p className="text-xs sm:text-sm font-medium text-blue-300 tracking-wider uppercase mb-1 opacity-80">Spanish</p>
                <h3 className="text-4xl sm:text-5xl font-bold my-1 sm:my-2 text-white drop-shadow-sm">{currentCard.spanish}</h3>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3 opacity-70">(Click to flip)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Navigation (remains same) */}
      <div className="flex items-center justify-between w-full max-w-xs sm:max-w-md mt-4 sm:mt-6">
        <button
            onClick={handlePrevCard}
            className="p-3 px-4 sm:p-4 sm:px-6 bg-gradient-to-br from-purple-700 to-indigo-700 rounded-full text-white text-lg sm:text-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            aria-label="Previous card"
        >
            <FaArrowLeft />
        </button>
        <span className="font-semibold text-lg sm:text-xl text-gray-300 tracking-wide">{currentIndex + 1} / {data.length}</span>
        <button
            onClick={handleNextCard}
            className="p-3 px-4 sm:p-4 sm:px-6 bg-gradient-to-br from-indigo-700 to-blue-700 rounded-full text-white text-lg sm:text-xl hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            aria-label="Next card"
        >
            <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

export default Step1_FlipCard;

