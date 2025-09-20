import React, { useState } from 'react';
// 1. Import your logo and the Google icon
import logoImg from '../assets/Logo.png';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';

function SignInPage() {
  // 2. State to manage whether we are in "Login" or "Sign Up" mode.
  //    'true' means Login mode is active by default.
  const [isLoginMode, setIsLoginMode] = useState(true);

  // A simple handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would handle the actual login or sign-up logic
    console.log('Form submitted!');
  };

  return (
    // Main container with a gradient background, centering all content
    <div className="min-h-screen bg-gradient-to-br from-[#2a2a3e] to-[#1c1c2b] flex flex-col justify-center items-center p-4 text-white">
      
      {/* The main form card */}
      <div className="w-full max-w-md bg-[#25273a] p-8 rounded-2xl shadow-2xl">
        
        {/* Header with Logo and Brand Name */}
        <div className="text-center mb-8">
          <img src={logoImg} alt="NeuroSwitch Logo" className="w-16 h-16 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-white">NeuroSwitch</h1>
        </div>
        
        {/* Toggle Switch for Login / Sign Up */}
        <div className="bg-[#3c3e52] rounded-full flex p-1 mb-6">
          <button
            onClick={() => setIsLoginMode(true)}
            className={`w-1/2 p-2 rounded-full font-semibold transition-colors duration-300 ${isLoginMode ? 'bg-[#c1cffb] text-white' : 'text-gray-400'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLoginMode(false)}
            className={`w-1/2 p-2 rounded-full font-semibold transition-colors duration-300 ${!isLoginMode ? 'bg-[#c1cffb] text-white' : 'text-gray-400'}`}
          >
            Sign Up
          </button>
        </div>
        
        {/* The Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-[#3c3e52] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A63D2]"
              required
            />
          </div>
          
          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-[#3c3e52] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A63D2]"
              required
            />
          </div>
          
          {/* Conditional Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#c1cffb] hover:bg-[#7a58b9] rounded-lg font-semibold text-white transition-colors duration-300"
          >
            {isLoginMode ? 'Login' : 'Create Account'}
          </button>
        </form>
        
        {/* "OR" Separator */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>
        
        {/* Continue with Google Button */}
        <button
          type="button"
          className="w-full py-3 bg-[#3c3e52] hover:bg-[#4a4c62] rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-colors duration-300"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>
        
      </div>
      <Link to="/dashboard">hhh</Link>
    </div>
  );
}

export default SignInPage;