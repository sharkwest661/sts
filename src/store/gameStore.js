// src/store/gameStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Sample initial game state
const initialState = {
  // Game meta
  gameStarted: false,
  gameTick: 0,
  gameSpeed: 1,
  lastSaved: null,

  // Company data
  companyName: "",
  companyValuation: 0,
  cash: 10000,
  revenue: 0,
  expenses: 0,

  // Startup data
  startupIdea: null,
  marketPotential: 0,
  productComplexity: 0,
  legalRisk: 0,

  // Office data
  officeLevel: 0,
  officeCapacity: 5,

  // Progress metrics
  reputation: {
    industry: 0,
    employer: 0,
    customer: 0,
  },

  // Game flags
  tutorialCompleted: false,
  achievementsUnlocked: [],
};

// Create the store
const useGameStore = create(
  persist(
    (set, get) => ({
      // State
      ...initialState,

      // Actions
      setCompanyName: (name) => set({ companyName: name }),

      selectStartupIdea: (idea) =>
        set({
          startupIdea: idea,
          marketPotential: idea.marketPotential,
          productComplexity: idea.complexity,
          legalRisk: idea.legalRisk,
          gameStarted: true,
        }),

      incrementTick: () => {
        const state = get();
        set({
          gameTick: state.gameTick + 1,
        });

        // Process passive income on each tick
        if (state.revenue > 0) {
          set({
            cash: state.cash + (state.revenue - state.expenses) / (24 * 60), // Per minute
          });
        }
      },

      upgradeOffice: () => {
        const state = get();
        const upgradeCost = 5000 * (state.officeLevel + 1);

        if (state.cash >= upgradeCost) {
          set({
            cash: state.cash - upgradeCost,
            officeLevel: state.officeLevel + 1,
            officeCapacity: state.officeCapacity + 5,
          });
          return true;
        }
        return false;
      },

      updateReputation: (type, amount) => {
        const state = get();
        set({
          reputation: {
            ...state.reputation,
            [type]: Math.max(0, Math.min(100, state.reputation[type] + amount)),
          },
        });
      },

      unlockAchievement: (achievementId) => {
        const state = get();
        if (!state.achievementsUnlocked.includes(achievementId)) {
          set({
            achievementsUnlocked: [
              ...state.achievementsUnlocked,
              achievementId,
            ],
          });
        }
      },

      resetGame: () => set(initialState),

      saveGame: () => set({ lastSaved: new Date().toISOString() }),
    }),
    {
      name: "startup-simulator-storage",
    }
  )
);

export default useGameStore;
