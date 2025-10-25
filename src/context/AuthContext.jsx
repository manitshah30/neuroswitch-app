import React, { createContext, useState, useEffect, useContext } from 'react';
import { account } from '../appwrite/config';
import { useNavigate } from 'react-router-dom';
// NEW: We will update this file in the next step to get the full document
import { getProgressDocument, completeLesson } from '../utils/progressUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // NEW: userProgress is now an object holding both lesson progress and total XP
  const [userProgress, setUserProgress] = useState({
    currentLesson: null,
    totalXP: null,
  });

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const user = await account.get();
      setCurrentUser(user);
      await fetchUserProgress(user.$id);
    } catch {
      setCurrentUser(null);
      setUserProgress({ currentLesson: null, totalXP: null });
    }
    setLoading(false);
  };

  const fetchUserProgress = async (userId) => {
    try {
      // This function will now return the whole user progress document
      const progressDoc = await getProgressDocument(userId); 
      setUserProgress({
        currentLesson: progressDoc?.currentLesson ?? 0,
        totalXP: progressDoc?.totalXP ?? 0, // Use fallback for safety
      });
    } catch (error) {
      console.error('Error fetching full user progress:', error);
      setUserProgress({ currentLesson: 0, totalXP: 0 });
    }
  };

  const login = async (email, password) => {
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    setCurrentUser(user);
    await fetchUserProgress(user.$id);
    navigate('/dashboard');
  };

  const logout = async () => {
    await account.deleteSession('current');
    setCurrentUser(null);
    setUserProgress({ currentLesson: null, totalXP: null });
    navigate('/signin');
  };

  // UPDATED: This function now refreshes the entire progress state
  const completeCurrentLesson = async (lessonIndex) => {
    if (!currentUser) return false;

    const success = await completeLesson(currentUser.$id, lessonIndex);
    if (success) {
      // After completing a lesson, we MUST re-fetch all progress data
      // to get the new totalXP earned from the lesson.
      await fetchUserProgress(currentUser.$id);
    }
    return success;
  };

  // NEW: A function for instantly updating XP after a daily claim
  const addXPToState = (amount) => {
    setUserProgress(prev => ({
        ...prev,
        totalXP: (prev.totalXP || 0) + amount
    }));
  };

  // Note: We are no longer exporting `refreshProgress` as `fetchUserProgress` does its job better.
  const value = {
    currentUser,
    // Expose the individual values for easy consumption by components
    userProgress: userProgress.currentLesson, 
    totalXP: userProgress.totalXP,
    login,
    logout,
    completeCurrentLesson,
    addXPToState, // Export the new function for the daily reward
    loading,
  };

  if (loading) {
    return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Loading App...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

