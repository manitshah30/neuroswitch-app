import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { account } from "../appwrite/config";
import { ID } from "appwrite";
import logoImg from "../assets/Logo.png";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom'; // Keep useNavigate if login navigates

function SignInPage() {
  const { login } = useAuth();
  const navigate = useNavigate(); // Keep navigate if login uses it
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // REMOVED: No longer need verificationSent state
  // const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    // REMOVED: No longer need to reset verificationSent
    // setVerificationSent(false);

    try {
      if (isLoginMode) {
        // Login logic (remains the same)
        await login(email, password);
        // Login function in AuthContext handles navigation
      } else {
        // Sign-up logic
        console.log("Creating new user account with name:", name);

        // Step 1: Create the user account
        const newUser = await account.create(ID.unique(), email, password, name);
        console.log("User created successfully:", newUser.$id);

        // REMOVED: Step 1.5 - Email Verification call is removed
        // try { ... account.createVerification ... } catch { ... }

        // Step 2: Log the new user in immediately after creation
        console.log("Logging in new user...");
        await login(email, password); // Re-enabled immediate login

        console.log("Signup and login process completed successfully!");
      }
    } catch (err) {
      // Keep existing error handling
      if (err.code === 409) {
          setError("An account with this email already exists. Please log in or use a different email.");
      } else if (err.code === 400 && err.message.includes('Password must be at least 8 characters')) {
          setError("Password must be at least 8 characters long.");
      } else {
          setError(err.message || "An unknown error occurred.");
      }
      console.error("Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    try {
      account.createOAuth2Session(
        "google",
        `${window.location.origin}/dashboard`,
        `${window.location.origin}/signin`
      );
    } catch (err) {
      setError(err.message);
      console.error("Google Sign-In error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2a3e] to-[#1c1c2b] flex flex-col justify-center items-center p-4 text-white">
      <div className="w-full max-w-md bg-[#25273a] p-8 rounded-2xl shadow-2xl">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <img
            src={logoImg}
            alt="NeuroSwitch Logo"
            className="w-16 h-16 mx-auto mb-2"
          />
          <h1 className="text-3xl font-bold text-white">NeuroSwitch</h1>
        </div>

        {/* Login/Sign Up Toggle */}
         <div className="bg-[#3c3e52] rounded-full flex p-1 mb-6">
          <button
            // REMOVED: Resetting verificationSent
            onClick={() => { setIsLoginMode(true); setError(''); setName('');}}
            className={`w-1/2 p-2 rounded-full font-semibold transition-colors duration-300 ${
              isLoginMode ? "bg-[#8A63D2] text-white" : "text-gray-400"
            }`}
          >
            Login
          </button>
          <button
             // REMOVED: Resetting verificationSent
            onClick={() => { setIsLoginMode(false); setError('');}}
            className={`w-1/2 p-2 rounded-full font-semibold transition-colors duration-300 ${
              !isLoginMode ? "bg-[#8A63D2] text-white" : "text-gray-400"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* REMOVED: Verification Sent Message */}
        {/* {verificationSent && !error && ( ... )} */}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Input (Conditional) */}
          {!isLoginMode && (
             <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required={!isLoginMode} // Only required in Sign Up mode
                className="w-full px-4 py-3 bg-[#3c3e52] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A63D2]"
              />
            </div>
          )}

          {/* Email Input */}
           <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 bg-[#3c3e52] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A63D2]"
            />
          </div>

          {/* Password Input */}
            <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password (min. 8 characters)"
              required
              minLength={8}
              className="w-full px-4 py-3 bg-[#3c3e52] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A63D2]"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Submit Button */}
            <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#8A63D2] hover:bg-[#7a58b9] rounded-lg font-semibold text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Processing..."
              : isLoginMode
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        {/* OR Divider */}
         <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Google Sign In Button */}
         <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full py-3 bg-[#3c3e52] hover:bg-[#4a4c62] rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-colors duration-300"
        >
          <FcGoogle size={22} /> Continue with Google
        </button>
      </div>
    </div>
  );
}

export default SignInPage;

