import React from 'react';

// SVG for the Cube Icon
const CubeIcon = () => (
<svg width="118" height="142" viewBox="0 0 118 142" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M59 2L4 45.75V98.25L59 142L114 98.25V45.75L59 2Z" fill="url(#paint0_linear_0_1)"/>
<path d="M59 58.875L4 42.625L59 2L114 42.625L59 58.875ZM59 58.875V132M4 91.375H114" stroke="#1F1E1E" strokeWidth="3"/>
<defs>
<linearGradient id="paint0_linear_0_1" x1="-19.703" y1="21.6231" x2="54.4629" y2="99.3208" gradientUnits="userSpaceOnUse">
<stop stopColor="#FBBF24"/>
<stop offset="1" stopColor="#F97316"/>
</linearGradient>
</defs>
</svg>
);

// NEW: The component now accepts `isClaimed`, `isClaiming`, and `onClaim` props
function DailyRewardCard({ isClaimed, isClaiming, onClaim }) {
  
  // Helper to determine button text based on state
  const getButtonText = () => {
    if (isClaimed) return 'Claimed!';
    if (isClaiming) return 'Claiming...';
    return 'Claim Reward';
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-md border-2 border-blue-400 p-6 rounded-2xl shadow-2xl shadow-blue-400/40 flex flex-col items-center justify-around text-center h-full">
      
      <h3 className="text-xl font-semibold text-yellow-400">Daily Reward</h3>
      
      <div className="my-4">
        <CubeIcon />
      </div>

      <button 
        // NEW: The onClick handler now calls the function from the parent
        onClick={onClaim}
        className={`w-full py-3 rounded-lg font-semibold text-black transition-colors duration-300 ${
          isClaimed 
            ? 'bg-slate-600 cursor-not-allowed text-white opacity-60' 
            : isClaiming
            ? 'bg-yellow-600 animate-pulse cursor-not-allowed'
            : 'bg-yellow-500 hover:bg-yellow-400'
        }`}
        // NEW: The button is disabled if it's already claimed OR if it's in the process of claiming
        disabled={isClaimed || isClaiming}
      >
        {getButtonText()}
      </button>
    </div>
  );
}

export default DailyRewardCard;
