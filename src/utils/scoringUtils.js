import { databases } from '../appwrite/config';
import { ID } from 'appwrite';

// Get IDs from environment variables
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PERFORMANCE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PERFORMANCEMETRICS_ID;

/**
 * Calculates cognitive scores from the raw performance data collected during a lesson.
 * @param {Array} performanceData - An array of performance event objects.
 * @returns {Object} An object containing the calculated scores (capped 0-100).
 */
export const calculateCognitiveScores = (performanceData) => {
  
  // --- 1. MEMORY SCORE CALCULATION ---
  
  const flipCardEvents = performanceData.filter(event => event.type === 'flipCard');
  
  // Phase 2 & 4: Active Working Memory Tasks (Matching & Sentence Building)
  const activeEvents = performanceData.filter(
      event => event.type === 'matchColumn' || event.type === 'pictureMatch' || event.type === 'sentenceBuilder'
  );
  
  const activeMistakes = activeEvents.filter(event => event.isCorrect === false);
  
  // Phase 3: Auditory Recognition
  const audioQuizEvents = performanceData.filter(event => event.type === 'audioQuiz');

  let totalMemoryScore = 0;

  // PRIORITY 1: Active Construction/Matching (Phase 2 & 4)
  // These are the strongest indicators of working memory application.
  if (activeEvents.length > 0) {
    // Start at 100. Deduct 5 points per mistake.
    // (We use a smaller penalty of 5 instead of 10 for sentences because they are harder)
    const penalty = activeMistakes.length * 5;
    totalMemoryScore = Math.max(0, 100 - penalty);
  } 
  // PRIORITY 2: Audio Quiz (Phase 3)
  else if (audioQuizEvents.length > 0) {
    const correctCount = audioQuizEvents.filter(e => e.isCorrect).length;
    totalMemoryScore = Math.round((correctCount / audioQuizEvents.length) * 100);
  }
  // PRIORITY 3: Flip Cards (Phase 1)
  else if (flipCardEvents.length > 0) {
    const totalFlips = flipCardEvents.reduce((sum, event) => sum + event.flipCount, 0);
    const averageFlips = totalFlips / flipCardEvents.length;
    totalMemoryScore = Math.round(Math.min(100, Math.max(0, (1 - (averageFlips - 1) / 4) * 100)));
  }

  // --- 2. ATTENTION (Accuracy) & SPEED CALCULATION ---
  
  // Include ALL game types that involve decision making
  const quizEvents = performanceData.filter(
    event => 
      event.type === 'multipleChoice' || 
      event.type === 'emojiMatch' || 
      event.type === 'matchColumn' || 
      event.type === 'pictureMatch' ||
      event.type === 'audioQuiz' ||
      event.type === 'sentenceBuilder' // Added Phase 4
  );

  let totalCorrect = 0;
  let totalReactionTime = 0;

  if (quizEvents.length > 0) {
    quizEvents.forEach(event => {
      if (event.isCorrect) totalCorrect++;
      // Ensure reactionTime exists, default to slightly slow (3s) if missing
      totalReactionTime += (event.reactionTime || 3); 
    });
  }

  // Attention Score = Accuracy Percentage
  const attentionScore = quizEvents.length > 0 
    ? Math.round((totalCorrect / quizEvents.length) * 100) 
    : 100;

  // Average Reaction Time
  const averageReactionTime = quizEvents.length > 0 
    ? totalReactionTime / quizEvents.length 
    : 0;

  // Speed Score: 
  // Target: < 1.5s is perfect (100%), > 6.5s is too slow (0%).
  const speedScore = Math.round(Math.min(100, Math.max(0, (1 - (averageReactionTime - 1.5) / 5) * 100)));

  return {
    attentionScore,
    speedScore,
    // Ensure memory score is also explicitly capped here for safety
    memoryScore: Math.min(100, Math.max(0, totalMemoryScore)),
  };
};

/**
 * Calculates the XP earned from a lesson based on cognitive scores.
 */
export const calculateXPEarned = (scores) => {
  const { attentionScore, memoryScore, speedScore } = scores;
  const baseXP = 50;
  // Ensure scores used for bonus are capped
  const cappedAttention = Math.min(100, Math.max(0, attentionScore || 0)); 
  const cappedMemory = Math.min(100, Math.max(0, memoryScore || 0));    
  const cappedSpeed = Math.min(100, Math.max(0, speedScore || 0));     

  const performanceBonus = Math.round((cappedAttention + cappedMemory + cappedSpeed) / 3);
  const totalXPEarned = baseXP + performanceBonus;

  console.log(`XP Calculation: Base(${baseXP}) + Bonus(${performanceBonus}) = ${totalXPEarned}`);
  return totalXPEarned;
};


/**
 * Saves the calculated scores to the PerformanceMetrics collection in Appwrite.
 */
export const saveScores = async (userId, lessonId, scores) => {
  try {
    await databases.createDocument(
      DATABASE_ID,
      PERFORMANCE_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        lessonId,
        completedAt: new Date().toISOString(),
        // --- FIX: Ensure saved scores are also capped ---
        attentionScore: Math.min(100, Math.max(0, scores.attentionScore || 0)),
        memoryScore: Math.min(100, Math.max(0, scores.memoryScore || 0)),
        speedScore: Math.min(100, Math.max(0, scores.speedScore || 0)),
      }
      // --- END FIX ---
    );
    console.log("✓ Scores saved successfully for lesson:", lessonId);
    return true;
  } catch (error) {
    console.error("🔥 Error saving scores:", error);
    return false;
  }
};