import React from 'react';
import GameCard from './GameCard';

// --- SVG Icons defined as components for clarity ---

const VocabularyIcon = () => (
  <svg viewBox="0 0 100 100" className="h-full w-auto">
    <defs><linearGradient id="g1"><stop offset="0%" stopColor="#C1CFFB"/><stop offset="100%" stop-color="#A78BFA"/></linearGradient></defs>
    <path d="M20 80 L20 25 C20 15, 25 10, 35 10 L65 10 C75 10, 80 15, 80 25 L80 80 L50 65 L20 80 Z" fill="rgba(193,207,251,0.1)" stroke="url(#g1)" strokeWidth="2"/>
    <path d="M35 30 H65 M35 45 H65 M35 60 H50" stroke="#C1CFFB" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const AssociationIcon = () => (
  <svg viewBox="0 0 100 100" className="h-full w-auto">
    <defs><linearGradient id="g2"><stop offset="0%" stop-color="#A78BFA"/><stop offset="100%" stop-color="#6EE7B7"/></linearGradient></defs>
    <circle cx="30" cy="50" r="15" fill="rgba(167,139,250,0.1)" stroke="#A78BFA" strokeWidth="2"/>
    <rect x="55" y="35" width="30" height="30" rx="5" fill="rgba(110,231,183,0.1)" stroke="#6EE7B7" strokeWidth="2"/>
    <path d="M45 50 H55" stroke="url(#g2)" strokeWidth="2"/>
  </svg>
);

const ScrambleIcon = () => (
  <svg viewBox="0 0 100 100" className="h-full w-auto">
    <path d="M20 50 C 30 30, 40 30, 50 50 S 70 70, 80 50" stroke="#6EE7B7" strokeWidth="2" fill="none"/>
    <path d="M25 50 C 35 35, 45 35, 55 50 S 75 65, 85 50" stroke="#A78BFA" strokeWidth="2" fill="none" opacity="0.7"/>
  </svg>
);

const StoryIcon = () => (
  <svg viewBox="0 0 100 100" className="h-full w-auto">
    <path d="M20 80 L35 60 L50 70 L65 50 L80 65" stroke="#C1CFFB" strokeWidth="2" fill="none" strokeDasharray="5 5"/>
    <path d="M20 80 L80 20" stroke="url(#g1)" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// --- Main LearningUniverse Component ---

function LearningUniverse() {
  const games = [
    { title: 'Vocabulary Rush', difficulty: 'Easy', to: '/games/vocabulary', icon: <VocabularyIcon /> },
    { title: 'Picture Association', difficulty: 'Medium', to: '/games/association', icon: <AssociationIcon /> },
    { title: 'Audio Scramble', difficulty: 'Hard', to: '/games/scramble', icon: <ScrambleIcon /> },
    { title: 'Story Mode', difficulty: 'Hard', to: '/games/story', icon: <StoryIcon /> },
  ];

  return (
    <section className="relative w-full py-16 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 bg-purple-600/30 blur-3xl rounded-full"></div>
      
      <div className="relative z-10 text-center mb-12">
        <h2 className="text-4xl font-bold text-white">Explore the Learning Universe</h2>
      </div>

      {/* Horizontal Scrolling Container */}
      <div className="relative scrollbar-hide overflow-x-auto pb-8">
        <div className="relative w-[1400px] h-[250px] mx-auto">
          {/* Decorative Dotted Line */}
          <svg className="absolute top-0 left-0 w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 125 C 300 50, 500 200, 700 125 C 900 50, 1100 200, 1300 125" stroke="rgba(193, 207, 251, 0.2)" strokeWidth="2" strokeDasharray="5 10"/>
          </svg>
          
          {/* Game Cards */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center px-24">
            {games.map((game, index) => (
              <GameCard key={index} {...game} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LearningUniverse;