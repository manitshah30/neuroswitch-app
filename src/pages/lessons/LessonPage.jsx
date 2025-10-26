import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { calculateCognitiveScores, saveScores, calculateXPEarned } from "../../utils/scoringUtils";
import { addXP } from "../../utils/progressUtils";
import Step1_FlipCard from "../../components/Lessons/Step1_FlipCard"; // Corrected path based on previous context
import Step2_EmojiMatch from "../../components/Lessons/Step2_EmojiMatch"; // Corrected path based on previous context
import Step3_MultipleChoice from "../../components/Lessons/Step3_MultipleChoice"; // Corrected path based on previous context
import StarryBackground from "../../components/effects/StarryBackground";
import ProgressBar from "../../components/Lessons/ProgressBar"; // Corrected path based on previous context
import LessonResults from "../../components/Lessons/LessonResults"; // Corrected path based on previous context
import "../../App.css";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Ensure icons are imported

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
  const [isCurrentStepComplete, setIsCurrentStepComplete] = useState(false); // State from previous fix

  useEffect(() => {
    // --- Existing fetchLesson logic ---
    const fetchLesson = async () => {
        setLoading(true);
        setError(null);
        setCurrentStep(0);
        setPerformanceData([]);
        setShowResults(false);
        setFinalScores(null);
        setIsCurrentStepComplete(false); // Reset completion status
        try {
          const response = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.equal("lessonId", parseInt(lessonId)),
          ]);

          if (response.documents.length > 0) {
            const fetchedLesson = response.documents[0];
            try {
                fetchedLesson.steps = JSON.parse(fetchedLesson.steps);
                setLesson(fetchedLesson);
                 // Need logic here or in step components to set initial completion state
                 // For now, assume step 0 starts incomplete unless it's a type with no actions (like just info)
                 if (fetchedLesson.steps[0]?.type === 'flipCard') { // Flipcard needs interaction
                    setIsCurrentStepComplete(false);
                 } else { // Assume other types might be complete immediately? Adjust as needed.
                    setIsCurrentStepComplete(true);
                 }
            } catch (parseError) {
                console.error("Error parsing lesson steps JSON:", parseError);
                setError("Failed to parse lesson content.");
            }
          } else {
            setError(`Lesson with ID ${lessonId} not found.`);
          }
        } catch (err) {
          setError(
            "Failed to fetch lesson data. Please check connection or IDs."
          );
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

  // Loading/Error/No Lesson checks remain the same...
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
              <div className="min-h-screen flex items-center justify-center text-red-400 text-xl p-4 text-center">
                  {error}
              </div>
          </StarryBackground>
      );
  }
  if (!lesson || !lesson.steps || lesson.steps.length === 0 || !lesson.steps[currentStep]) {
       return (
          <StarryBackground>
              <div className="min-h-screen flex items-center justify-center text-white text-2xl p-4 text-center">
                  Lesson data seems invalid or step is missing.
              </div>
          </StarryBackground>
      );
  }


  const handleNext = async () => {
    if (!isCurrentStepComplete && currentStep < lesson.steps.length - 1) {
        // Optionally show feedback: Alert user they need to finish the step
        console.warn("User tried to advance before completing the step.");
        return; // Stop execution if step not complete
    }

    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Reset completion status for the NEW step
      // We need to determine the initial status based on the *next* step type
       const nextStepType = lesson.steps[currentStep + 1]?.type;
       if (nextStepType === 'flipCard') { // Flipcard needs interaction
           setIsCurrentStepComplete(false);
       } else { // Assume quizzes might start complete until answered? Adjust logic as needed
           setIsCurrentStepComplete(false); // Safer to default to false
       }
    } else {
      // --- Final step logic remains the same ---
      console.log("--- Raw Performance Data Collected ---", performanceData); // Debug log
      const scores = calculateCognitiveScores(performanceData);
      console.log("Final Calculated Scores:", scores); // Debug log
      setFinalScores(scores);
      const xpEarned = calculateXPEarned(scores);
      if (currentUser && lesson) {
        await saveScores(currentUser.$id, lesson.lessonId, scores);
        await addXP(currentUser.$id, xpEarned);
      } else {
         console.error("Cannot save scores or add XP: Missing user or lesson data.");
      }
      const lessonIndex = location.state?.lessonIndex;
      if (typeof lessonIndex === 'number') {
        await completeCurrentLesson(lessonIndex);
      } else {
        console.warn("Lesson index not found in location state. Progress update might be inaccurate if relying on index.");
      }
      setShowResults(true);
      // --- End Final Step Logic ---
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Determine completion status for the PREVIOUS step when going back
      const prevStepType = lesson.steps[currentStep - 1]?.type;
       if (prevStepType === 'flipCard') { // User needs to reach the end again
           setIsCurrentStepComplete(false);
       } else { // Assume quizzes are considered 'complete' once visited?
           setIsCurrentStepComplete(true); // Allow immediate next if they go back then forward
       }
    } else {
      navigate("/games/vocabulary");
    }
  };


  const renderStep = () => {
    const stepInfo = lesson.steps[currentStep];
    if (!stepInfo || !stepInfo.type) { return null; }

    switch (stepInfo.type) {
        case "flipCard":
            return <Step1_FlipCard data={stepInfo.data} onAnswer={handleAnswerEvent} onStepComplete={handleStepCompletion} />;
        case "emojiMatch":
            // Pass the onStepComplete prop here
            return <Step2_EmojiMatch data={stepInfo.data} onAnswer={handleAnswerEvent} onStepComplete={handleStepCompletion} />;
        case "multipleChoice":
             // Pass the onStepComplete prop here
            return <Step3_MultipleChoice data={stepInfo.data} onAnswer={handleAnswerEvent} onStepComplete={handleStepCompletion} />;
        default:
             console.warn("Rendering unknown step type:", stepInfo.type);
            // If unknown types should allow progress, set complete, otherwise leave false
            // setIsCurrentStepComplete(true);
            return <div className="text-yellow-400">Unknown step type: {stepInfo.type}</div>;
    }
  };

  const handleContinue = () => { navigate("/games/vocabulary"); };

  return (
    <StarryBackground>
      {/* Adjusted padding */}
      <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 relative z-10">
        {showResults ? (
          <LessonResults scores={finalScores} onContinue={handleContinue} />
        ) : (
          // Adjusted padding
          <div className="w-full max-w-lg md:max-w-4xl bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col justify-between min-h-[90vh] sm:min-h-[80vh] md:min-h-[700px]">
            <header className="text-center mb-4 sm:mb-6 md:mb-8">
              {/* Header content */}
               <h1 className="text-2xl sm:text-3xl font-bold text-purple-400">{`Day ${lessonId}: ${lesson.title}`}</h1>
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

            <main className="flex-grow flex items-center justify-center my-4 sm:my-6 overflow-y-auto">
              {renderStep()}
            </main>

            {/* --- RESPONSIVE FOOTER FIX v2 --- */}
            {/* Added gap-x-4, adjusted padding, included icons */}
            <footer className="flex justify-between items-center mt-4 sm:mt-6 md:mt-8 gap-x-4 px-2 sm:px-0">
              <button
                onClick={handlePrevious}
                className={`bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-3 sm:py-3 sm:px-6 rounded-lg transition-colors text-sm sm:text-base flex items-center gap-1 ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentStep === 0}
              >
                 <FaArrowLeft className="inline-block text-xs sm:text-sm" /> Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!isCurrentStepComplete}
                className={`bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 px-3 sm:py-3 sm:px-6 rounded-lg shadow-lg shadow-purple-500/30 transition-opacity text-sm sm:text-base flex items-center gap-1 ${!isCurrentStepComplete ? 'opacity-50 cursor-not-allowed filter grayscale' : 'hover:opacity-90'}`}
              >
                {currentStep === lesson.steps.length - 1
                  ? "Finish Lesson"
                  : "Next"}
                 <FaArrowRight className="inline-block text-xs sm:text-sm" />
              </button>
            </footer>
             {/* --- END RESPONSIVE FOOTER FIX v2 --- */}
          </div>
        )}
      </div>
    </StarryBackground>
  );
}

export default LessonPage;

