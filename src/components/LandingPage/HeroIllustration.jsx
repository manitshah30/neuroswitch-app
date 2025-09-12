import React from 'react'

function HeroIllustration() {
  return (
    // The main SVG container
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain">
      <defs>
        {/* This filter creates the soft glow effect */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* This is the gradient for the connecting lines */}
        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7A8BFA" />
          <stop offset="100%" stopColor="#C1CFFB" />
        </linearGradient>
      </defs>
      <g filter="url(#glow)" opacity="0.9">
        {/* Human Profile Silhouette */}
        <path d="M250 80 C150 80, 130 150, 160 250 C190 350, 150 420, 250 420 C350 420, 310 350, 340 250 C370 150, 350 80, 250 80 Z" fill="none" stroke="#C1CFFB" strokeWidth="1.5" opacity="0.4" />

        {/* Central Brain/Core Node */}
        <circle cx="250" cy="250" r="25" fill="url(#line-gradient)" className="svg-pulse" />

        {/* Neural Pathways */}
        <path d="M250 225 V 150 C 250 120, 220 120, 220 150" fill="none" stroke="url(#line-gradient)" strokeWidth="2" className="svg-draw" style={{ animationDelay: '0s' }} />
        <path d="M250 225 V 150 C 250 120, 280 120, 280 150" fill="none" stroke="url(#line-gradient)" strokeWidth="2" className="svg-draw" style={{ animationDelay: '0.5s' }} />
        <path d="M228 262 L 180 320 C 170 340, 190 360, 210 350" fill="none" stroke="url(#line-gradient)" strokeWidth="2" className="svg-draw" style={{ animationDelay: '1s' }} />
        <path d="M272 262 L 320 320 C 330 340, 310 360, 290 350" fill="none" stroke="url(#line-gradient)" strokeWidth="2" className="svg-draw" style={{ animationDelay: '1.5s' }} />
        <path d="M235 235 L 170 180 C 150 160, 180 130, 200 140" fill="none" stroke="url(#line-gradient)" strokeWidth="2" className="svg-draw" style={{ animationDelay: '2s' }} />
        <path d="M265 235 L 330 180 C 350 160, 320 130, 300 140" fill="none" stroke="url(#line-gradient)" strokeWidth="2" className="svg-draw" style={{ animationDelay: '2.5s' }} />

        {/* Abstract Language/Cognition Shapes */}
        <circle cx="180" cy="150" r="8" fill="#C1CFFB" className="svg-pulse" style={{ animationDelay: '1s' }} />
        <rect x="310" y="142" width="16" height="16" rx="4" fill="#C1CFFB" className="svg-pulse" style={{ animationDelay: '1.5s' }} />
        <polygon points="200,360 210,340 220,360" fill="#C1CFFB" className="svg-pulse" style={{ animationDelay: '2s' }} />
        <circle cx="300" cy="350" r="8" fill="#C1CFFB" className="svg-pulse" style={{ animationDelay: '2.5s' }} />
      </g>
    </svg>
  );
}

export default HeroIllustration;
