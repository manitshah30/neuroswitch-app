import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function Step3_MultipleChoice({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);

  // Guard clause for data integrity
  if (!Array.isArray(data) || data.length === 0) {
    return <div>Error: No questions found for this step.</div>;
  }

  const currentQuestion = data[currentIndex];

  // This guard clause prevents a crash if the index goes out of bounds
  if (!currentQuestion) {
    return null;
  }

  const handleNextQuestion = () => {
    if (currentIndex < data.length - 1) {
      setSelected(null);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setSelected(null);
      setCurrentIndex((prev) => prev - 1);
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

export default Step3_MultipleChoice;

