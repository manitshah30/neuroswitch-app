import { databases } from '../appwrite/config';
import { Query } from 'appwrite';

// Get IDs from environment variables
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USERPROGRESS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERPROGRESS_TABLE_ID;

/**
 * A helper function to get the full progress document for a user.
 * This is more reusable than just getting the current lesson.
 */
// --- THIS IS THE FIX ---
// Add the 'export' keyword so AuthContext can use this function.
export const getProgressDocument = async (userId) => {
    const response = await databases.listDocuments(
        DATABASE_ID,
        USERPROGRESS_COLLECTION_ID,
        [Query.equal('userId', userId)]
    );
    if (response.documents.length > 0) {
        return response.documents[0];
    }
    return null;
};


/**
 * Get user's current lesson number from the database.
 * NOTE: This function is no longer used by AuthContext, but can be kept for other uses.
 */
export const getUserProgress = async (userId) => {
  try {
    const progressDoc = await getProgressDocument(userId);
    return progressDoc ? progressDoc.currentLesson : 0;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return 0;
  }
};

/**
 * Update user's progress after completing a lesson.
 */
export const updateUserProgress = async (userId, newLesson) => {
  try {
    const progressDoc = await getProgressDocument(userId);
    if (!progressDoc) {
      console.error('No progress document found for user');
      return false;
    }

    const currentLesson = progressDoc.currentLesson;

    if (newLesson > currentLesson) {
      await databases.updateDocument(
        DATABASE_ID,
        USERPROGRESS_COLLECTION_ID,
        progressDoc.$id,
        { currentLesson: newLesson }
      );
      console.log(`✓ Progress updated: Lesson ${currentLesson} → ${newLesson}`);
    }
    return true;
  } catch (error) {
    console.error('Error updating user progress:', error);
    return false;
  }
};

/**
 * Mark a lesson as completed and unlock the next one.
 */
export const completeLesson = async (userId, completedLessonIndex) => {
  const nextLesson = completedLessonIndex + 1;
  return await updateUserProgress(userId, nextLesson);
};


/**
 * Adds a specified amount of XP to a user's total.
 */
export const addXP = async (userId, xpAmount) => {
  try {
    const progressDoc = await getProgressDocument(userId);
    if (!progressDoc) {
        console.error('No progress document found for user to add XP.');
        return false;
    }
    
    const currentXP = progressDoc.totalXP || 0;
    const newTotalXP = currentXP + xpAmount;

    await databases.updateDocument(
      DATABASE_ID,
      USERPROGRESS_COLLECTION_ID,
      progressDoc.$id,
      { totalXP: newTotalXP }
    );

    console.log(`✓ XP Added: ${xpAmount}. New Total: ${newTotalXP}`);
    return true;
  } catch (error) {
    console.error("🔥 Error adding XP:", error);
    return false;
  }
};


/**
 * Checks if the daily reward is available for the user.
 */
export const isDailyRewardAvailable = async (userId) => {
    try {
        const progressDoc = await getProgressDocument(userId);
        if (!progressDoc) return true; // Failsafe for new users

        const lastClaimed = progressDoc.lastClaimedDaily;
        if (!lastClaimed) {
            return true; // Never claimed before
        }

        const lastClaimedDate = new Date(lastClaimed);
        const today = new Date();

        // Check if the last claim was on a day before today
        return (
            lastClaimedDate.getFullYear() < today.getFullYear() ||
            lastClaimedDate.getMonth() < today.getMonth() ||
            lastClaimedDate.getDate() < today.getDate()
        );
    } catch (error) {
        console.error("🔥 Error checking daily reward status:", error);
        return false; // Failsafe, don't show as available on error
    }
};

/**
 * Claims the daily reward for the user, adding XP and updating the claim date.
 */
export const claimDailyReward = async (userId, rewardAmount = 100) => {
    try {
        // First, add the XP
        const xpAdded = await addXP(userId, rewardAmount);
        if (!xpAdded) return false;

        // Then, update the last claimed date to today
        const progressDoc = await getProgressDocument(userId);
        await databases.updateDocument(
            DATABASE_ID,
            USERPROGRESS_COLLECTION_ID,
            progressDoc.$id,
            { lastClaimedDaily: new Date().toISOString() }
        );
        
        console.log(`✓ Daily reward of ${rewardAmount} XP claimed.`);
        return true;
    } catch (error) {
        console.error("🔥 Error claiming daily reward:", error);
        return false;
    }
};

