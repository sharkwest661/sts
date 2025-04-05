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
      isProcessingTick: false, // Add guard flag to prevent recursive updates

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

      // Increment game tick (called regularly)
      incrementTick: () => {
        const state = get();

        // Guard against recursive updates - return early if already processing a tick
        if (state.isProcessingTick) return;

        // Set processing flag
        set({ isProcessingTick: true });

        // Update game tick
        set({
          gameTick: state.gameTick + 1,
        });

        // Update game time (1 tick = 1 hour in game)
        const currentHour = state.gameTime.hour;
        const currentMinute = state.gameTime.minute;

        let newHour = currentHour;
        let newMinute = currentMinute + 60; // 1 hour per tick
        let newDay = state.gameTime.day;

        if (newMinute >= 60) {
          newHour += Math.floor(newMinute / 60);
          newMinute = newMinute % 60;
        }

        if (newHour >= 24) {
          newDay += Math.floor(newHour / 24);
          newHour = newHour % 24;
        }

        set({
          gameTime: {
            day: newDay,
            hour: newHour,
            minute: newMinute,
          },
        });

        // Process passive income on each tick
        if (state.revenue > 0) {
          set({
            cash: state.cash + (state.revenue - state.expenses) / (24 * 30), // Per hour (30 days month)
          });
        }

        // IMPORTANT: Check if a day has passed after we've updated the time, not during the update
        if (newHour === 0 && newMinute === 0) {
          // Process in the next event loop to avoid nested state updates
          setTimeout(() => {
            get().processDailyUpdate();
          }, 0);
        }

        // Call other store ticks after a delay to prevent tight update loops
        // Use separate timeouts with different delays to stagger updates
        setTimeout(() => {
          try {
            if (window.productStore) {
              window.productStore.getState().processDevTick();
            }
          } catch (e) {
            console.error("Error processing product tick", e);
          }

          // Release the processing flag after all subsystems have been updated
          set({ isProcessingTick: false });
        }, 50);

        setTimeout(() => {
          try {
            if (window.marketingStore) {
              window.marketingStore.getState().processCampaigns();
            }
          } catch (e) {
            console.error("Error processing marketing campaigns", e);
          }
        }, 100);

        setTimeout(() => {
          try {
            if (window.investorStore) {
              window.investorStore.getState().processInvestors();
            }
          } catch (e) {
            console.error("Error processing investors", e);
          }
        }, 150);
      },

      // Process daily update
      processDailyUpdate: () => {
        // Update user metrics
        get().updateUsers();

        // Weekly financial update (every 7 days)
        if (get().gameTime.day % 7 === 0) {
          get().updateFinancials();
        }

        // Monthly update (every 30 days)
        if (get().gameTime.day % 30 === 0) {
          // Use setTimeout to avoid nested state updates
          setTimeout(() => {
            get().processMonthlyUpdate();
          }, 0);
        }

        // Random events (2% chance per day)
        if (Math.random() < 0.02) {
          setTimeout(() => {
            get().generateRandomEvent();
          }, 0);
        }

        // Check objectives
        setTimeout(() => {
          get().checkObjectives();
        }, 0);
      },

      // Process monthly update
      processMonthlyUpdate: () => {
        // Update revenue history
        const currentRevenue = get().revenue;
        const currentExpenses = get().expenses;

        set((state) => ({
          revenueHistory: [
            currentRevenue,
            ...state.revenueHistory.slice(0, 11),
          ],
          expensesHistory: [
            currentExpenses,
            ...state.expensesHistory.slice(0, 11),
          ],
        }));

        // Calculate revenue growth
        if (get().revenueHistory.length >= 2) {
          const currentRevenue = get().revenueHistory[0];
          const lastMonthRevenue = get().revenueHistory[1];

          if (lastMonthRevenue > 0) {
            const growth =
              ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
            set({ revenueGrowth: growth });
          }
        }

        // Pay monthly expenses
        const expenses = get().expenses;
        get().updateCash(-expenses);

        // Add monthly notification
        get().addNotification({
          title: "Monthly Update",
          message: `Monthly expenses of $${expenses.toLocaleString()} have been paid.`,
          type: "finance",
        });
      },

      // Update user metrics
      updateUsers: () => {
        const state = get();

        // Get marketing effectiveness factor
        let marketingFactor = 1.0;
        try {
          const marketingStore = window.marketingStore;
          if (marketingStore) {
            const awareness =
              marketingStore.getState().marketingStats.brandAwareness;
            marketingFactor = 1.0 + awareness / 100;
          }
        } catch (e) {
          console.error("Error accessing marketing store", e);
        }

        // Get product quality factor
        let productFactor = 0.5;
        try {
          const productStore = window.productStore;
          if (productStore) {
            const quality = productStore.getState().getProductQuality();
            productFactor = 0.5 + quality / 100;
          }
        } catch (e) {
          console.error("Error accessing product store", e);
        }

        // Calculate user growth rate (daily)
        const baseGrowthRate = 0.02; // 2% daily baseline
        const growthRate = baseGrowthRate * marketingFactor * productFactor;

        // Calculate churn rate (% users that leave daily)
        const baseChurnRate = 0.01; // 1% daily churn
        const churnRate = baseChurnRate / productFactor; // Better product = less churn

        // Apply growth and churn
        const newUsers = Math.floor(state.users * growthRate);
        const lostUsers = Math.floor(state.users * churnRate);
        const netChange = newUsers - lostUsers;

        // Update users
        set({
          users: Math.max(0, state.users + netChange),
          userGrowth: growthRate * 100,
          userChurn: churnRate * 100,
        });

        // Update revenue based on users (simplified)
        if (state.users > 100) {
          // Assume each user generates $1/month on average
          const monthlyRevenuePerUser = 1;
          set({
            revenue: state.users * monthlyRevenuePerUser,
          });
        }
      },

      // Update financial metrics
      updateFinancials: () => {
        // This would be more complex in a full implementation
        // For now, just ensure expenses reflect team costs
        try {
          const teamStore = window.teamStore;
          if (teamStore) {
            const teamStats = teamStore.getState().getTeamStats();

            // Use a single state update to minimize renders
            set((state) => ({
              teamSize: teamStats.headcount || 0,
              expenses: teamStats.totalSalary + state.officeExpenses,
            }));
          }
        } catch (e) {
          console.error("Error accessing team store", e);
        }
      },

      // Generate a random event
      generateRandomEvent: () => {
        // This would be expanded with many possible events
        // For now, just a simple example
        const events = [
          {
            id: "media_coverage",
            title: "Media Coverage",
            message: "Your startup got featured in a tech blog!",
            type: "positive",
            effect: () => {
              get().updateReputation("industry", 5);
              get().addNotification({
                title: "Media Coverage",
                message:
                  "Your startup was featured in a popular tech blog, improving your industry reputation!",
                type: "marketing",
              });
            },
          },
          {
            id: "server_outage",
            title: "Server Outage",
            message: "Your servers went down for a few hours!",
            type: "negative",
            effect: () => {
              get().updateReputation("customer", -3);
              get().addNotification({
                title: "Server Outage",
                message:
                  "Your servers experienced downtime, affecting your customer reputation.",
                type: "product",
              });

              // Try to add a bug to the product store
              try {
                const productStore = window.productStore;
                if (productStore) {
                  productStore.getState().addBug({
                    title: "Server Stability Issues",
                    description:
                      "Servers are experiencing intermittent downtime.",
                    severity: "high",
                  });
                }
              } catch (e) {
                console.error("Error adding bug", e);
              }
            },
          },
          {
            id: "employee_conflict",
            title: "Team Conflict",
            message: "There's tension between team members!",
            type: "negative",
            effect: () => {
              get().updateReputation("employer", -2);
              get().addNotification({
                title: "Team Conflict",
                message:
                  "Conflicts between team members are affecting productivity.",
                type: "team",
              });
            },
          },
        ];

        // Select a random event
        const event = events[Math.floor(Math.random() * events.length)];

        // Apply event effect
        event.effect();

        // Add to events history
        set((state) => ({
          events: [
            ...state.events,
            { ...event, date: new Date().toISOString() },
          ],
        }));
      },

      // Check objectives
      checkObjectives: () => {
        const state = get();

        // Update objectives status
        set((state) => ({
          objectives: state.objectives.map((objective) => {
            if (objective.completed) return objective;

            const completed = objective.checkCompletion(state);

            if (completed && !objective.completed) {
              // Objective newly completed
              get().addNotification({
                title: "Objective Completed",
                message: `You've completed the objective: ${objective.title}`,
                type: "achievement",
              });
            }

            return {
              ...objective,
              completed,
            };
          }),
        }));
      },

      // Add a notification
      addNotification: (notification) => {
        const newNotification = {
          id: Date.now().toString(),
          title: notification.title,
          message: notification.message,
          type: notification.type || "info",
          read: false,
          date: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));

        return newNotification.id;
      },

      // Mark notification as read
      markNotificationRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          ),
        }));
      },

      // Clear all notifications
      clearNotifications: () => {
        set({ notifications: [] });
      },

      // Update reputation
      updateReputation: (type, amount) => {
        const state = get();
        set({
          reputation: {
            ...state.reputation,
            [type]: Math.max(0, Math.min(100, state.reputation[type] + amount)),
          },
        });
      },

      // Update cash
      updateCash: (amount) => {
        set((state) => ({
          cash: state.cash + amount,
        }));
      },

      // Update company valuation
      updateValuation: (newValuation) => {
        set({ companyValuation: newValuation });
      },

      // Upgrade office
      upgradeOffice: () => {
        const state = get();
        const upgradeCost = 5000 * (state.officeLevel + 1);

        if (state.cash >= upgradeCost) {
          const newOfficeLevel = state.officeLevel + 1;
          const newCapacity = state.officeCapacity + 5;
          const newExpenses = state.officeExpenses + 500 * newOfficeLevel;

          set({
            cash: state.cash - upgradeCost,
            officeLevel: newOfficeLevel,
            officeCapacity: newCapacity,
            officeExpenses: newExpenses,
            expenses: state.expenses - state.officeExpenses + newExpenses,
          });

          // Add notification
          get().addNotification({
            title: "Office Upgraded",
            message: `You've upgraded to a Level ${newOfficeLevel} office with capacity for ${newCapacity} team members!`,
            type: "office",
          });

          return true;
        }
        return false;
      },

      // Add a game objective
      addObjective: (objective) => {
        set((state) => ({
          objectives: [
            ...state.objectives,
            {
              id: Date.now().toString(),
              title: objective.title,
              description: objective.description,
              checkCompletion: objective.checkCompletion,
              reward: objective.reward,
              completed: false,
            },
          ],
        }));
      },

      // Reset game
      resetGame: () => {
        set({
          gameStarted: false,
          gameTick: 0,
          gameSpeed: 1,
          lastSaved: null,
          gameTime: { day: 1, hour: 9, minute: 0 },
          companyName: "",
          companyValuation: 500000,
          cash: 10000,
          revenue: 0,
          expenses: 0,
          revenueHistory: [],
          expensesHistory: [],
          revenueGrowth: 0,
          startupIdea: null,
          marketPotential: 0,
          productComplexity: 0,
          legalRisk: 0,
          officeLevel: 0,
          officeCapacity: 5,
          officeExpenses: 500,
          teamSize: 0,
          reputation: { industry: 10, employer: 10, customer: 0 },
          users: 0,
          userGrowth: 0,
          userChurn: 0,
          events: [],
          notifications: [],
          achievements: [],
          objectives: [],
          isProcessingTick: false,
        });
      },

      // Save game
      saveGame: () => set({ lastSaved: new Date().toISOString() }),
    }),
    {
      name: "startup-simulator-storage",
    }
  )
);

// Share with window for cross-store access
if (typeof window !== "undefined") {
  window.gameStore = useGameStore;
}

export default useGameStore;
