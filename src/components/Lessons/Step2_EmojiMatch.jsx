import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Component receives data and the onAnswer callback
function Step2_EmojiMatch({ data, onAnswer }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

  // Reset timer when the question changes
  useEffect(() => {
    setStartTime(Date.now());
    // Also reset selection when navigating between questions
    setSelected(null);
  }, [currentIndex]);

  // Data validation
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-red-400">Error: No questions found for this step.</div>;
  }
  const currentQuestion = data[currentIndex];
  if (!currentQuestion) {
    console.error("Invalid current question index:", currentIndex);
    return <div className="text-red-400">Error: Could not load question.</div>;
  }

  // Handle selecting an answer
  const handleSelectOption = (option) => {
    if (selected) return; // Prevent changing answer

    const reactionTime = (Date.now() - startTime) / 1000;
    const isCorrect = option === currentQuestion.correctAnswer;
    setSelected(option);

    // Report performance data back to the parent LessonPage
    if (onAnswer) {
      onAnswer({
        type: 'emojiMatch',
        isCorrect,
        reactionTime,
      });
    }
  };

  // Navigation handlers
  const handleNextQuestion = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };
  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Determine button styling based on selection and correctness
  const getButtonClass = (option) => {
    const baseStyle = `p-4 rounded-lg border-2 font-semibold text-xl text-white transition-all duration-300 w-full shadow-md hover:shadow-lg`;
    
    if (selected === null) {
      // Unselected state - Subtle gradient, hover effect
      return `${baseStyle} bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 hover:from-slate-600 hover:to-slate-700 hover:scale-[1.03] transform`;
    }
    
    // Selected state - Show correct/incorrect
    const isCorrectAnswer = option === currentQuestion.correctAnswer;
    const isSelectedAnswer = option === selected;

    if (isCorrectAnswer) {
      // Correct answer is always green after selection
      return `${baseStyle} bg-gradient-to-br from-green-600 to-emerald-700 border-green-500 scale-[1.05] shadow-green-500/30`;
    }
    if (isSelectedAnswer) {
      // Incorrectly selected answer is red
      return `${baseStyle} bg-gradient-to-br from-red-600 to-rose-700 border-red-500`;
    }
    // Other options are dimmed after selection
    return `${baseStyle} bg-slate-800 border-slate-700 opacity-40 cursor-not-allowed`;
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center p-4"> {/* Increased max-width */}
      {/* Question Area - Enhanced styling */}
      <div className="text-8xl mb-6 drop-shadow-lg">{currentQuestion.emoji}</div>
      <p className="text-2xl text-gray-200 mb-8 text-center font-medium">{currentQuestion.question}</p>
      
      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 gap-5 w-full mb-8"> {/* Increased gap */}
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelectOption(option)}
            disabled={selected !== null}
            className={getButtonClass(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Navigation - Matching Flip Card style */}
      <div className="flex items-center justify-between w-full max-w-md mt-6">
         <button
            onClick={handlePrevQuestion}
            className="p-4 px-6 bg-gradient-to-br from-purple-700 to-indigo-700 rounded-full text-white text-xl 
                       hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 
                       shadow-lg hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            disabled={currentIndex === 0}
            aria-label="Previous question"
        >
            <FaArrowLeft />
        </button>
        <span className="font-bold text-xl text-gray-300 tracking-wide">{currentIndex + 1} / {data.length}</span>
        <button
            onClick={handleNextQuestion}
            className="p-4 px-6 bg-gradient-to-br from-indigo-700 to-blue-700 rounded-full text-white text-xl 
                       hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 
                       shadow-lg hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            disabled={currentIndex === data.length - 1}
            aria-label="Next question"
        >
            <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

export default Step2_EmojiMatch;

