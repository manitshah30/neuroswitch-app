import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';

// Helper to shuffle the grid
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const PictureMatchingBoard = ({ data, onAnswer, onStepComplete }) => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  // Initialize Board
  useEffect(() => {
    if (!data) return;
    setStartTime(Date.now());

    const gameItems = [];
    data.forEach((item, index) => {
      // Create Card 1: The Image
      gameItems.push({
        id: `img-${index}`,
        pairId: item.id || index, // Use database ID if available
        type: 'image',
        content: item.imageUrl, 
        alt: item.english 
      });
      // Create Card 2: The Word
      gameItems.push({
        id: `word-${index}`,
        pairId: item.id || index,
        type: 'word',
        content: item.spanish
      });
    });

    setItems(shuffleArray(gameItems));
  }, [data]);

  // Handle Card Click
  const handleCardClick = (item) => {
    if (isProcessing || matchedPairs.includes(item.pairId) || selectedItems.find(i => i.id === item.id)) {
      return;
    }

    const newSelection = [...selectedItems, item];
    setSelectedItems(newSelection);

    // Check for Match
    if (newSelection.length === 2) {
      setIsProcessing(true);
      const [first, second] = newSelection;
      const isMatch = first.pairId === second.pairId;
      const reactionTime = (Date.now() - startTime) / 1000;

      // Report Action for Scoring
      if (onAnswer) {
        onAnswer({
            type: 'pictureMatch', // New type for scoringUtils
            isCorrect: isMatch,
            reactionTime: reactionTime
        });
      }

      if (isMatch) {
        setTimeout(() => {
          setMatchedPairs(prev => {
              const newPairs = [...prev, first.pairId];
              // Check if ALL pairs are found
              // (items.length is total cards, so pairs = items.length / 2)
              if (newPairs.length === (items.length / 2)) {
                  onStepComplete(true);
              }
              return newPairs;
          });
          setSelectedItems([]);
          setIsProcessing(false);
          setStartTime(Date.now()); // Reset timer for next move
        }, 500);
      } else {
        setTimeout(() => {
          setSelectedItems([]);
          setIsProcessing(false);
        }, 800);
      }
    }
  };

  // --- CYAN THEME STYLING ---
  const getCardStyle = (item) => {
    const isSelected = selectedItems.find(i => i.id === item.id);
    const isMatched = matchedPairs.includes(item.pairId);
    
    // Base: Dark Teal/Slate background
    let base = "relative aspect-square rounded-xl cursor-pointer transition-all duration-300 transform border-2 flex items-center justify-center p-2 shadow-lg ";
    
    // Matched State: Dimmed Teal with Green Check
    if (isMatched) return base + "bg-teal-900/40 border-teal-500/50 scale-95 opacity-60 cursor-default";
    
    // Selected State
    if (isSelected) {
      if (selectedItems.length === 2) {
         const isMatch = selectedItems[0].pairId === selectedItems[1].pairId;
         // Success vs Error Glow
         return base + (isMatch 
            ? "bg-teal-600/40 border-teal-400 scale-105 shadow-[0_0_15px_rgba(45,212,191,0.5)]" 
            : "bg-red-500/40 border-red-400 shake shadow-[0_0_15px_rgba(248,113,113,0.5)]");
      }
      // First selection
      return base + "bg-cyan-600/40 border-cyan-400 scale-105 shadow-[0_0_15px_rgba(34,211,238,0.5)]";
    }

    // Default State: Glassy Slate with Cyan Hover
    return base + "bg-slate-800/60 border-slate-700 hover:bg-slate-700 hover:border-cyan-500/50 hover:shadow-cyan-500/20";
  };

  if (!data || data.length === 0) return <div className="text-cyan-200">Loading Game...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto px-2">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-cyan-400 mb-6 drop-shadow-md">
        Match the Pictures
      </h2>

      {/* Grid: 3 cols on mobile, 4-5 cols on desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
        {items.map((item) => (
          <div key={item.id} onClick={() => handleCardClick(item)} className={getCardStyle(item)}>
            
            {/* Render Image or Text */}
            {item.type === 'image' ? (
               item.content ? (
                 <img src={item.content} alt={item.alt} className="w-full h-full object-cover rounded-lg" />
               ) : (
                 <span className="text-3xl">🖼️</span> 
               )
            ) : (
               <span className="text-cyan-100 font-bold text-sm sm:text-lg text-center break-words leading-tight">
                 {item.content}
               </span>
            )}

            {/* Checkmark Overlay */}
            {matchedPairs.includes(item.pairId) && (
                <div className="absolute top-1 right-1 bg-teal-500 text-white rounded-full p-1 shadow-sm">
                  <FaCheck size={10} />
                </div>
            )}
          </div>
        ))}
      </div>

      {/* Shake Animation Style */}
      <style>{`
        @keyframes shake { 0%, 100% {transform: translateX(0);} 25% {transform: translateX(-4px);} 75% {transform: translateX(4px);} } 
        .shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default PictureMatchingBoard;