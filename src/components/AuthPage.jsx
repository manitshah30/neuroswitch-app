import React, { useState } from 'react';
import GlassCard from '../components/GlassCard'; // Reusing our GlassCard
import logoImg from '../assets/Logo.png'; // Reusing our logo

function AuthPage() {
  // This is our state. 'isLogin' will be true or false.
  // We'll use setIsLogin to change it when the user clicks the toggle.
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="bg-brand-background min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <a href="#" className="flex items-center gap-3">
          <img src={logoImg} alt="NeuroSwitch Logo" className="w-12 h-12" />
          <span className="text-2xl font-bold text-white">NeuroSwitch</span>
        </a>
      </div>

      <GlassCard className="w-full max-w-md p-8">
        <div className="mb-8">
          {/* The Toggle Switch */}
          <div className="bg-gray-900/50 p-1 rounded-lg flex">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 rounded-md font-semibold transition-all duration-300 ${isLogin ? 'bg-brand-primary text-slate-800 shadow-lg' : 'text-brand-text-muted'}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 rounded-md font-semibold transition-all duration-300 ${!isLogin ? 'bg-brand-primary text-slate-800 shadow-lg' : 'text-brand-text-muted'}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* We use the 'isLogin' state to decide which form to show */}
        {isLogin ? <LoginForm /> : <SignUpForm />}

        {/* "Or" Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-4 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Google Sign-In */}
        <button className="w-full bg-white/5 border border-white/10 rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-white/10 transition-colors">
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.649-3.361-11.28-7.94l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C41.38,36.783,44,31.016,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
          <span className="font-semibold">Continue with Google</span>
        </button>
      </GlassCard>
    </div>
  );
}

// A simple component for the Login form
function LoginForm() {
  return (
    <form className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-brand-text-muted">Email</label>
        <input type="email" placeholder="you@example.com" className="w-full mt-2 bg-gray-900/50 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-brand-primary" />
      </div>
      <div>
        <label className="text-sm font-semibold text-brand-text-muted">Password</label>
        <input type="password" placeholder="••••••••" className="w-full mt-2 bg-gray-900/50 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-brand-primary" />
      </div>
      <button className="w-full bg-brand-primary text-slate-800 font-bold py-3 rounded-lg hover:bg-white transition-colors">Login</button>
    </form>
  );
}

// A simple component for the Sign Up form
function SignUpForm() {
  return (
    <form className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-brand-text-muted">Full Name</label>
        <input type="text" placeholder="Manit Shah" className="w-full mt-2 bg-gray-900/50 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-brand-primary" />
      </div>
      <div>
        <label className="text-sm font-semibold text-brand-text-muted">Email</label>
        <input type="email" placeholder="you@example.com" className="w-full mt-2 bg-gray-900/50 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-brand-primary" />
      </div>
      <div>
        <label className="text-sm font-semibold text-brand-text-muted">Password</label>
        <input type="password" placeholder="••••••••" className="w-full mt-2 bg-gray-900/50 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-brand-primary" />
      </div>
      <button className="w-full bg-brand-primary text-slate-800 font-bold py-3 rounded-lg hover:bg-white transition-colors">Create Account</button>
    </form>
  );
}

export default AuthPage;