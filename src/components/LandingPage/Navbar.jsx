import React from 'react'; // Import React
import { Link } from 'react-router-dom';
import logoImg from '../../assets/Logo.png';

function Navbar() {
  return (
    // Adjusted padding for different screen sizes: p-4 default, sm:p-6 on small screens and up
    <header className="absolute top-0 left-0 right-0 z-50 p-4 sm:p-6">
      {/* Ensure container max-width and centering */}
      <div className="container mx-auto flex justify-between items-center max-w-7xl"> {/* Added max-w-7xl for consistency */}
        {/* Left Side: Logo and Brand Name */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3"> {/* Reduced gap on smallest screens */}
          {/* Responsive logo size: smaller default, larger on sm screens and up */}
          <img src={logoImg} alt="NeuroSwitch Logo" className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" /> {/* Adjusted sizes */}
          {/* Responsive text size: smaller default, larger on sm screens and up */}
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">NeuroSwitch</span>
        </Link>

        {/* Right Side: Sign In Button */}
        <Link
          to="/signin"
          // Responsive padding and text size
          className="bg-brand-primary text-slate-800 font-semibold px-4 py-2 sm:px-5 sm:py-2 rounded-lg hover:bg-white transition-colors text-base sm:text-lg md:text-xl" // Adjusted sizes
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
