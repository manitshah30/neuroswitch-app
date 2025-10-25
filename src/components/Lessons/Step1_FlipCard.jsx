import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// CSS for the 3D flip effect - Ensure this is robust
const flipCardCSS = `
.perspective-1000 { perspective: 1000px; }
.flip-card { transform-style: preserve-3d; transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1); } /* Smoother transition */
.flip-card-inner { position: relative; width: 100%; height: 100%; text-align: center; transform-style: preserve-3d; }
.flip-card.flipped .flip-card-inner { transform: rotateY(180deg); }
.flip-card-front, .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden; /* Safari */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    cursor: pointer;
    border-radius: 1rem; /* rounded-xl */
    overflow: hidden; /* Ensure gradients don't leak */
    border: 1px solid; /* Add base border */
    transition: all 0.3s ease; /* Transition for hover effects */
}
.flip-card-back { transform: rotateY(180deg); }
`;

function Step1_FlipCard({ data, onAnswer }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const performanceRef = useRef();

  // --- Logic for reporting performance (remains the same) ---
  useEffect(() => {
    performanceRef.current = { currentIndex, flipCount, onAnswer, data };
  });
  useEffect(() => {
    return () => {
      const { currentIndex, flipCount, onAnswer, data } = performanceRef.current || {};
      if (onAnswer && flipCount > 0 && data && data[currentIndex]) {
        onAnswer({
          type: 'flipCard',
          word: data[currentIndex].english,
          flipCount: flipCount,
        });
      }
    };
  }, []);
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = flipCardCSS;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
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
  const handleNextCard = () => {
    reportCurrentCardPerformance();
    setIsFlipped(false); setFlipCount(0);
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };
  const handlePrevCard = () => {
    reportCurrentCardPerformance();
    setIsFlipped(false); setFlipCount(0);
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };
  // --- End of logic ---


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
    <div className="w-full flex flex-col items-center">
      {/* Card container - Adjusted size, added shadow */}
      <div className="relative w-[420px] h-[260px] perspective-1000 mb-8 group">
        <div
          className={`flip-card w-full h-full ${isFlipped ? 'flipped' : ''} transition-transform duration-700 ease-in-out group-hover:scale-[1.03]`} // Added ease-in-out
          onClick={handleFlip}
        >
          <div className="flip-card-inner relative w-full h-full text-center shadow-2xl rounded-xl">

            {/* --- NEW STYLING FOR FRONT FACE --- */}
            <div className="flip-card-front bg-gradient-to-br from-purple-900 via-slate-800 to-indigo-900 
                            backdrop-blur-sm border-purple-600/50 text-white 
                            hover:border-purple-400/80 hover:shadow-[0_0_20px_rgba(192,132,252,0.4)]">
              <p className="text-sm font-medium text-purple-300 tracking-wider uppercase mb-1 opacity-80">English</p>
              <h3 className="text-5xl font-bold my-2 text-white drop-shadow-sm">{currentCard.english}</h3>
              <p className="text-xs text-gray-400 mt-3 opacity-70">(Click to flip)</p>
            </div>
            {/* --- END NEW STYLING --- */}

            {/* --- NEW STYLING FOR BACK FACE --- */}
            <div className="flip-card-back bg-gradient-to-br from-indigo-900 via-slate-800 to-blue-900 
                            backdrop-blur-sm border-blue-600/50 text-white 
                            hover:border-blue-400/80 hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]">
              {/* Counter-transform applied to inner content */}
              <div className="transform [-scale-x-100]"> {/* Use scale to flip content back */}
                <p className="text-sm font-medium text-blue-300 tracking-wider uppercase mb-1 opacity-80">Spanish</p>
                <h3 className="text-5xl font-bold my-2 text-white drop-shadow-sm">{currentCard.spanish}</h3>
                <p className="text-xs text-gray-400 mt-3 opacity-70">(Click to flip)</p>
              </div>
            </div>
            {/* --- END NEW STYLING --- */}
          </div>
        </div>
      </div>

      {/* Card Navigation - Keeping the improved gradient buttons */}
      <div className="flex items-center justify-between w-full max-w-lg mt-4">
        <button
            onClick={handlePrevCard}
            className="p-4 px-6 bg-gradient-to-br from-purple-700 to-indigo-700 rounded-full text-white text-xl 
                       hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 
                       shadow-lg hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            disabled={currentIndex === 0}
            aria-label="Previous card"
        >
            <FaArrowLeft />
        </button>
        <span className="font-semibold text-xl text-gray-300 tracking-wide">{currentIndex + 1} / {data.length}</span>
        <button
            onClick={handleNextCard}
            className="p-4 px-6 bg-gradient-to-br from-indigo-700 to-blue-700 rounded-full text-white text-xl 
                       hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 
                       shadow-lg hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            disabled={currentIndex === data.length - 1}
            aria-label="Next card"
        >
            <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

export default Step1_FlipCard;

