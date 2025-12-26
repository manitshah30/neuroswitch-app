import React, { useState, useEffect } from 'react';
import { FaVolumeUp, FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';

function Step_AudioQuiz({ data, onAnswer, onStepComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null); // true, false, or null
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const currentQuestion = data[currentIndex];

  // Auto-play audio on question load (optional but helpful)
  useEffect(() => {
    setStartTime(Date.now());
    // Uncomment to auto-play: playAudio();
  }, [currentIndex]);

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(currentQuestion.spanishWord); // Ensure data key matches 'spanishWord'
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleOptionSelect = (option) => {
    if (selectedOption) return; // Prevent multiple guesses

    const reactionTime = (Date.now() - startTime) / 1000;
    setSelectedOption(option);
    
    // Check if the selected option matches the correct answer
    // Assuming 'option' is the English word text
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    // Report results to parent (LessonPage)
    if (onAnswer) {
      onAnswer({
        type: 'audioQuiz', // New type for scoring
        isCorrect: correct,
        reactionTime: reactionTime,
        word: currentQuestion.spanishWord
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      // Reset state for next question
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      // Quiz Finished
      onStepComplete(true);
    }
  };

  // --- STYLING HELPERS ---
  const getButtonClass = (option) => {
    let base = "w-full p-4 rounded-xl border-2 font-medium text-lg transition-all duration-200 flex items-center justify-between ";
    
    if (selectedOption === null) {
      // Default state
      return base + "bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10";
    }

    if (option === currentQuestion.correctAnswer) {
      // Correct Answer (Show Green if user selected it OR if user failed and we reveal it)
      return base + "bg-emerald-500/20 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
    }

    if (option === selectedOption && !isCorrect) {
      // User picked WRONG answer
      return base + "bg-rose-500/20 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.3)]";
    }

    // Unselected options (Dim them out)
    return base + "bg-slate-800/40 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed";
  };

  // Progress Bar Width
  const progress = ((currentIndex + 1) / data.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      
      {/* Progress Bar */}
      <div className="mb-8 w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
        <div 
            className="h-full bg-cyan-400 transition-all duration-300" 
            style={{ width: `${progress}%` }}
        ></div>
      </div>

      <h2 className="text-xl sm:text-2xl text-center text-cyan-200 mb-6 font-light">
        What did you hear?
      </h2>

      {/* Audio Section */}
      <div className="flex justify-center mb-8">
        <button 
            onClick={playAudio}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all duration-300 shadow-xl
                ${isPlaying 
                    ? 'bg-cyan-400 text-slate-900 scale-110 shadow-cyan-400/50' 
                    : 'bg-gradient-to-br from-slate-700 to-slate-800 text-cyan-400 border border-slate-600 hover:border-cyan-400'
                }`}
        >
            <FaVolumeUp className={isPlaying ? 'animate-pulse' : ''} />
        </button>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionSelect(option)}
            disabled={selectedOption !== null}
            className={getButtonClass(option)}
          >
            <span>{option}</span>
            {/* Icons for feedback */}
            {selectedOption && option === currentQuestion.correctAnswer && <FaCheck />}
            {selectedOption === option && !isCorrect && <FaTimes />}
          </button>
        ))}
      </div>

      {/* Next Button (Only appears after answering) */}
      <div className="h-16 flex justify-center"> {/* Fixed height to prevent layout jump */}
        {selectedOption && (
          <button 
            onClick={handleNext}
            className={`px-8 py-3 rounded-full font-bold text-white flex items-center gap-2 transition-all duration-300 shadow-lg
                ${isCorrect 
                    ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/30' 
                    : 'bg-slate-600 hover:bg-slate-500' // Neutral button to continue even if wrong
                }`}
          >
            {currentIndex === data.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <FaArrowRight />
          </button>
        )}
      </div>

    </div>
  );
}

export default Step_AudioQuiz;