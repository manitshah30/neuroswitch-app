import React from 'react';

function MissionCard({ missionTitle, missionDescription, rewardXP }) {
  return (
    // Card with "glassmorphism" effect: semi-transparent bg, backdrop blur, and subtle border
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-2xl shadow-blue-500/10 flex flex-col h-full">
      
      {/* Main content area */}
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          {/* Left side text content */}
          <div>
            <h3 className="text-lg font-medium text-gray-300">Spanish Essentials:</h3>
            <h2 className="text-5xl font-bold text-white mt-1">{missionTitle}</h2>
            <p className="text-gray-400 text-lg mt-4 max-w-md">{missionDescription}</p>
          </div>

          {/* Right side Rewards box */}
          <div className="text-center flex-shrink-0 ml-8">
            <p className="text-gray-300 text-lg mb-10">Rewards</p>
            <div className="bg-black/40 px-6 py-6 rounded-xl flex items-center justify-center gap-2">
              <span className="text-yellow-400 text-2xl">⚡</span>
              <span className="text-white font-bold text-xl">{rewardXP} XP</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Button at the bottom */}
      <div className="mt-8">
        {/* Button with gradient, glow, and border */}
        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white font-bold py-3 px-10 rounded-lg transition-all duration-300 border border-blue-400 shadow-lg shadow-blue-500/30">
          Resume Mission
        </button>
      </div>
    </div>
  );
}

export default MissionCard;