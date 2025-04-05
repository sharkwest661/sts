// src/store/gameStore.js (Fixed Version)
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Enhanced GameStore with more gameplay functionality
const useGameStore = create(
  persist(
    (set, get) => ({
      // Game meta
      gameStarted: false,
      gameTick: 0,
      gameSpeed: 1,
      lastSaved: null,
      gameTime: {
        day: 1,
        hour: 9,
        minute: 0,
      },
      isProcessingTick: false, // Guard flag to prevent recursive updates

      // Company data
      companyName: "",
      companyValuation: 500000,
      cash: 10000,
      revenue: 0,
      expenses: 0,
      revenueHistory: [], // Last 12 months
      expensesHistory: [], // Last 12 months
      revenueGrowth: 0, // Percentage

      // Startup data
      startupIdea: null,
      marketPotential: 0,
      productComplexity: 0,
      legalRisk: 0,

      // Office data
      officeLevel: 0,
      officeCapacity: 5,
      officeExpenses: 500,

      // Team data
      teamSize: 0, // Updated from teamStore

      // Progress metrics
      reputation: {
        industry: 10,
        employer: 10,
        customer: 0,
      },
      users: 0,
      userGrowth: 0,
      userChurn: 0,

      // Game events
      events: [],
      notifications: [],
      achievements: [],

      // Game objectives
      objectives: [],

      // Set company name
      setCompanyName: (name) => set({ companyName: name }),

      // Select startup idea
      selectStartupIdea: (idea) =>
        set({
          startupIdea: idea,
          marketPotential: idea.marketPotential,
          productComplexity: idea.complexity,
          legalRisk: idea.legalRisk,
          gameStarted: true,
        }),

      // *** FIXED: Increment game tick to use proper state batching and prevent infinite updates
      incrementTick: () => {
        const state = get();

        // Guard against recursive updates - return early if already processing a tick
        if (state.isProcessingTick) return;

        // Set processing flag
        set({ isProcessingTick: true });

        try {
          // Update game tick
          const newTick = state.gameTick + 1;

          // Update game time (1 tick = 1 minute in game)
          const currentDay = state.gameTime.day;
          const currentHour = state.gameTime.hour;
          const currentMinute = state.gameTime.minute;

          let newMinute = currentMinute + 1;
          let newHour = currentHour;
          let newDay = currentDay;

          if (newMinute >= 60) {
            newHour += 1;
            newMinute = 0;
          }

          if (newHour >= 24) {
            newDay += 1;
            newHour = 0;
          }

          // Gather all updates in a single set call to prevent cascading renders
          set({
            gameTick: newTick,
            gameTime: {
              day: newDay,
              hour: newHour,
              minute: newMinute,
            },
            // Process passive income on tick
            cash:
              state.revenue > 0
                ? state.cash + (state.revenue - state.expenses) / (24 * 60 * 30) // Per minute (30 days month)
                : state.cash,
          });

          // Check for daily/hourly updates with non-reactive checks
          const isDayChange = newHour === 0 && newMinute === 0;
          const isHourChange = newMinute === 0;

          // Schedule updates with delays to prevent synchronous state loop
          if (isDayChange) {
            setTimeout(() => get().processDailyUpdate(), 50);
          }

          if (isHourChange) {
            // Stagger updates to different systems
            setTimeout(() => {
              try {
                if (window.productStore) {
                  window.productStore.getState().processDevTick();
                }
              } catch (e) {
                console.error("Error processing product tick", e);
              }
            }, 100);

            setTimeout(() => {
              try {
                if (window.marketingStore) {
                  window.marketingStore.getState().processCampaigns();
                }
              } catch (e) {
                console.error("Error processing marketing campaigns", e);
              }
            }, 150);

            setTimeout(() => {
              try {
                if (window.teamStore) {
                  window.teamStore.getState().updateTeamState();
                }
              } catch (e) {
                console.error("Error updating team state", e);
              }
            }, 200);

            setTimeout(() => {
              try {
                if (window.investorStore) {
                  window.investorStore.getState().processInvestors();
                }
              } catch (e) {
                console.error("Error processing investors", e);
              }
            }, 250);
          }
        } catch (error) {
          console.error("Error in game tick:", error);
        } finally {
          // Clear processing flag after a delay to ensure all processes complete
          setTimeout(() => {
            set({ isProcessingTick: false });
          }, 300);
        }
      },

      // Process daily update - batch all operations
      processDailyUpdate: () => {
        // Get full state once to avoid recomputation
        const gameState = get();

        // Only modify state once at the end
        const updates = {};

        // Update user metrics
        if (gameState.users > 0) {
          // Calculate user changes
          const newUserMetrics = calculateUserMetrics(gameState);
          Object.assign(updates, newUserMetrics);
        }

        // Weekly financial update (every 7 days)
        if (gameState.gameTime.day % 7 === 0) {
          const financialUpdates = calculateFinancialUpdates(gameState);
          Object.assign(updates, financialUpdates);
        }

        // Apply all updates in one batch
        if (Object.keys(updates).length > 0) {
          set(updates);
        }

        // Schedule events with delays to avoid state loops
        if (gameState.gameTime.day % 30 === 0) {
          setTimeout(() => {
            get().processMonthlyUpdate();
          }, 100);
        }

        // Random events (2% chance per day)
        if (Math.random() < 0.02) {
          setTimeout(() => {
            get().generateRandomEvent();
          }, 150);
        }

        // Check objectives separately
        setTimeout(() => {
          get().checkObjectives();
        }, 200);
      },

      // Other methods remain the same...
      // ...
    }),
    {
      name: "startup-simulator-storage",
    }
  )
);

// Helper functions moved outside the store to prevent closure issues
function calculateUserMetrics(gameState) {
  // Calculate user metrics and return the state updates
  return {}; // Implement your actual user metrics logic here
}

function calculateFinancialUpdates(gameState) {
  // Calculate financial updates and return the state changes
  return {}; // Implement your actual financial update logic here
}

// Share with window for cross-store access
if (typeof window !== "undefined") {
  window.gameStore = useGameStore;
}

export default useGameStore;
