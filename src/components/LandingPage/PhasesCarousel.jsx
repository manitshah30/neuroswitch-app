import React, { useState } from 'react';
import GlassCard from '../GlassCard';

// We'll define the content for our four phases here.
const phasesData = [
  {
    phase: '01',
    title: 'Vocabulary Introduction',
    description: 'Learn new words with visual cues and tap-to-hear native pronunciation.',
    icon: <svg className="w-10 h-10" viewBox="0 0 100 100"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#C1CFFB"/><stop offset="100%" stopColor="#A78BFA"/></linearGradient></defs><path d="M20 80 L20 25 C20 15, 25 10, 35 10 L65 10 C75 10, 80 15, 80 25 L80 80 L50 65 L20 80 Z" fill="rgba(193,207,251,0.1)" stroke="url(#g1)" strokeWidth="3"/><path d="M35 30 H65 M35 45 H65 M35 60 H50" stroke="#C1CFFB" strokeWidth="2.5" strokeLinecap="round"/></svg>
  },
  {
    phase: '02',
    title: 'Picture Association',
    description: 'Strengthen memory by visually matching words to images, creating powerful semantic links.',
     icon: <svg className="w-10 h-10" viewBox="0 0 100 100"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#A78BFA"/><stop offset="100%" stopColor="#6EE7B7"/></linearGradient></defs><circle cx="30" cy="50" r="15" fill="rgba(167,139,250,0.1)" stroke="#A78BFA" strokeWidth="3"/><rect x="55" y="35" width="30" height="30" rx="5" fill="rgba(110,231,183,0.1)" stroke="#6EE7B7" strokeWidth="3"/><path d="M45 50 H55" stroke="url(#g2)" strokeWidth="3"/></svg>
  },
  {
    phase: '03',
    title: 'Listening Practice',
    description: 'Hone your comprehension by listening to native audio and selecting the correct term.',
    icon: <svg className="w-10 h-10" viewBox="0 0 100 100"><path d="M20 50 C 30 30, 40 30, 50 50 S 70 70, 80 50" stroke="#6EE7B7" strokeWidth="3" fill="none"/><path d="M25 50 C 35 35, 45 35, 55 50 S 75 65, 85 50" stroke="#A78BFA" strokeWidth="3" fill="none" opacity="0.7"/></svg>
  },
  {
    phase: '04',
    title: 'Story-Based Questions',
    description: 'Apply your new vocabulary in real-life scenarios to test contextual understanding.',
    icon: <svg className="w-10 h-10" viewBox="0 0 100 100"><path d="M20 80 L35 60 L50 70 L65 50 L80 65" stroke="#C1CFFB" strokeWidth="3" fill="none" strokeDasharray="5 5"/><path d="M20 80 L80 20" stroke="url(#g1)" strokeWidth="4" strokeLinecap="round"/></svg>
  },
];

function PhasesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? phasesData.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === phasesData.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <section className="py-20 px-4 overflow-hidden">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-brand-text mb-4">A Method Built for Your Brain</h2>
        <p className="text-lg text-brand-text-muted max-w-2xl mx-auto mb-12">
          Our Four-Phase Learning System is a journey, not a checklist. Explore the path to mastery.
        </p>
        
        <div className="relative h-96" style={{ perspective: '1000px' }}>
          {phasesData.map((phase, index) => {
            const offset = index - currentIndex;
            const isVisible = Math.abs(offset) <= 1; // Show current, next, and previous
            
            const style = {
              transform: `translateX(${offset * 50}%) scale(${1 - Math.abs(offset) * 0.2}) rotateY(${offset * -30}deg)`,
              opacity: isVisible ? (1 - Math.abs(offset) * 0.5) : 0,
              zIndex: phasesData.length - Math.abs(offset),
              transition: 'transform 0.5s ease, opacity 0.5s ease',
            };

            return (
              <div
                key={phase.phase}
                className="absolute top-0 left-0 w-full h-full flex justify-center"
                style={style}
              >
                <GlassCard className="w-full max-w-sm p-8 flex flex-col text-left">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-brand-text-muted">PHASE {phase.phase}</span>
                    {phase.icon}
                  </div>
                  <div className="w-full h-px bg-white/10 my-2"></div>
                  <h3 className="text-2xl font-bold text-brand-text mt-4 mb-3">{phase.title}</h3>
                  <p className="text-brand-text-muted leading-relaxed">{phase.description}</p>
                </GlassCard>
              </div>
            );
          })}
        </div>
        
        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-center gap-4">
            <button onClick={handlePrev} className="bg-white/10 border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button onClick={handleNext} className="bg-white/10 border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-colors">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
        </div>
      </div>
    </section>
  );
}

export default PhasesCarousel;