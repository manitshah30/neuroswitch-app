import React, { useState, useEffect } from 'react';
import HeroIllustration from './HeroIllustration'; // Import the illustration we just made

function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // This effect runs once when the component is first added to the page.
  // It sets up an event listener to track the mouse's movement.
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPos = (clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yPos = (clientY / innerHeight - 0.5) * 2; // -1 to 1
      
      setMousePosition({ x: xPos, y: yPos });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // This is a cleanup function. It removes the event listener when the
    // component is no longer on the page to prevent memory leaks.
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // The empty array means this effect only runs once.

  return (
    <main className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="aurora-bg"></div>
      
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-6 relative z-10">
        
        {/* Left Column: Text Content */}
        <div 
          className="text-center md:text-left parallax-container" 
          style={{ transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)` }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#C1CFFB] via-white to-[#C1CFFB] animated-gradient-text leading-tight">
            Unlock Your Cognitive Potential.
          </h1>
          <p className="text-xl text-gray-300 mt-6 max-w-lg mx-auto md:mx-0">
            A smarter way to learn languages, grounded in neuroscience.
          </p>
          <div className="mt-10">
            <a href="#" className="bg-[#C1CFFB] text-[#1E293B] font-bold text-xl px-8 py-4 rounded-lg hover:bg-white transition-transform transform hover:scale-105 inline-block">
              Get Started for Free
            </a>
            <p className="text-l text-gray-400 mt-4">Join 10,000+ learners on their cognitive journey.</p>
          </div>
        </div>
        
        {/* Right Column: Illustration */}
        <div 
          className="relative h-96 md:h-[500px] parallax-container" 
          style={{ transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)` }}
        >
          <HeroIllustration />
        </div>

      </div>
    </main>
  );
}

export default HeroSection;
