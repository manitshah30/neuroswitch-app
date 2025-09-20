import React from 'react'
import HeroSection from './HeroSection'
import Navbar from './Navbar'
import AboutUs from './AboutUs'
import FeatureCard from './FeatureCard'
import CognitiveSkillsSection from './CognitiveSkillsSection'
import TimelineSection from './TimelineSection'
import PhasesCarousel from './PhasesCarousel'
import TestimonialsSection from './TestimonialsSection'
import Footer from './Footer'

function LandPg() {
  return (
    // We set the background color on the root div
    <div className="bg-[#1F1E1E]">
      <Navbar  />
      {/* And here we render our complete, self-contained HeroSection component */}
      <HeroSection />

      {/* In the future, we will add other sections here like this: */}
      <AboutUs/>
      <FeatureCard/>
      <CognitiveSkillsSection/>
      <TimelineSection/>
      <PhasesCarousel/>
      <TestimonialsSection/>
      <Footer/>

    </div>
  )
}

export default LandPg