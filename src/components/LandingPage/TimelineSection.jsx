import React, { useEffect, useRef, useState } from 'react';
import GlassCard from '../GlassCard';

// This custom hook to detect when an element is on screen remains the same
const useOnScreen = (options) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);
    if (ref.current) { observer.observe(ref.current); }
    return () => { if (ref.current) { observer.unobserve(ref.current); } };
  }, [ref, options]);
  return [ref, isVisible];
};


function TimelineSection() {
  const [ref1, isVisible1] = useOnScreen({ threshold: 0.3 });
  const [ref2, isVisible2] = useOnScreen({ threshold: 0.3 });
  const [ref3, isVisible3] = useOnScreen({ threshold: 0.3 });

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="relative">
          <div className="timeline-line hidden md:block"></div>
          <div className="space-y-24">
            
            {/* Timeline Item 1 */}
            <div ref={ref1} className={`animate-on-scroll ${isVisible1 ? 'is-visible' : ''} relative flex flex-col md:flex-row items-center`}>
              <div className="md:w-1/2 md:pr-12">
                <GlassCard className="p-8 text-left">
                  {/* These elements will now animate one after the other */}
                  <span className="stagger-child delay-1 font-semibold text-brand-primary">The Foundation</span>
                  <h4 className="stagger-child delay-2 text-2xl font-bold mt-2 mb-3 text-white">A Scientific Approach</h4>
                  <p className="stagger-child delay-3 text-brand-text-muted">NeuroSwitch was born from rigorous academic research, ensuring every activity is rooted in proven principles of cognitive enhancement and language acquisition.</p>
                </GlassCard>
              </div>
              <div className="md:w-1/2 md:pl-12"></div>
              <div className="timeline-icon-container top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center">
                 <svg className="w-8 h-8 text-[#C1CFFB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path></svg>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div ref={ref2} className={`animate-on-scroll ${isVisible2 ? 'is-visible' : ''} relative flex flex-col md:flex-row items-center`}>
              <div className="md:w-1/2 md:pr-12 md:order-2 md:pl-12">
                <GlassCard className="p-8 text-left">
                  <span className="stagger-child delay-1 font-semibold text-brand-accent">The Mission</span>
                  <h4 className="stagger-child delay-2 text-2xl font-bold mt-2 mb-3 text-white">Make Learning Impactful</h4>
                  <p className="stagger-child delay-3 text-brand-text-muted">By merging science with accessibility, our mission is to make learning engaging, inclusive, and impactful across diverse communities worldwide.</p>
                </GlassCard>
              </div>
              <div className="md:w-1/2 md:pl-12 md:order-1"></div>
              <div className="timeline-icon-container top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center">
                <svg className="w-8 h-8 text-[#A78BFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div ref={ref3} className={`animate-on-scroll ${isVisible3 ? 'is-visible' : ''} relative flex flex-col md:flex-row items-center`}>
               <div className="md:w-1/2 md:pr-12">
                <GlassCard className="p-8 text-left">
                  <span className="stagger-child delay-1 font-semibold text-brand-success">The Vision</span>
                  <h4 className="stagger-child delay-2 text-2xl font-bold mt-2 mb-3 text-white">Cognitive Tools for All</h4>
                  <p className="stagger-child delay-3 text-brand-text-muted">To go beyond academia and serve as a tool for the general population, a therapeutic aid for special needs, dementia care, and cognitive rehabilitation.</p>
                </GlassCard>
              </div>
              <div className="md:w-1/2 md:pl-12"></div>
              <div className="timeline-icon-container top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center">
                <svg className="w-8 h-8 text-[#6EE7B7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.7 9a3 3 0 015.6 0M12 12v9"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-1.414 1.414M5.636 5.636l1.414 1.414"></path></svg>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}

export default TimelineSection;
