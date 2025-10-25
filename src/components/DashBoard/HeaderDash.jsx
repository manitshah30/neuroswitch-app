import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/Logo.png';
// 1. Import the useAuth hook to connect to the "auth brain"
import { useAuth } from '../../context/AuthContext';

function HeaderDash() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 2. Get the current user's data and the logout function from the context
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#1F1E1E]/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center p-4">
        
        {/* Left Side: Logo and Brand Name */}
        <Link to="/dashboard" className="flex items-center gap-3">
          <img src={logoImg} alt="NeuroSwitch Logo" className="w-10 h-10 md:w-14 md:h-14" />
          <span className="text-xl md:text-3xl font-bold text-white">NeuroSwitch</span>
        </Link>

        
        {/* <nav className="hidden md:flex items-center gap-8">
          
          <Link to="/dashboard" className="flex items-center gap-2 text-brand-text hover:text-white transition-colors font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            <span>Dashboard</span>
          </Link>
          <Link to="/learn" className="flex items-center gap-2 text-brand-text-muted hover:text-white transition-colors font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18"></path></svg>
            <span>Learn</span>
          </Link>
          <Link to="/about" className="flex items-center gap-2 text-brand-text-muted hover:text-white transition-colors font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span>About Us</span>
          </Link>
        </nav> */}

        {/* --- MODIFIED PART --- */}
        {/* Right Side: User Profile & Logout (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            {/* 3. Display the logged-in user's name */}
            <p className="font-semibold text-sm text-brand-text">{currentUser?.name || 'User'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center font-bold text-white border-2 border-white/50">
            {/* 4. Display the user's initial */}
            {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
          </div>
          {/* 5. Add a functional Logout button */}
          <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            Logout
          </button>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>

      {/* --- MODIFIED PART --- */}
      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1F1E1E] pb-4">
          <nav className="flex flex-col items-center gap-4">
            <Link to="/dashboard" className="text-brand-text hover:text-white font-semibold">Dashboard</Link>
            <Link to="/learn" className="text-brand-text-muted hover:text-white font-semibold">Learn</Link>
            <Link to="/about" className="text-brand-text-muted hover:text-white font-semibold">About Us</Link>
            {/* 6. Add a Logout button for the mobile menu */}
            <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors mt-2">
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default HeaderDash;

