import React, { useState, useEffect, useRef } from 'react';
import HeroIllustration from './HeroIllustration';

function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false); // State to check screen size

  // --- Parallax Effect Logic ---
  useEffect(() => {
    // Check initial screen size
    const checkScreenSize = () => {
        setIsMobile(window.innerWidth < 768); // md breakpoint in Tailwind
    };
    checkScreenSize(); // Run on mount

    const handleMouseMove = (e) => {
        // Only run parallax if not mobile
        if (window.innerWidth >= 768) {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const xPos = (clientX / innerWidth - 0.5) * 2;
            const yPos = (clientY / innerHeight - 0.5) * 2;
            setMousePosition({ x: xPos, y: yPos });
        } else {
            // Reset position on mobile if needed
            setMousePosition({ x: 0, y: 0 });
        }
    };

    // Add listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', checkScreenSize); // Update isMobile on resize

    // Cleanup listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []); // Empty array ensures this runs only once on mount

  // Calculate transform styles, only apply if not mobile
  const textTransform = !isMobile ? `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)` : 'none';
  const illustrationTransform = !isMobile ? `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)` : 'none';

  return (
    // Use min-height, adjust padding for mobile
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 py-16 md:py-0">
      {/* Background stays the same */}
      <div className="aurora-bg"></div>

      {/* Grid container with adjusted padding and gap for mobile */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-8 relative z-10 max-w-6xl mt-16 md:mt-0"> {/* Added top margin for mobile */}

        {/* Left Column: Text Content */}
        {/* Added transition for smoother parallax stop/start */}
        <div
          className="text-center md:text-left transition-transform duration-300 ease-out order-2 md:order-1" // Stack text below image on mobile
          style={{ transform: textTransform }}
        >
          {/* Responsive text sizes */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#C1CFFB] via-white to-[#C1CFFB] animated-gradient-text leading-tight">
            Unlock Your Cognitive Potential.
          </h1>
          {/* Responsive text size and max-width */}
          <p className="text-lg sm:text-xl text-gray-300 mt-6 max-w-md mx-auto md:mx-0">
            A smarter way to learn languages, grounded in neuroscience.
          </p>
          <div className="mt-8 sm:mt-10">
            {/* Responsive button/text */}
            <a href="/signin" /* Link to signin page */
               className="bg-[#C1CFFB] text-[#1E293B] font-bold text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-white transition-all transform hover:scale-105 inline-block shadow-lg hover:shadow-xl">
              Get Started for Free
            </a>
            <p className="text-sm sm:text-base text-gray-400 mt-4">Join 10,000+ learners on their cognitive journey.</p>
          </div>
        </div>

        {/* Right Column: Illustration */}
        {/* Added transition, responsive height, adjusted positioning */}
        <div
          className="relative h-64 sm:h-80 md:h-[450px] lg:h-[500px] w-full transition-transform duration-300 ease-out order-1 md:order-2 flex justify-center items-center" // Center illustration on mobile
          style={{ transform: illustrationTransform }}
        >
          <HeroIllustration />
        </div>

      </div>
    </main>
  );
}

export default HeroSection;
