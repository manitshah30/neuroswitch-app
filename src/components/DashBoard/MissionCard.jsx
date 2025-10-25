import React from 'react';

function MissionCard({ missionTitle, missionDescription}) {
  return (
    // UPDATED: Added transition classes and a cursor pointer to indicate the whole card is clickable
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-2xl shadow-blue-500/10 flex flex-col h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/20 cursor-pointer">
      
      {/* Main content area */}
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          {/* Left side text content */}
          <div>
            <h3 className="text-lg font-medium text-gray-300">Spanish Essentials:</h3>
            <h2 className="text-5xl font-bold text-white mt-1">{missionTitle}</h2>
            <p className="text-gray-400 text-lg mt-4 max-w-md">{missionDescription}</p>
          </div>

          
        </div>
      </div>
      
      {/* REMOVED: The button is no longer needed as the parent Link handles navigation */}
      {/* <div className="mt-8"> ... </div> */}
    </div>
  );
}

export default MissionCard;
