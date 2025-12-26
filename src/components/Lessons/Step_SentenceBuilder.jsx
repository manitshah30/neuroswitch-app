import React, { useState, useEffect } from 'react';
import { FaCheck, FaUndo } from 'react-icons/fa';

// Helper to shuffle array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function Step_SentenceBuilder({ data, onStepComplete, onAnswer }) { // <--- Added onAnswer prop
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [wordBank, setWordBank] = useState([]);
  const [filledBlanks, setFilledBlanks] = useState([]);
  const [wrongAnimation, setWrongAnimation] = useState(false);
  
  // NEW: Timer State
  const [startTime, setStartTime] = useState(Date.now());

  const currentTask = data[currentSentenceIndex];

  useEffect(() => {
    if (!currentTask) return;
    setFilledBlanks(new Array(currentTask.correctAnswers.length).fill(null));
    setWordBank(shuffleArray([...currentTask.options]));
    setStartTime(Date.now()); // Reset timer on new sentence
  }, [currentSentenceIndex, currentTask]);

  const handleWordClick = (word) => {
    const nextBlankIndex = filledBlanks.findIndex(val => val === null);
    if (nextBlankIndex === -1) return;

    const correctWordForThisBlank = currentTask.correctAnswers[nextBlankIndex];
    
    // NEW: Calculate Reaction Time
    const timeTaken = (Date.now() - startTime) / 1000;

    if (word === correctWordForThisBlank) {
      // --- CORRECT ---
      const newFilled = [...filledBlanks];
      newFilled[nextBlankIndex] = word;
      setFilledBlanks(newFilled);

      setWordBank(prev => {
        const idx = prev.indexOf(word);
        if (idx > -1) {
          const newBank = [...prev];
          newBank.splice(idx, 1);
          return newBank;
        }
        return prev;
      });

      // REPORT SUCCESS
      if (onAnswer) {
          onAnswer({ type: 'sentenceBuilder', isCorrect: true, reactionTime: timeTaken });
      }
      setStartTime(Date.now()); // Reset timer for next word

      // Check Completion
      if (nextBlankIndex === currentTask.correctAnswers.length - 1) {
        setTimeout(() => {
            if (currentSentenceIndex < data.length - 1) {
                setCurrentSentenceIndex(prev => prev + 1);
            } else {
                onStepComplete(true);
            }
        }, 1000);
      }

    } else {
      // --- WRONG ---
      setWrongAnimation(true);
      setTimeout(() => setWrongAnimation(false), 500);

      // REPORT MISTAKE
      if (onAnswer) {
          onAnswer({ type: 'sentenceBuilder', isCorrect: false, reactionTime: timeTaken });
      }
    }
  };

  const renderSentence = () => {
    return (
      <div className="flex flex-wrap items-baseline gap-2 text-xl sm:text-2xl font-medium leading-loose text-amber-100 justify-center">
        {currentTask.sentenceParts.map((part, index) => (
          <React.Fragment key={index}>
            <span>{part}</span>
            {index < currentTask.correctAnswers.length && (
              <span 
                className={`
                  inline-flex items-center justify-center min-w-[80px] px-3 py-1 border-b-2 
                  transition-all duration-300 rounded mx-1
                  ${filledBlanks[index] 
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-900/30' 
                    : 'border-amber-500/50 bg-slate-800/50 text-transparent min-h-[40px]'}
                  ${index === filledBlanks.findIndex(v => v === null) && wrongAnimation ? 'animate-shake border-red-500 bg-red-900/20' : ''}
                `}
              >
                {filledBlanks[index] || "?"}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (!currentTask) return <div>Loading...</div>;

  const progress = ((currentSentenceIndex) / data.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      <div className="mb-8 w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
        <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      <h2 className="text-xl text-center text-amber-200 mb-8">Construct the Scenario</h2>

      <div className="glass-card bg-slate-800/60 border-amber-500/30 p-6 rounded-2xl shadow-xl min-h-[150px] flex items-center justify-center mb-8">
        {renderSentence()}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {wordBank.map((word, idx) => (
          <button
            key={`${word}-${idx}`}
            onClick={() => handleWordClick(word)}
            className="p-4 bg-slate-700 hover:bg-slate-600 border border-slate-500 hover:border-amber-400 rounded-xl text-white font-semibold shadow-lg active:scale-95 transition-all"
          >
            {word}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}

export default Step_SentenceBuilder;