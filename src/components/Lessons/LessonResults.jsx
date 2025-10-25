import React from 'react';
import { FaBrain, FaBolt, FaCrosshairs } from 'react-icons/fa';

// A small, reusable component for the score bars
const ScoreBar = ({ score, label, icon, colorClass }) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-gray-300">{label}</span>
      </div>
      <span className="font-bold text-lg text-white">{score}%</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-4">
      <div
        className={`h-4 rounded-full ${colorClass} transition-all duration-1000 ease-out`}
        style={{ width: `${score}%` }}
      ></div>
    </div>
  </div>
);

function LessonResults({ scores, onContinue }) {
  // Fallback for scores in case they are not yet calculated
  const { attentionScore = 0, memoryScore = 0, speedScore = 0 } = scores || {};

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-8 text-white animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-purple-400 mb-2">Lesson Complete!</h1>
        <p className="text-gray-400 mb-8">Here's your cognitive performance report.</p>
      </div>

      <div>
        <ScoreBar
          score={attentionScore}
          label="Attention & Focus"
          icon={<FaCrosshairs className="text-red-400" />}
          colorClass="bg-red-500"
        />
        <ScoreBar
          score={memoryScore}
          label="Working Memory"
          icon={<FaBrain className="text-blue-400" />}
          colorClass="bg-blue-500"
        />
        <ScoreBar
          score={speedScore}
          label="Decision Speed"
          icon={<FaBolt className="text-yellow-400" />}
          colorClass="bg-yellow-500"
        />
      </div>

      <button
        onClick={onContinue}
        className="mt-8 w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-purple-500/30 transition-opacity"
      >
        Continue to Map
      </button>
    </div>
  );
}

export default LessonResults;
