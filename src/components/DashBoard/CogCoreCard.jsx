import React from 'react';
import CognitiveCoreAnimation from './CognitiveCoreAnimation'; // Import the 3D animation

function CogCoreCard() {
  return (
    // Card with "glassmorphism" effect
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-2xl shadow-blue-500/10 flex flex-col items-center justify-center h-full w-full">
      <h2 className="text-3xl font-bold text-white mb-4 text-center">
        Your Cognitive Core
      </h2>
      
      {/* Container for the 3D Canvas */}
      <div className="w-full h-64">
        <CognitiveCoreAnimation />
      </div>
    </div>
  );
}

export default CogCoreCard;