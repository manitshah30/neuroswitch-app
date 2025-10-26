import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// NEW: Accept onStepComplete prop
function Step2_EmojiMatch({ data, onAnswer, onStepComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

  // Reset timer and selection when the question changes
  useEffect(() => {
    setStartTime(Date.now());
    setSelected(null);
  }, [currentIndex]);

  // --- NEW: Effect to report completion status ---
  useEffect(() => {
    // Determine if the current question is the last one
    const isLastQuestion = currentIndex === data.length - 1;
    // Call the callback from the parent to report status
    // For quizzes, we consider it "complete" enough to advance once the user *answers* the last question.
    if (onStepComplete) {
      // Report complete if on the last question AND an answer has been selected
      onStepComplete(isLastQuestion && selected !== null);
    }
    // Rerun whenever the index or selected state changes
  }, [currentIndex, selected, data.length, onStepComplete]);
  // --- END NEW ---


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
    // Base styles adjusted for responsiveness
    const baseStyle = `p-3 sm:p-4 rounded-lg border-2 font-semibold text-base sm:text-lg md:text-xl text-white transition-all duration-300 w-full shadow-md hover:shadow-lg text-center`;

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
    // Added padding for smaller screens
    <div className="w-full max-w-xs sm:max-w-xl md:max-w-2xl flex flex-col items-center px-2 sm:px-4">
      {/* --- RESPONSIVE Question Area --- */}
      {/* Adjusted emoji size, text size, margins */}
      <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 drop-shadow-lg">{currentQuestion.emoji}</div>
      <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 sm:mb-8 text-center font-medium">{currentQuestion.question}</p>

      {/* --- RESPONSIVE Answer Options Grid --- */}
      {/* Use grid-cols-1 on small screens, grid-cols-2 on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 w-full mb-6 sm:mb-8">
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

      {/* --- RESPONSIVE Navigation --- */}
      {/* Matches Flip Card style, adjusts width/padding */}
      <div className="flex items-center justify-between w-full max-w-xs sm:max-w-md mt-4 sm:mt-6">
         <button
            onClick={handlePrevQuestion}
            className="p-3 px-4 sm:p-4 sm:px-6 bg-gradient-to-br from-purple-700 to-indigo-700 rounded-full text-white text-lg sm:text-xl
                       hover:from-purple-600 hover:to-indigo-600 transition-all duration-200
                       shadow-lg hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            // Disable button visually if on the first question
            disabled={currentIndex === 0}
            aria-label="Previous question"
        >
            <FaArrowLeft />
        </button>
        <span className="font-semibold text-lg sm:text-xl text-gray-300 tracking-wide">{currentIndex + 1} / {data.length}</span>
        <button
            onClick={handleNextQuestion}
            className="p-3 px-4 sm:p-4 sm:px-6 bg-gradient-to-br from-indigo-700 to-blue-700 rounded-full text-white text-lg sm:text-xl
                       hover:from-indigo-600 hover:to-blue-600 transition-all duration-200
                       shadow-lg hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            // Disable button visually if on the last question
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

