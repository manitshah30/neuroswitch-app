import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Step1_FlipCard from '../../components/Lessons/Step1_FlipCard';
import Step2_EmojiMatch from '../../components/Lessons/Step2_EmojiMatch';
import Step3_MultipleChoice from '../../components/Lessons/Step3_MultipleChoice';
import StarryBackground from '../../components/effects/StarryBackground';
import ProgressBar from '../../components/Lessons/ProgressBar';
import '../../App.css';

// In a real app, this data would come from a database based on lessonId
const lessonData = {
  '1': {
    title: 'Greetings & Essentials',
    steps: [
      { type: 'flipCard', title: 'Card Flip Learning', data: [
          { spanish: 'Hola', english: 'Hello' },
          { spanish: 'Adiós', english: 'Goodbye' },
          { spanish: 'Gracias', english: 'Thank you' },
          { spanish: 'Por favor', english: 'Please' },
          { spanish: 'Sí', english: 'Yes' },
          { spanish: 'No', english: 'No' },
          { spanish: 'Buenos Dias', english: 'Good Morning' },
          { spanish: 'Buenas Noches', english: 'Good Night' },
          { spanish: 'Lo siento', english: 'Sorry'},
          { spanish: 'Bien' , english: 'Good'}
      ]},
      { type: 'emojiMatch', title: 'Emoji Matching', data: [
          { emoji: '👋', question: 'Match the emoji with the word for "hello"', options: ['Gracias', 'Sí', 'No', 'Hola'], correctAnswer: 'Hola' },
          { emoji: '👍', question: 'Match the emoji with the word for "yes"', options: ['No', 'Lo siento', 'Sí', 'Bien'], correctAnswer: 'Sí' },
          { emoji: '🙏', question: 'Match the emoji with the word for "thank you"', options: ['Hola', 'Gracias', 'No', 'Adiós'], correctAnswer: 'Gracias' },
      ]},
      { type: 'multipleChoice', title: 'Multiple Choice Quiz', data: [
          { question: 'Translate: Thank you', options: ['Hola', 'Sí', 'Gracias', 'No'], correctAnswer: 'Gracias' },
          { question: 'Translate: Hello', options: ['Adiós', 'Hola', 'Gracias', 'Sí'], correctAnswer: 'Hola' },
      ]}
    ]
  }
};


function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const lesson = lessonData[lessonId];
  if (!lesson) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white text-2xl">Lesson not found!</div>;
  }

  const handleNext = () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/games/vocabulary');
    }
  };

  const renderStep = () => {
    const stepInfo = lesson.steps[currentStep];
    switch (stepInfo.type) {
      case 'flipCard':
        return <Step1_FlipCard data={stepInfo.data} />;
      case 'emojiMatch':
        return <Step2_EmojiMatch data={stepInfo.data} />;
      case 'multipleChoice':
        return <Step3_MultipleChoice data={stepInfo.data} />;
      default:
        return null;
    }
  };

  return (
    <StarryBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-4xl bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-8 flex flex-col justify-between min-h-[650px]">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-400">{`Day ${lessonId}: ${lesson.title}`}</h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <p className="text-gray-400">{`Step ${currentStep + 1}`}</p>
              {lesson.steps.map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentStep ? 'bg-purple-400' : 'bg-gray-600'}`}></div>
              ))}
            </div>
            <h2 className="text-xl font-semibold text-purple-300 mt-1">{lesson.steps[currentStep].title}</h2>
            <ProgressBar current={currentStep + 1} total={lesson.steps.length} />
          </header>

          <main className="flex-grow flex items-center justify-center">
            {renderStep()}
          </main>

          <footer className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevious}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              &larr; Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-purple-500/30 transition-opacity"
            >
              {currentStep === lesson.steps.length - 1 ? 'Finish Lesson' : 'Next'} &rarr;
            </button>
          </footer>
        </div>
      </div>
    </StarryBackground>
  );
}

export default LessonPage;

