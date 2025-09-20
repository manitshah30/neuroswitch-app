import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function Step1_FlipCard({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNextCard = () => {
    setIsFlipped(false); // This correctly resets the card to its front face
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false); // This correctly resets the card to its front face
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };
  
  const currentCard = data[currentIndex];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-80 h-48 perspective-1000">
        <div
          className={`flip-card w-full h-full ${isFlipped ? 'flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="flip-card-inner relative w-full h-full text-center">
            
            {/* --- THIS IS THE FIX --- */}

            {/* Front of Card (NOW English) */}
            <div className="flip-card-front absolute w-full h-full bg-slate-700 border border-slate-600 rounded-lg flex flex-col justify-center items-center p-4 cursor-pointer">
              <p className="text-sm text-gray-400">English</p>
              <h3 className="text-4xl font-bold my-2">{currentCard.english}</h3>
              <p className="text-sm text-gray-400">Click to flip</p>
            </div>
            
            {/* Back of Card (NOW Spanish) */}
            <div className="flip-card-back absolute w-full h-full bg-slate-800 border border-slate-600 rounded-lg flex flex-col justify-center items-center p-4 cursor-pointer">
              <p className="text-sm text-gray-400">Spanish</p>
              <h3 className="text-4xl font-bold my-2">{currentCard.spanish}</h3>
              <p className="text-sm text-gray-400">Click to flip</p>
            </div>

          </div>
        </div>
      </div>
      
      {/* Card Navigation */}
      <div className="flex items-center gap-8 mt-6">
        <button onClick={handlePrevCard} className="p-3 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors"><FaArrowLeft /></button>
        <span className="font-semibold">{currentIndex + 1} / {data.length}</span>
        <button onClick={handleNextCard} className="p-3 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors"><FaArrowRight /></button>
      </div>
    </div>
  );
}

export default Step1_FlipCard;

