import React from 'react';
import { Link } from 'react-router-dom';

function GameCard({ title, difficulty, to, icon }) {
  return (
    <Link to={to} className="group text-center flex flex-col items-center flex-shrink-0">
      {/* Icon container */}
      <div className="w-32 h-32 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      {/* Text content */}
      <p className="font-bold text-white text-lg">{title}</p>
      <p className="text-sm text-gray-400">Difficulty: {difficulty}</p>
    </Link>
  );
}

export default GameCard;