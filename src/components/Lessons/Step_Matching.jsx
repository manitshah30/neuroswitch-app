import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';

function Step_MatchColumn({ data, onAnswer, onStepComplete }) {
  const [leftCol, setLeftCol] = useState([]);
  const [rightCol, setRightCol] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isWrong, setIsWrong] = useState(false);

  // Initialize and shuffle columns independently
  useEffect(() => {
    if (!data) return;

    // Prepare Left Column (Spanish)
    const left = data.map((item, index) => ({
      id: `left-${index}`,
      text: item.spanish,
      pairId: item.id // Unique ID to link pairs
    }));

    // Prepare Right Column (English)
    const right = data.map((item, index) => ({
      id: `right-${index}`,
      text: item.english,
      pairId: item.id
    }));

    // Shuffle simple utility
    const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

    setLeftCol(shuffle(left));
    setRightCol(shuffle(right));
  }, [data]);

  // Check for Match
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      // Check if pairIds match
      if (selectedLeft.pairId === selectedRight.pairId) {
        // MATCH!
        const newMatch = selectedLeft.pairId;
        setMatchedPairs(prev => [...prev, newMatch]);
        setSelectedLeft(null);
        setSelectedRight(null);
        
        // Report Progress
        if (onAnswer) onAnswer({ type: 'matchColumn', isCorrect: true });

        // Check Completion
        if (matchedPairs.length + 1 === data.length) {
          onStepComplete(true);
        }
      } else {
        // WRONG!
        setIsWrong(true);
        if (onAnswer) onAnswer({ type: 'matchColumn', isCorrect: false });
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setIsWrong(false);
        }, 800);
      }
    }
  }, [selectedLeft, selectedRight]);

  // --- CYAN THEME STYLING ---
  const getButtonClass = (item, isSelected, side) => {
    const isMatched = matchedPairs.includes(item.pairId);
    
    // Base Style (Glassmorphism + Cyan/Slate)
    let base = "w-full p-4 rounded-xl border-2 font-semibold text-lg transition-all duration-300 flex items-center justify-between ";
    
    if (isMatched) {
      return base + "bg-teal-500/20 border-teal-500 text-teal-300 opacity-50 cursor-default shadow-none scale-95";
    }

    if (isSelected) {
      if (isWrong) {
        return base + "bg-red-500/20 border-red-500 text-red-200 animate-pulse border-2 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
      }
      // Active Selection (Cyan Glow)
      return base + "bg-cyan-600/30 border-cyan-400 text-white scale-105 shadow-[0_0_20px_rgba(34,211,238,0.4)]";
    }

    // Default State (Dark Slate with Cyan Hover)
    return base + "bg-slate-800/60 border-slate-700 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-700/80 hover:shadow-lg cursor-pointer";
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-cyan-400 mb-8 drop-shadow-md">
        Connect the Pairs
      </h2>

      <div className="flex justify-between gap-8 md:gap-16 relative">
        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col gap-4">
          {leftCol.map(item => (
            <button
              key={item.id}
              onClick={() => !matchedPairs.includes(item.pairId) && setSelectedLeft(item)}
              disabled={matchedPairs.includes(item.pairId)}
              className={getButtonClass(item, selectedLeft?.id === item.id, 'left')}
            >
              <span>{item.text}</span>
              {/* Connector Dot */}
              <div className={`w-3 h-3 rounded-full ${matchedPairs.includes(item.pairId) ? 'bg-teal-500' : 'bg-slate-600'}`}></div>
            </button>
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 flex flex-col gap-4">
          {rightCol.map(item => (
            <button
              key={item.id}
              onClick={() => !matchedPairs.includes(item.pairId) && setSelectedRight(item)}
              disabled={matchedPairs.includes(item.pairId)}
              className={getButtonClass(item, selectedRight?.id === item.id, 'right')}
            >
              {/* Connector Dot */}
              <div className={`w-3 h-3 rounded-full ${matchedPairs.includes(item.pairId) ? 'bg-teal-500' : 'bg-slate-600'}`}></div>
              <span>{item.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Step_MatchColumn;