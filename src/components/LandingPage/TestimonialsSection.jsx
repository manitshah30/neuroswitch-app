import React, { useState, useEffect, useRef } from "react";
import GlassCard from "../GlassCard"; // Assuming these imports are correct
import testimonialbg from "../../assets/testimonialbg.jpg";

const testimonials = [
  {
    name: "Alex R.",
    text: "NeuroSwitch is a game-changer! I feel sharper and my Spanish has improved dramatically.",
  },
  {
    name: "Samantha G.",
    text: "As a student, this is the perfect tool to keep my mind engaged between classes. Highly recommend!",
  },
  {
    name: "Michael B.",
    text: "The combination of language learning and brain training is brilliant. It's fun and effective.",
  },
];

function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  // Ref to hold the timeout ID for cleanup
  const timeoutRef = useRef(null);

  // A more stable useEffect using recursive setTimeout
  useEffect(() => {
    const clearTypingTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    clearTypingTimeout();
    setDisplayText(""); 

    const currentTestimonial = testimonials[currentIndex];
    const fullText = `${currentTestimonial.name}: ~ $ ${currentTestimonial.text}`;

    const typeCharacter = (index) => {
      if (index < fullText.length) {
        setDisplayText((prev) => prev + fullText.charAt(index));
        timeoutRef.current = setTimeout(() => typeCharacter(index + 1), 50);
      }
    };

    typeCharacter(0);

    return () => {
      clearTypingTimeout();
    };
  }, [currentIndex]); 

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const isTyping = displayText.length < `${testimonials[currentIndex].name}: ~ $ ${testimonials[currentIndex].text}`.length;

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="bg-brand-primary rounded-lg p-6 mb-12">
          <h2 className="text-4xl font-bold text-slate-800">Testimonials</h2>
        </div>

        <GlassCard className="p-8 relative max-w-3xl mx-auto">
          {/* Laptop Mockup */}
          <div className="relative mx-auto border-gray-700 bg-gray-800 border-[8px] rounded-t-xl h-[300px] max-w-[512px]">
            <div
              className="rounded-lg overflow-hidden h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${testimonialbg})` }}
            >
              {/* Terminal Window */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 h-4/5 bg-black/70 backdrop-blur-sm rounded-lg shadow-2xl p-4 flex flex-col">
                <div className="flex-shrink-0 flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-grow font-mono text-left text-green-400 text-sm whitespace-pre-wrap overflow-y-auto">
                  {displayText}
                  {isTyping && (
                    <span className="inline-block w-2 h-4 bg-green-400 animate-ping ml-1"></span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto bg-gray-700 rounded-b-xl h-[21px] max-w-[597px]">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-lg w-[96px] h-[8px] bg-gray-600"></div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </GlassCard>
      </div>
    </section>
  );
}

export default TestimonialsSection;