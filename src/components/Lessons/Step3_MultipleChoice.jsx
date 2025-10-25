import React, { useState, useEffect } from 'react'; // Import useEffect
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Component receives data and the onAnswer callback
function Step3_MultipleChoice({ data, onAnswer }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [startTime, setStartTime] = useState(Date.now()); // State to track when the question appears

  // Reset the timer and selection every time the question changes
  useEffect(() => {
    setStartTime(Date.now());
    setSelected(null); // Reset selection for the new question
  }, [currentIndex]);


  // Guard clause for data integrity
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-red-400">Error: No questions found for this step.</div>;
  }

  const currentQuestion = data[currentIndex];

  // Guard clause prevents a crash if the index goes out of bounds
  if (!currentQuestion) {
    console.error("Invalid current question index:", currentIndex);
    return <div className="text-red-400">Error: Could not load question.</div>;
  }
  
  // Handler to calculate performance and report back
  const handleSelectOption = (option) => {
    if (selected) return; // Prevent changing the answer

    const reactionTime = (Date.now() - startTime) / 1000; // Time in seconds
    const isCorrect = option === currentQuestion.correctAnswer;
    setSelected(option); // Update UI to show selection

    // Report results back to the parent component (LessonPage)
    if (onAnswer) {
      onAnswer({
        type: 'multipleChoice',
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

  // Determine button styling based on selection and correctness (matching EmojiMatch)
  const getButtonClass = (option) => {
    const baseStyle = `p-4 rounded-lg border-2 font-semibold text-xl text-white transition-all duration-300 w-full shadow-md hover:shadow-lg`;
    
    if (selected === null) {
      // Unselected state
      return `${baseStyle} bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 hover:from-slate-600 hover:to-slate-700 hover:scale-[1.03] transform`;
    }
    
    // Selected state
    const isCorrectAnswer = option === currentQuestion.correctAnswer;
    const isSelectedAnswer = option === selected;

    if (isCorrectAnswer) {
      return `${baseStyle} bg-gradient-to-br from-green-600 to-emerald-700 border-green-500 scale-[1.05] shadow-green-500/30`;
    }
    if (isSelectedAnswer) {
      return `${baseStyle} bg-gradient-to-br from-red-600 to-rose-700 border-red-500`;
    }
    return `${baseStyle} bg-slate-800 border-slate-700 opacity-40 cursor-not-allowed`;
  };

  return (
    // Increased max-width like EmojiMatch
    <div className="w-full max-w-2xl flex flex-col items-center p-4"> 
      {/* Enhanced question styling */}
      <p className="text-2xl text-gray-200 mb-8 text-center font-medium">{currentQuestion.question}</p>
      
      {/* Answer Options Grid - Increased gap */}
      <div className="grid grid-cols-2 gap-5 w-full mb-8"> 
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

      {/* Navigation - Matching Flip Card and EmojiMatch style */}
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
        {/* Adjusted font style */}
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

export default Step3_MultipleChoice;

