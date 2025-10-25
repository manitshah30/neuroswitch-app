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
  // --- Filter events for memory score calculation ---
  const flipCardEvents = performanceData.filter(event => event.type === 'flipCard');
  let totalFlipScore = 0; // Default to 0 if no flip card data
  if (flipCardEvents.length > 0) {
    const totalFlips = flipCardEvents.reduce((sum, event) => sum + event.flipCount, 0);
    const averageFlips = totalFlips / flipCardEvents.length;
    // --- FIX: Add Math.min(100, ...) to cap the score ---
    // Score based on average flips. 1 flip = 100, 5 flips = 0. Capped 0-100.
    totalFlipScore = Math.round(Math.min(100, Math.max(0, (1 - (averageFlips - 1) / 4) * 100)));
    // --- END FIX ---
  }

  // --- Filter events for attention and speed scores ---
  const quizEvents = performanceData.filter(
    event => event.type === 'multipleChoice' || event.type === 'emojiMatch'
  );
  let totalCorrect = 0;
  let totalReactionTime = 0;
  if (quizEvents.length > 0) {
    quizEvents.forEach(event => {
      if (event.isCorrect) totalCorrect++;
      totalReactionTime += event.reactionTime;
    });
  }

  // Avoid division by zero
  const attentionScore = quizEvents.length > 0 ? Math.round((totalCorrect / quizEvents.length) * 100) : 100; // Default 100 if no quiz Qs
  const averageReactionTime = quizEvents.length > 0 ? totalReactionTime / quizEvents.length : 0; // Default 0 if no quiz Qs

  // --- FIX: Add Math.min(100, ...) to cap the score ---
  // Speed Score: Higher score for faster average time. Capped 0-100.
  const speedScore = Math.round(Math.min(100, Math.max(0, (1 - (averageReactionTime - 1) / 5) * 100)));
  // --- END FIX ---

  return {
    attentionScore,
    speedScore,
    // Ensure memory score is also explicitly capped here for safety
    memoryScore: Math.min(100, Math.max(0, totalFlipScore)),
  };
};

/**
 * Calculates the XP earned from a lesson based on cognitive scores.
 */
export const calculateXPEarned = (scores) => {
  const { attentionScore, memoryScore, speedScore } = scores;
  const baseXP = 50;
  // Ensure scores used for bonus are capped
  const cappedAttention = Math.min(100, Math.max(0, attentionScore || 0)); // Add fallback
  const cappedMemory = Math.min(100, Math.max(0, memoryScore || 0));    // Add fallback
  const cappedSpeed = Math.min(100, Math.max(0, speedScore || 0));     // Add fallback

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
        // flexibilityScore: null, // If you add this later
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

