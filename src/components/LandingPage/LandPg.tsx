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
    <div className="bg-[#1F1E1E]">
      <Navbar />
      
      {/* 1. Add ID for Home */}
      <div id="home">
        <HeroSection />
      </div>

      {/* 2. Add ID for About Us */}
      <div id="about">
        <AboutUs/>
      </div>

      {/* 3. Add ID for Features (Wrapping both feature sections if you want) */}
      <div id="features">
        <FeatureCard/>
        <CognitiveSkillsSection/>
      </div>

      <TimelineSection/>
      <PhasesCarousel/>

      {/* 4. Add ID for Testimonials */}
      <div id="testimonials">
        <TestimonialsSection/>
      </div>

      <Footer/>
    </div>
  )
}

export default LandPg