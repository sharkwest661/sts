// src/store/achievementStore.js (Fixed Version)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";

// Define all achievements
const ACHIEVEMENTS = [
  // Company milestones
  {
    id: "first_steps",
    title: "First Steps",
    description: "Start your own startup",
    icon: "🚀",
    category: "company",
    hidden: false,
    checkUnlock: (state) => state.gameStarted,
    reward: null, // Just an achievement with no reward
  },
  // ... rest of the achievements array remains the same
];

// Create the achievement store
const useAchievementStore = create(
  persist(
    (set, get) => ({
      // Achievement state
      achievements: ACHIEVEMENTS.map((achievement) => ({
        ...achievement,
        unlocked: false,
        unlockDate: null,
        rewardClaimed: false,
      })),
      isCheckingAchievements: false, // Add guard flag to prevent recursive checks

      // Check for newly unlocked achievements
      checkAchievements: () => {
        // Guard against recursive checks
        if (get().isCheckingAchievements) return;

        // Set checking flag
        set({ isCheckingAchievements: true });

        try {
          if (!window.gameStore) {
            set({ isCheckingAchievements: false });
            return;
          }

          const gameState = window.gameStore.getState();

          // Collect other store states if available - using safe access patterns
          const otherStores = {
            teamStore: window.teamStore ? window.teamStore.getState() : null,
            productStore: window.productStore
              ? window.productStore.getState()
              : null,
            marketingStore: window.marketingStore
              ? window.marketingStore.getState()
              : null,
            investorStore: window.investorStore
              ? window.investorStore.getState()
              : null,
          };

          // Check each achievement
          const updatedAchievements = get().achievements.map((achievement) => {
            // Skip already unlocked achievements
            if (achievement.unlocked) return achievement;

            // Check if achievement should be unlocked
            // Add try/catch to prevent errors from one achievement check breaking others
            try {
              if (achievement.checkUnlock(gameState, otherStores)) {
                // Add notification for new achievement
                gameState.addNotification({
                  title: "Achievement Unlocked!",
                  message: `${achievement.title} - ${achievement.description}`,
                  type: "achievement",
                });

                // Return updated achievement
                return {
                  ...achievement,
                  unlocked: true,
                  unlockDate: new Date().toISOString(),
                  rewardClaimed: false,
                };
              }
            } catch (error) {
              console.error(
                `Error checking achievement ${achievement.id}:`,
                error
              );
            }

            return achievement;
          });

          // Use shallow comparison to prevent unnecessary updates
          if (!shallow(updatedAchievements, get().achievements)) {
            set({ achievements: updatedAchievements });
          }
        } catch (error) {
          console.error("Error checking achievements:", error);
        } finally {
          // Always clear the flag, even if there's an error
          set({ isCheckingAchievements: false });
        }
      },

      // Get all unlocked achievements
      getUnlockedAchievements: () => {
        return get().achievements.filter((achievement) => achievement.unlocked);
      },

      // Get achievements by category
      getAchievementsByCategory: (category) => {
        return get().achievements.filter(
          (achievement) =>
            achievement.category === category &&
            (!achievement.hidden || achievement.unlocked)
        );
      },

      // Claim achievement reward
      claimAchievementReward: (achievementId) => {
        const achievement = get().achievements.find(
          (a) => a.id === achievementId
        );

        if (
          !achievement ||
          !achievement.unlocked ||
          achievement.rewardClaimed ||
          !achievement.reward
        ) {
          return { success: false, message: "Cannot claim reward" };
        }

        // Process reward based on type
        const reward = achievement.reward;

        if (!window.gameStore) {
          return { success: false, message: "Game store not available" };
        }

        const gameState = window.gameStore.getState();

        try {
          switch (reward.type) {
            case "cash":
              gameState.updateCash(reward.value);
              break;
            case "reputation":
              gameState.updateReputation(reward.subtype, reward.value);
              break;
            case "users":
              // Update users directly in game state
              if (gameState.users !== undefined) {
                gameState.updateUsers(reward.value);
              }
              break;
            case "teamBoost":
              // Apply team boost if teamStore is available
              if (window.teamStore) {
                const teamStore = window.teamStore.getState();
                teamStore.teamMembers.forEach((member) => {
                  teamStore.updateTeamMember(member.id, {
                    morale: Math.min(100, member.morale + reward.value),
                  });
                });
              }
              break;
            default:
              break;
          }

          // Mark reward as claimed
          set({
            achievements: get().achievements.map((a) =>
              a.id === achievementId ? { ...a, rewardClaimed: true } : a
            ),
          });

          // Add notification about claimed reward
          gameState.addNotification({
            title: "Reward Claimed",
            message: `You claimed the reward for "${achievement.title}"`,
            type: "achievement",
          });

          return { success: true };
        } catch (error) {
          console.error("Error claiming achievement reward:", error);
          return { success: false, message: "Error processing reward" };
        }
      },

      // Reset achievements (for new game)
      resetAchievements: () => {
        set({
          achievements: ACHIEVEMENTS.map((achievement) => ({
            ...achievement,
            unlocked: false,
            unlockDate: null,
            rewardClaimed: false,
          })),
          isCheckingAchievements: false,
        });
      },
    }),
    {
      name: "startup-simulator-achievements-storage",
    }
  )
);

// Share with window for cross-store access
if (typeof window !== "undefined") {
  window.achievementStore = useAchievementStore;
}

export default useAchievementStore;
