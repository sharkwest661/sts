// src/store/achievementStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import useGameStore from "./gameStore";
import useTeamStore from "./teamStore";
import useProductStore from "./productStore";
import useMarketingStore from "./marketingStore";
import useInvestorStore from "./investorStore";

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
  {
    id: "first_month",
    title: "One Month Survivor",
    description: "Keep your startup running for one month",
    icon: "📅",
    category: "company",
    hidden: false,
    checkUnlock: (state) => state.gameTime.day >= 30,
    reward: {
      type: "reputation",
      value: 5,
      subtype: "industry",
    },
  },
  {
    id: "first_million",
    title: "Millionaire",
    description: "Reach a company valuation of $1 million",
    icon: "💰",
    category: "company",
    hidden: false,
    checkUnlock: (state) => state.companyValuation >= 1000000,
    reward: {
      type: "cash",
      value: 5000,
    },
  },

  // Team achievements
  {
    id: "first_hire",
    title: "First Hire",
    description: "Hire your first team member",
    icon: "👥",
    category: "team",
    hidden: false,
    checkUnlock: (_, otherStores) =>
      otherStores.teamStore?.teamMembers.length >= 1,
    reward: {
      type: "reputation",
      value: 5,
      subtype: "employer",
    },
  },
  {
    id: "dream_team",
    title: "Dream Team",
    description: "Have a team of 5 or more people with high morale",
    icon: "🌟",
    category: "team",
    hidden: false,
    checkUnlock: (_, otherStores) => {
      const teamStore = otherStores.teamStore;
      if (!teamStore) return false;

      const teamMembers = teamStore.teamMembers;
      return (
        teamMembers.length >= 5 &&
        teamMembers.every((member) => member.morale >= 75)
      );
    },
    reward: {
      type: "teamBoost",
      value: 20,
    },
  },

  // Product achievements
  {
    id: "first_feature",
    title: "Feature Complete",
    description: "Complete your first product feature",
    icon: "✅",
    category: "product",
    hidden: false,
    checkUnlock: (_, otherStores) => {
      const productStore = otherStores.productStore;
      if (!productStore) return false;

      return productStore.features.some(
        (feature) => feature.status === "completed"
      );
    },
    reward: {
      type: "reputation",
      value: 5,
      subtype: "customer",
    },
  },
  {
    id: "first_release",
    title: "Ship It",
    description: "Release the first version of your product",
    icon: "🚢",
    category: "product",
    hidden: false,
    checkUnlock: (_, otherStores) => {
      const productStore = otherStores.productStore;
      if (!productStore) return false;

      return productStore.releases.length >= 1;
    },
    reward: {
      type: "users",
      value: 100,
    },
  },
  {
    id: "bug_hunter",
    title: "Bug Hunter",
    description: "Fix 10 bugs in your product",
    icon: "🐛",
    category: "product",
    hidden: false,
    checkUnlock: (_, otherStores) => {
      const productStore = otherStores.productStore;
      if (!productStore) return false;

      return (
        productStore.bugs.filter((bug) => bug.status === "fixed").length >= 10
      );
    },
    reward: {
      type: "cash",
      value: 2000,
    },
  },

  // Marketing achievements
  {
    id: "first_campaign",
    title: "Marketing 101",
    description: "Run your first marketing campaign",
    icon: "📣",
    category: "marketing",
    hidden: false,
    checkUnlock: (_, otherStores) => {
      const marketingStore = otherStores.marketingStore;
      if (!marketingStore) return false;

      return (
        marketingStore.pastCampaigns.length +
          marketingStore.activeCampaigns.length >=
        1
      );
    },
    reward: {
      type: "reputation",
      value: 5,
      subtype: "customer",
    },
  },
  {
    id: "viral_hit",
    title: "Viral Hit",
    description: "Reach 1,000 users through marketing",
    icon: "📱",
    category: "marketing",
    hidden: false,
    checkUnlock: (state) => state.users >= 1000,
    reward: {
      type: "reputation",
      value: 10,
      subtype: "industry",
    },
  },

  // Investor achievements
  {
    id: "first_investment",
    title: "Funded",
    description: "Secure your first investment",
    icon: "💸",
    category: "investor",
    hidden: false,
    checkUnlock: (_, otherStores) => {
      const investorStore = otherStores.investorStore;
      if (!investorStore) return false;

      return investorStore.investors.length >= 1;
    },
    reward: {
      type: "reputation",
      value: 10,
      subtype: "industry",
    },
  },
  {
    id: "big_money",
    title: "Big Money",
    description: "Raise over $1 million in funding",
    icon: "🤑",
    category: "investor",
    hidden: false,
    checkUnlock: (_, otherStores) => {
      const investorStore = otherStores.investorStore;
      if (!investorStore) return false;

      return investorStore.totalFundingRaised >= 1000000;
    },
    reward: {
      type: "cash",
      value: 10000,
    },
  },
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

      // Check for newly unlocked achievements
      checkAchievements: () => {
        const gameState = useGameStore.getState();

        // Collect other store states if available
        const otherStores = {
          teamStore: window.teamStore?.getState(),
          productStore: window.productStore?.getState(),
          marketingStore: window.marketingStore?.getState(),
          investorStore: window.investorStore?.getState(),
        };

        // Check each achievement
        const updatedAchievements = get().achievements.map((achievement) => {
          // Skip already unlocked achievements
          if (achievement.unlocked) return achievement;

          // Check if achievement should be unlocked
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

          return achievement;
        });

        // Update state if any achievements were unlocked
        if (
          JSON.stringify(updatedAchievements) !==
          JSON.stringify(get().achievements)
        ) {
          set({ achievements: updatedAchievements });
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
        const gameState = useGameStore.getState();

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
              const currentUsers = gameState.users;
              gameState.users = currentUsers + reward.value;
            }
            break;
          case "teamBoost":
            // Would need to be implemented in the team store
            const teamStore = window.teamStore?.getState();
            if (teamStore) {
              // Apply a morale boost to all team members
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
