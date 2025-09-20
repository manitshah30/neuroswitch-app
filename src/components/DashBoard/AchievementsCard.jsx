import React from 'react';
import { FaStar, FaCheckSquare, FaLock } from 'react-icons/fa';

// A small reusable component for each achievement item
const AchievementItem = ({ icon, label, achieved, color }) => {
  const iconColor = achieved ? color : 'text-gray-500';
  const textColor = achieved ? 'text-gray-200' : 'text-gray-500';
  
  return (
    <div className="flex flex-col items-center gap-2">
      {React.cloneElement(icon, { className: `w-10 h-10 ${iconColor}` })}
      <p className={`font-medium text-sm ${textColor}`}>{label}</p>
    </div>
  );
};

function AchievementsCard() {
  return (
    // Card with the standard "glassmorphism" style
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg h-full">
      <h3 className="text-xl font-bold text-white mb-6">Achievements</h3>
      <div className="flex justify-around items-center">
        <AchievementItem 
          icon={<FaStar />} 
          label="First Mission" 
          achieved={true}
          color="text-purple-400" 
        />
        <AchievementItem 
          icon={<FaCheckSquare />} 
          label="Perfect Score" 
          achieved={true}
          color="text-green-400"
        />
        <AchievementItem 
          icon={<FaLock />} 
          label="Locked" 
          achieved={false}
        />
      </div>
    </div>
  );
}

export default AchievementsCard;