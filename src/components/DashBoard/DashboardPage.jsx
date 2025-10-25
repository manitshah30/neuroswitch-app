import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { databases } from '../../appwrite/config';
import { Query } from 'appwrite';
import { isDailyRewardAvailable, claimDailyReward } from '../../utils/progressUtils';

import MissionCard from './MissionCard';
import DailyRewardCard from './DailyRewardCard';
import StarryBackground from '../effects/StarryBackground';
import CognitiveCoreCard from './CognitiveCoreCard';
import CogCoreCard from './CogCoreCard'; // Assuming this component exists
import LearningUniverse from './LearningUniverse'; // Assuming this component exists
import AchievementsCard from './AchievementsCard';
// REMOVED: WeeklyRanksCard import

// Get IDs from environment variables
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const LESSONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_LESSONS_TABLE_ID;
const PERFORMANCE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PERFORMANCEMETRICS_ID;
// REMOVED: USERPROGRESS_COLLECTION_ID is no longer needed here

// --- Define Achievements ---
const ALL_ACHIEVEMENTS = [
  { id: 'lesson1', name: 'First Steps', description: 'Complete your first lesson.', icon: '🚀' },
  { id: 'phase1', name: 'Phase 1 Complete', description: 'Complete all 7 lessons in Phase 1.', icon: '⭐' },
  { id: 'xp100', name: 'XP Explorer', description: 'Reach 100 Total XP.', icon: '💡' },
  { id: 'xp500', name: 'XP Adept', description: 'Reach 500 Total XP.', icon: '🌟' },
  { id: 'xp1000', name: 'XP Master', description: 'Reach 1000 Total XP.', icon: '🏆' },
  { id: 'perfAttention', name: 'Sharp Shooter', description: 'Achieve 100% Attention Score in a lesson.', icon: '🎯' },
  { id: 'perfMemory', name: 'Memory Whiz', description: 'Achieve 100% Memory Score in a lesson.', icon: '🧠' },
  { id: 'perfSpeed', name: 'Lightning Fast', description: 'Achieve 100% Speed Score in a lesson.', icon: '⚡' },
  { id: 'perfPerfect', name: 'Perfectionist', description: 'Achieve 100% in all scores in a single lesson.', icon: '💯' },
];


