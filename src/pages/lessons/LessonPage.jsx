import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// NEW: Import the new XP calculation function
import { calculateCognitiveScores, saveScores, calculateXPEarned } from "../../utils/scoringUtils";
// NEW: Import the addXP function
import { addXP } from "../../utils/progressUtils"; 
import Step1_FlipCard from "../../components/lessons/Step1_FlipCard";
import Step2_EmojiMatch from "../../components/lessons/Step2_EmojiMatch";
import Step3_MultipleChoice from "../../components/lessons/Step3_MultipleChoice";
import StarryBackground from "../../components/effects/StarryBackground";
import ProgressBar from "../../components/lessons/ProgressBar";
import LessonResults from "../../components/lessons/LessonResults";
import "../../App.css";

import { databases } from "../../appwrite/config";
import { Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_LESSONS_TABLE_ID;

function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, completeCurrentLesson } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [finalScores, setFinalScores] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.equal("lessonId", parseInt(lessonId)),
          ]);
  
          if (response.documents.length > 0) {
            const fetchedLesson = response.documents[0];
            fetchedLesson.steps = JSON.parse(fetchedLesson.steps);
            setLesson(fetchedLesson);
          } else {
            setError("Lesson not found in the database.");
          }
        } catch (err) {
          setError(
            "Failed to fetch lesson data. Please check your IDs and permissions."
          );
          console.error("Appwrite fetch error:", err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchLesson();
  }, [lessonId]);
  
  const handleAnswerEvent = (eventData) => {
    setPerformanceData(prevData => [...prevData, eventData]);
  };

  if (loading) {
    return (
        <StarryBackground>
            <div className="min-h-screen flex items-center justify-center text-white text-xl">
                Loading Lesson...
            </div>
        </StarryBackground>
    );
  }

  if (error) {
    return (
        <StarryBackground>
            <div className="min-h-screen flex items-center justify-center text-red-400 text-xl">
                {error}
            </div>
        </StarryBackground>
    );
  }

  if (!lesson) {
    return (
        <StarryBackground>
            <div className="min-h-screen flex items-center justify-center text-white text-2xl">
                Lesson data could not be found.
            </div>
        </StarryBackground>
    );
  }

  const handleNext = async () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // --- FINAL UPDATED LOGIC ---
      // 1. Calculate Cognitive Scores
      const scores = calculateCognitiveScores(performanceData);
      setFinalScores(scores);
      
      // 2. Calculate XP Earned from those scores
      const xpEarned = calculateXPEarned(scores);

      // 3. Save scores and add XP if the user is logged in
      if (currentUser && lesson) {
        await saveScores(currentUser.$id, lesson.lessonId, scores);
        await addXP(currentUser.$id, xpEarned); // Add the earned XP
      }
      
      // 4. Update the main lesson progress
      const lessonIndex = location.state?.lessonIndex;
      if (typeof lessonIndex === 'number') {
        await completeCurrentLesson(lessonIndex);
      }
      
      // 5. Show the results screen
      setShowResults(true); 
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/games/vocabulary");
    }
  };

  const renderStep = () => {
    const stepInfo = lesson.steps[currentStep];
    switch (stepInfo.type) {
        case "flipCard":
            return <Step1_FlipCard data={stepInfo.data} onAnswer={handleAnswerEvent} />;
        case "emojiMatch":
            return <Step2_EmojiMatch data={stepInfo.data} onAnswer={handleAnswerEvent} />;
        case "multipleChoice":
            return <Step3_MultipleChoice data={stepInfo.data} onAnswer={handleAnswerEvent} />;
        default:
            return null;
    }
  };
  
  const handleContinue = () => {
    navigate("/games/vocabulary");
  };

  return (
    <StarryBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
        {showResults ? (
          <LessonResults scores={finalScores} onContinue={handleContinue} />
        ) : (
          <div className="w-full max-w-4xl bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-8 flex flex-col justify-between min-h-[650px]">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold text-purple-400">{`Day ${lessonId}: ${lesson.title}`}</h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-gray-400">{`Step ${currentStep + 1}`}</p>
                {lesson.steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? "bg-purple-400" : "bg-gray-600"
                    }`}
                  ></div>
                ))}
              </div>
              <h2 className="text-xl font-semibold text-purple-300 mt-1">
                {lesson.steps[currentStep].title}
              </h2>
              <ProgressBar
                current={currentStep + 1}
                total={lesson.steps.length}
              />
            </header>
            <main className="flex-grow flex items-center justify-center">
              {renderStep()}
            </main>
            <footer className="flex justify-between items-center mt-8">
                <button
                  onClick={handlePrevious}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  &larr; Previous
                </button>
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-purple-500/30 transition-opacity"
                >
                  {currentStep === lesson.steps.length - 1
                    ? "Finish Lesson"
                    : "Next"}{" "}
                  &rarr;
                </button>
            </footer>
          </div>
        )}
      </div>
    </StarryBackground>
  );
}

export default LessonPage;

