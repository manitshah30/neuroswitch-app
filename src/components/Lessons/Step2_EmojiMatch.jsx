import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function Step2_EmojiMatch({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);

  // This check ensures data is a valid array before we try to use it.
  if (!Array.isArray(data) || data.length === 0) {
    return <div>Error: No questions found for this step.</div>;
  }

  const currentQuestion = data[currentIndex];

  // This guard clause is crucial. If we navigate past the last question,
  // currentQuestion will be undefined. This stops the component from trying to render
  // and prevents the "cannot read properties of undefined" crash.
  if (!currentQuestion) {
    return null; 
  }

  const handleNextQuestion = () => {
    // Only proceed if there is a next question
    if (currentIndex < data.length - 1) {
      setSelected(null); // Reset selection for the new question
      setCurrentIndex((prev) => prev + 1); // Go to the next index
    }
  };

  const handlePrevQuestion = () => {
    // Only proceed if there is a previous question
    if (currentIndex > 0) {
      setSelected(null); // Reset selection
      setCurrentIndex((prev) => prev - 1); // Go to the previous index
    }
  };

  const getButtonClass = (option) => {
    if (selected === null) return 'bg-slate-700 hover:bg-slate-600 border-slate-600';
    if (option === currentQuestion.correctAnswer) return 'bg-green-600 border-green-500';
    if (option === selected && option !== currentQuestion.correctAnswer) return 'bg-red-600 border-red-500';
    return 'bg-slate-700 opacity-50 border-slate-600';
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      {/* Question Area */}
      <div className="text-7xl mb-4">{currentQuestion.emoji}</div>
      <p className="text-lg text-gray-300 mb-6">{currentQuestion.question}</p>
      <div className="grid grid-cols-2 gap-4 w-full">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            disabled={selected !== null}
            className={`p-4 rounded-lg border-2 font-semibold text-xl transition-all ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Navigation for Questions */}
      <div className="flex items-center gap-8 mt-8">
        <button 
            onClick={handlePrevQuestion} 
            disabled={currentIndex === 0}
            className="p-3 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <FaArrowLeft />
        </button>
        <span className="font-semibold">{currentIndex + 1} / {data.length}</span>
        <button 
            onClick={handleNextQuestion}
            disabled={currentIndex === data.length - 1}
            className="p-3 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

export default Step2_EmojiMatch;

