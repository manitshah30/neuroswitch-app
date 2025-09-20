import React from 'react';
import './StarryBackground.css'; // We will create this CSS file next

function StarryBackground({ children }) {
  return (
    <div className="starry-background">
      <div className="stars-layer-1"></div>
      <div className="stars-layer-2"></div>
      <div className="stars-layer-3"></div>
      {children}
    </div>
  );
}

export default StarryBackground;