function DashboardPage() {
  const { currentUser, userProgress, totalXP, addXPToState, loading } = useAuth();

  const [currentMission, setCurrentMission] = useState(null);
  const [averageScores, setAverageScores] = useState(null);
  // REMOVED: leaderboard state
  const [isRewardAvailable, setIsRewardAvailable] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [performanceHistory, setPerformanceHistory] = useState([]);


  // --- Combined useEffect for fetching data (excluding leaderboard) ---
  useEffect(() => {
    if (!currentUser || loading) return;

    const fetchAllData = async () => {
      try {
        // Fetch Performance History
        const perfResponse = await databases.listDocuments(
          DATABASE_ID,
          PERFORMANCE_COLLECTION_ID,
          [Query.equal('userId', currentUser.$id)]
        );
        const history = perfResponse.documents;
        setPerformanceHistory(history);

        // Calculate Average Scores
        if (history.length > 0) {
            const sums = history.reduce((acc, score) => {
              acc.attention += score.attentionScore || 0;
              acc.memory += score.memoryScore || 0;
              acc.speed += score.speedScore || 0;
              return acc;
            }, { attention: 0, memory: 0, speed: 0 });
            const averages = {
              attention: Math.round(sums.attention / history.length),
              memory: Math.round(sums.memory / history.length),
              speed: Math.round(sums.speed / history.length),
            };
            setAverageScores(averages);
        } else {
            setAverageScores({ attention: 0, memory: 0, speed: 0 });
        }

        // Check Daily Reward
        const available = await isDailyRewardAvailable(currentUser.$id);
        setIsRewardAvailable(available);

        // REMOVED: Leaderboard fetching logic

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setAverageScores({ attention: 0, memory: 0, speed: 0 });
        setIsRewardAvailable(false);
      }
    };

    fetchAllData();

  }, [currentUser, loading]); // REMOVED: totalXP dependency no longer needed here


  // --- useEffect to fetch the current mission ---
  useEffect(() => {
    const fetchCurrentMission = async () => {
        if (typeof userProgress === 'number' && userProgress < 7) {
          try {
            const response = await databases.listDocuments(
              DATABASE_ID,
              LESSONS_COLLECTION_ID,
              [Query.equal('lessonId', userProgress + 1)]
            );
            if (response.documents.length > 0) {
              setCurrentMission(response.documents[0]);
            } else {
              setCurrentMission({ title: `Lesson ${userProgress + 1} Coming Soon`, description: "Keep up the great work!" });
            }
          } catch (error) {
            console.error("Failed to fetch current mission:", error);
            setCurrentMission({ title: "Error Loading Mission", description: "Could not load next lesson." });
          }
        } else if (userProgress >= 7) {
          setCurrentMission({ title: "All lessons completed!", description: "Check back later for new content." });
        } else {
           setCurrentMission(null);
        }
      };
      if (!loading) {
        fetchCurrentMission();
      }
  }, [userProgress, loading]);

  // --- useEffect to check which achievements are earned ---
  useEffect(() => {
    if (loading || averageScores === null || userProgress === null || totalXP === null) return;

    const checkAchievements = () => {
      const earned = [];
      if (userProgress >= 1) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'lesson1'));
      if (userProgress >= 7) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'phase1'));
      if (totalXP >= 100) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'xp100'));
      if (totalXP >= 500) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'xp500'));
      if (totalXP >= 1000) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'xp1000'));
      const hasPerfectAttention = performanceHistory.some(h => h.attentionScore === 100);
      const hasPerfectMemory = performanceHistory.some(h => h.memoryScore === 100);
      const hasPerfectSpeed = performanceHistory.some(h => h.speedScore === 100);
      const hasPerfectLesson = performanceHistory.some(h =>
          h.attentionScore === 100 && h.memoryScore === 100 && h.speedScore === 100
      );
      if (hasPerfectAttention) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'perfAttention'));
      if (hasPerfectMemory) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'perfMemory'));
      if (hasPerfectSpeed) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'perfSpeed'));
      if (hasPerfectLesson) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'perfPerfect'));
      const finalEarned = earned.filter(Boolean);
      setEarnedAchievements(finalEarned);
    };
    checkAchievements();
  }, [userProgress, totalXP, performanceHistory, loading, averageScores]);

  const handleClaimReward = async () => {
     if (!currentUser || !isRewardAvailable) return;
     setIsClaiming(true);
     const dailyRewardAmount = 100;
     const success = await claimDailyReward(currentUser.$id, dailyRewardAmount);
     if (success) {
       setIsRewardAvailable(false);
       addXPToState(dailyRewardAmount);
     }
     setIsClaiming(false);
  };

  if (loading || averageScores === null) {
      return (
        <StarryBackground>
          <div className="min-h-screen flex items-center justify-center text-white">
            Loading Dashboard...
          </div>
        </StarryBackground>
      );
  }

  return (
    <StarryBackground>
      <div className="relative z-10 min-h-screen">
        <main className="p-8">
            <div className="mb-8">
                <h1 className="text-5xl font-bold text-white tracking-tight">
                Welcome back, {currentUser?.name || 'Player'}!
                </h1>
                <p className="text-yellow-400 text-2xl font-bold mt-2">
                  Total XP: {(totalXP || 0).toLocaleString()}
                </p>
            </div>

            {/* --- CORRECTED SIDE-BY-SIDE LAYOUT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* MissionCard takes 2 columns on large screens */}
                <div className="lg:col-span-2">
                    <Link to="/games/vocabulary">
                        <MissionCard
                        missionTitle={currentMission ? (userProgress < 7 ? `Lesson ${userProgress + 1}: ${currentMission.title}` : currentMission.title) : "Loading Mission..."}
                        missionDescription={currentMission?.description || "Continue your learning journey."}
                        rewardXP="+250"
                        />
                    </Link>
                </div>
                {/* DailyRewardCard takes 1 column on large screens */}
                <DailyRewardCard
                  isClaimed={!isRewardAvailable}
                  isClaiming={isClaiming}
                  onClaim={handleClaimReward}
                />
            </div>
            {/* --- END CORRECTED LAYOUT --- */}


          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-8">Your Performance Data</h2>
            <div className="w-full max-w-4xl mx-auto h-[450px]">
              <CognitiveCoreCard averageScores={averageScores} />
            </div>
            <div className="mt-12 max-w-4xl mx-auto h-[500px]">
              <CogCoreCard averageScores={averageScores} />
            </div>
          </div>
          <LearningUniverse />
          <section className="py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white">Community & Progression</h2>
            </div>
            {/* REMOVED: Adjusted grid, only AchievementsCard remains */}
            <div className="max-w-3xl mx-auto"> {/* Centered the remaining card */}
                <AchievementsCard achievements={earnedAchievements} />
                {/* REMOVED: WeeklyRanksCard */}
            </div>
          </section>
        </main>
      </div>
    </StarryBackground>
  );
}

export default DashboardPage;

