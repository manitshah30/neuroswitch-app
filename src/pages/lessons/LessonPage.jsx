import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { calculateCognitiveScores, saveScores, calculateXPEarned } from "../../utils/scoringUtils";
import { addXP } from "../../utils/progressUtils";

// --- PHASE 1 COMPONENTS ---
import Step1_FlipCard from "../../components/Lessons/Step1_FlipCard";
import Step2_EmojiMatch from "../../components/Lessons/Step2_EmojiMatch";
import Step3_MultipleChoice from "../../components/Lessons/Step3_MultipleChoice";

// --- PHASE 2 COMPONENTS ---
import Step_MatchColumn from "../../components/Lessons/Step_MatchColumn"; 
import PictureMatchingBoard from "../../components/Games/PictureMatchingBoard";

// --- PHASE 3 COMPONENTS ---
import Step_AudioExposure from "../../components/Lessons/Step_AudioExposure";
import Step_AudioQuiz from "../../components/Lessons/Step_AudioQuiz";

// --- PHASE 4 COMPONENTS ---
import Step_SentenceBuilder from "../../components/Lessons/Step_SentenceBuilder";

import StarryBackground from "../../components/effects/StarryBackground";
import ProgressBar from "../../components/Lessons/ProgressBar";
import LessonResults from "../../components/Lessons/LessonResults";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
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
  const [isCurrentStepComplete, setIsCurrentStepComplete] = useState(false);
  
  // --- FIX: Add Processing State to prevent double clicks ---
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
        setLoading(true);
        setError(null);
        setCurrentStep(0);
        setPerformanceData([]);
        setShowResults(false);
        setFinalScores(null);
        setIsCurrentStepComplete(false); 
        setIsProcessing(false); // Reset processing state

        try {
          const response = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.equal("lessonId", parseInt(lessonId)),
          ]);

          if (response.documents.length > 0) {
            const fetchedLesson = response.documents[0];
            try {
                fetchedLesson.steps = JSON.parse(fetchedLesson.steps);
                setLesson(fetchedLesson);
                
                // --- CHECK INITIAL STEP TYPE ---
                const firstStepType = fetchedLesson.steps[0]?.type;
                const interactiveSteps = [
                    'flipCard', 
                    'matchColumn', 
                    'pictureAssociation', 
                    'audioExposure', 
                    'audioQuiz',
                    'sentenceBuilder'
                ];
                
                if (interactiveSteps.includes(firstStepType)) { 
                   setIsCurrentStepComplete(false);
                } else { 
                   setIsCurrentStepComplete(false);
                }
            } catch (parseError) {
                console.error("Error parsing lesson steps JSON:", parseError);
                setError("Failed to parse lesson content.");
            }
          } else {
            setError(`Lesson with ID ${lessonId} not found.`);
          }
        } catch (err) {
          setError("Failed to fetch lesson data. Please check connection or IDs.");
          console.error("Appwrite fetch error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchLesson();
  }, [lessonId]);

  const handleStepCompletion = (isComplete) => {
    setIsCurrentStepComplete(isComplete);
  };

  const handleAnswerEvent = (eventData) => {
    setPerformanceData(prevData => [...prevData, eventData]);
  };

  const handleNext = async () => {
    // Prevent double execution if already processing
    if (isProcessing) return;

    if (!isCurrentStepComplete && currentStep < lesson.steps.length - 1) {
        return; 
    }

    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // --- RESET COMPLETION FOR NEXT STEP ---
      const nextStepType = lesson.steps[currentStep + 1]?.type;
      const interactiveSteps = [
          'flipCard', 
          'matchColumn', 
          'pictureAssociation', 
          'audioExposure', 
          'audioQuiz',
          'sentenceBuilder'
      ];
      
      if (interactiveSteps.includes(nextStepType)) { 
           setIsCurrentStepComplete(false);
      } else { 
           setIsCurrentStepComplete(false); 
      }

    } else {
      // --- FINISH LESSON LOGIC (Submit Data) ---
      
      // 1. Set Processing to True immediately to block further clicks
      setIsProcessing(true);

      console.log("--- Performance Data ---", performanceData);
      
      const scores = calculateCognitiveScores(performanceData);
      setFinalScores(scores);
      
      const xpEarned = calculateXPEarned(scores);
      
      try {
        if (currentUser && lesson) {
          await saveScores(currentUser.$id, lesson.lessonId, scores);
          await addXP(currentUser.$id, xpEarned);
        }
        
        const lessonIndex = location.state?.lessonIndex;
        if (typeof lessonIndex === 'number') {
          await completeCurrentLesson(lessonIndex);
        }
      } catch (err) {
        console.error("Error saving lesson progress:", err);
        // Optional: Handle error UI here if save fails
      } finally {
        // We do NOT set isProcessing(false) here because we are moving to the Results screen
        // and we don't want the user clicking "Finish" again.
        setShowResults(true);
      }
    }
  };

  const handlePrevious = () => {
    if (isProcessing) return; // Block prev button too if processing

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const prevStepType = lesson.steps[currentStep - 1]?.type;
      const interactiveSteps = ['flipCard', 'matchColumn', 'pictureAssociation', 'audioExposure', 'audioQuiz', 'sentenceBuilder'];
      
      if (interactiveSteps.includes(prevStepType)) { 
           setIsCurrentStepComplete(false);
      } else { 
           setIsCurrentStepComplete(true); 
      }
    } else {
      const id = parseInt(lessonId);
      if (id >= 22) {
          navigate("/games/story");
      } else if (id >= 15) {
          navigate("/games/scramble");
      } else if (id >= 8) {
          navigate("/games/association");
      } else {
          navigate("/games/vocabulary");
      }
    }
  };

  const renderStep = () => {
    const stepInfo = lesson.steps[currentStep];
    if (!stepInfo || !stepInfo.type) { return null; }

    const commonProps = {
        key: currentStep, 
        data: stepInfo.data,
        onAnswer: handleAnswerEvent,
        onStepComplete: handleStepCompletion
    };

    switch (stepInfo.type) {
        // --- PHASE 1 ---
        case "flipCard": return <Step1_FlipCard {...commonProps} />;
        case "emojiMatch": return <Step2_EmojiMatch {...commonProps} />;
        case "multipleChoice": return <Step3_MultipleChoice {...commonProps} />;
        
        // --- PHASE 2 ---
        case "matchColumn": return <Step_MatchColumn {...commonProps} />;
        case "pictureAssociation": return <PictureMatchingBoard {...commonProps} />;

        // --- PHASE 3 ---
        case "audioExposure": return <Step_AudioExposure {...commonProps} />;
        case "audioQuiz": return <Step_AudioQuiz {...commonProps} />;

        // --- PHASE 4 ---
        case "sentenceBuilder": return <Step_SentenceBuilder {...commonProps} />;

        default:
            console.warn("Rendering unknown step type:", stepInfo.type);
            return <div className="text-yellow-400">Unknown step type: {stepInfo.type}</div>;
    }
  };

  const handleContinue = () => { 
      const id = parseInt(lessonId);
      if (id >= 22) {
        navigate("/games/story");
      } else if (id >= 15) {
        navigate("/games/audio");
      } else if (id >= 8) {
        navigate("/games/picture-association");
      } else {
        navigate("/games/vocabulary");
      }
  };

  if (loading) {
    return <StarryBackground><div className="min-h-screen flex items-center justify-center text-white text-xl">Loading Lesson...</div></StarryBackground>;
  }
  if (error) {
     return <StarryBackground><div className="min-h-screen flex items-center justify-center text-red-400 text-xl p-4 text-center">{error}</div></StarryBackground>;
  }
  if (!lesson || !lesson.steps || lesson.steps.length === 0 || !lesson.steps[currentStep]) {
       return <StarryBackground><div className="min-h-screen flex items-center justify-center text-white text-2xl p-4 text-center">Lesson data invalid.</div></StarryBackground>;
  }

  return (
    <StarryBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 relative z-10">
        {showResults ? (
          <LessonResults scores={finalScores} onContinue={handleContinue} />
        ) : (
          <div className="w-full max-w-lg md:max-w-4xl bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col justify-between min-h-[90vh] sm:min-h-[80vh] md:min-h-[700px]">
            <header className="text-center mb-4 sm:mb-6 md:mb-8">
               <h1 className="text-2xl sm:text-3xl font-bold text-purple-400">{`Level ${lesson.lessonId}: ${lesson.title}`}</h1>
              
              <div className="flex items-center justify-center gap-2 mt-1 sm:mt-2">
                <p className="text-sm sm:text-base text-gray-400">{`Step ${currentStep + 1}`}</p>
                {lesson.steps.map((_, index) => (
                  <div key={index} className={`w-2 h-2 rounded-full transition-colors ${ index === currentStep ? "bg-purple-400" : "bg-gray-600" }`}></div>
                ))}
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-purple-300 mt-1">
                {lesson.steps[currentStep]?.title || 'Loading Step...'}
              </h2>
              <ProgressBar current={currentStep + 1} total={lesson.steps.length} />
            </header>

            <main className="flex-grow flex items-center justify-center my-4 sm:my-6 overflow-y-auto w-full">
              {renderStep()}
            </main>

            <footer className="flex justify-between items-center mt-4 sm:mt-6 md:mt-8 gap-x-4 px-2 sm:px-0">
              <button
                onClick={handlePrevious}
                // Also disable previous if processing (optional, but good UX)
                disabled={isProcessing}
                className={`bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-3 sm:py-3 sm:px-6 rounded-lg transition-colors text-sm sm:text-base flex items-center gap-1 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                 <FaArrowLeft className="inline-block text-xs sm:text-sm" /> Previous
              </button>
              
              <button
                onClick={handleNext}
                // --- DISABLE IF NOT COMPLETE OR IF PROCESSING ---
                disabled={!isCurrentStepComplete || isProcessing}
                className={`bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 px-3 sm:py-3 sm:px-6 rounded-lg shadow-lg shadow-purple-500/30 transition-opacity text-sm sm:text-base flex items-center gap-1 
                    ${(!isCurrentStepComplete || isProcessing) ? 'opacity-50 cursor-not-allowed filter grayscale' : 'hover:opacity-90'}`}
              >
                {isProcessing 
                    ? "Saving..." 
                    : (currentStep === lesson.steps.length - 1 ? "Finish Lesson" : "Next")
                }
                 {!isProcessing && <FaArrowRight className="inline-block text-xs sm:text-sm" />}
              </button>
            </footer>
          </div>
        )}
      </div>
    </StarryBackground>
  );
}

export default LessonPage;