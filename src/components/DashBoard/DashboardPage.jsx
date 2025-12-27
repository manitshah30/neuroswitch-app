import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { databases } from '../../appwrite/config';
import { Query } from 'appwrite';
import { isDailyRewardAvailable, claimDailyReward } from '../../utils/progressUtils';

import MissionCard from './MissionCard';
import DailyRewardCard from './DailyRewardCard';
import StarryBackground from '../effects/StarryBackground';
import CognitiveCoreCard from './CogCoreCard'; 
import LearningUniverse from './LearningUniverse'; 
import AchievementsCard from './AchievementsCard';

import ClientExport from '../ClientExport';

// Get IDs from environment variables
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const LESSONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_LESSONS_TABLE_ID;
const PERFORMANCE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PERFORMANCEMETRICS_ID;

function DashboardPage() {
  const { currentUser, userProgress, totalXP, addXPToState, loading } = useAuth();

  const [currentMission, setCurrentMission] = useState(null);
  const [averageScores, setAverageScores] = useState(null);
  const [isRewardAvailable, setIsRewardAvailable] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [performanceHistory, setPerformanceHistory] = useState([]);

  // --- Fetch Data ---
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

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setAverageScores({ attention: 0, memory: 0, speed: 0 });
        setIsRewardAvailable(false);
      }
    };

    fetchAllData();

  }, [currentUser, loading]);

  // --- MISSION LOGIC UPDATE ---
  useEffect(() => {
    const fetchCurrentMission = async () => {
        const MAX_LESSONS = 28; 

        if (typeof userProgress === 'number' && userProgress < MAX_LESSONS) {
          try {
            const nextLessonId = userProgress + 1;
            const response = await databases.listDocuments(
              DATABASE_ID,
              LESSONS_COLLECTION_ID,
              [Query.equal('lessonId', nextLessonId)]
            );
            
            if (response.documents.length > 0) {
              setCurrentMission(response.documents[0]);
            } else {
              setCurrentMission({ 
                  title: `Lesson ${nextLessonId}`, 
                  description: "Continue your journey to the next level." 
              });
            }
          } catch (error) {
            console.error("Failed to fetch current mission:", error);
            setCurrentMission({ title: "Mission Unavailable", description: "Could not load mission details." });
          }
        } else if (userProgress >= MAX_LESSONS) {
          setCurrentMission({ title: "Galactic Master!", description: "You have completed all available content." });
        } else {
           setCurrentMission(null);
        }
      };

      if (!loading) {
        fetchCurrentMission();
      }
  }, [userProgress, loading]);

  // --- Achievements Check ---
  useEffect(() => {
    if (loading || averageScores === null || userProgress === null || totalXP === null) return;

    const checkAchievements = () => {
      const earned = [];
      
      // Lesson Progress Checks
      if (userProgress >= 1) earned.push({ id: 'lesson1' });
      if (userProgress >= 7) earned.push({ id: 'phase1' });
      if (userProgress >= 14) earned.push({ id: 'phase2' });
      if (userProgress >= 21) earned.push({ id: 'phase3' });
      if (userProgress >= 28) earned.push({ id: 'phase4' });

      // XP Checks
      if (totalXP >= 100) earned.push({ id: 'xp100' });
      if (totalXP >= 500) earned.push({ id: 'xp500' });
      if (totalXP >= 1000) earned.push({ id: 'xp1000' });
      if (totalXP >= 5000) earned.push({ id: 'xp5000' });
      
      // Performance Checks
      const hasPerfectAttention = performanceHistory.some(h => h.attentionScore === 100);
      const hasPerfectMemory = performanceHistory.some(h => h.memoryScore === 100);
      const hasPerfectSpeed = performanceHistory.some(h => h.speedScore === 100);
      const hasPerfectLesson = performanceHistory.some(h =>
          h.attentionScore === 100 && h.memoryScore === 100 && h.speedScore === 100
      );

      if (hasPerfectAttention) earned.push({ id: 'perfAttention' });
      if (hasPerfectMemory) earned.push({ id: 'perfMemory' });
      if (hasPerfectSpeed) earned.push({ id: 'perfSpeed' });
      if (hasPerfectLesson) earned.push({ id: 'perfPerfect' });
      
      setEarnedAchievements(earned);
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

  // --- LINK LOGIC FOR MISSION CARD ---
  const getMissionLink = () => {
      if (!userProgress) return "/games/vocabulary";
      if (userProgress < 7) return "/games/vocabulary";          // Phase 1
      if (userProgress < 14) return "/games/picture-association"; // Phase 2
      if (userProgress < 21) return "/games/audio";              // Phase 3
      return "/games/story";                                     // Phase 4
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2">
                    <Link to={getMissionLink()}>
                        <MissionCard
                        missionTitle={currentMission ? currentMission.title : "Loading Mission..."}
                        missionDescription={currentMission?.description || "Continue your learning journey."}
                        />
                    </Link>
                </div>
                <DailyRewardCard
                  isClaimed={!isRewardAvailable}
                  isClaiming={isClaiming}
                  onClaim={handleClaimReward}
                />
            </div>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-8">Your Performance Data</h2>

<div className="mb-6">
               <ClientExport />
            </div>

            <div className="w-full max-w-4xl mx-auto h-[500px]">
              <CognitiveCoreCard averageScores={averageScores} />
            </div>
          </div>
          
          <LearningUniverse />
          
          <section className="py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white">Community & Progression</h2>
            </div>
            <div className="max-w-3xl mx-auto"> 
                <AchievementsCard achievements={earnedAchievements} />
            </div>
          </section>
        </main>
      </div>
    </StarryBackground>
  );
}

export default DashboardPage;