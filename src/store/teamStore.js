// src/store/teamStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import useGameStore from "./gameStore";

// Initial skills distribution
const createInitialSkills = () => ({
  coding: Math.floor(Math.random() * 30) + 10,
  design: Math.floor(Math.random() * 30) + 10,
  marketing: Math.floor(Math.random() * 30) + 10,
  business: Math.floor(Math.random() * 30) + 10,
});

// Create random personality traits
const createPersonality = () => {
  const personalities = [
    "Enthusiastic",
    "Analytical",
    "Creative",
    "Lazy",
    "Workaholic",
    "Perfectionist",
    "Careless",
    "Team Player",
    "Lone Wolf",
    "Optimistic",
    "Pessimistic",
    "Easily Distracted",
  ];

  // Pick 2-3 random traits
  const traitCount = Math.floor(Math.random() * 2) + 2;
  const traits = [];

  while (traits.length < traitCount) {
    const trait =
      personalities[Math.floor(Math.random() * personalities.length)];
    if (!traits.includes(trait)) {
      traits.push(trait);
    }
  }

  return traits;
};

// Create initial team store
const useTeamStore = create(
  persist(
    (set, get) => ({
      // Team members array
      teamMembers: [],

      // Available recruits in marketplace
      availableRecruits: [],

      // Add a new team member
      hireTeamMember: (recruit) => {
        const state = get();
        const gameState = useGameStore.getState();

        // Check if we have capacity
        if (state.teamMembers.length >= gameState.officeCapacity) {
          return { success: false, message: "Office at maximum capacity!" };
        }

        // Add to team
        set({
          teamMembers: [
            ...state.teamMembers,
            {
              ...recruit,
              hireDate: gameState.gameTick,
              salary: recruit.salaryExpectation,
              morale: 100,
              energy: 100,
              exploitationTolerance: Math.floor(Math.random() * 50) + 30,
            },
          ],
          // Remove from recruits
          availableRecruits: state.availableRecruits.filter(
            (r) => r.id !== recruit.id
          ),
        });

        // Update expenses
        useGameStore.setState((state) => ({
          expenses: state.expenses + recruit.salaryExpectation,
        }));

        return { success: true };
      },

      // Fire a team member
      fireTeamMember: (id) => {
        const state = get();
        const member = state.teamMembers.find((m) => m.id === id);

        if (member) {
          set({
            teamMembers: state.teamMembers.filter((m) => m.id !== id),
          });

          // Update expenses
          useGameStore.setState((state) => ({
            expenses: state.expenses - member.salary,
          }));

          // Update employer reputation
          useGameStore.getState().updateReputation("employer", -5);

          return { success: true };
        }

        return { success: false, message: "Team member not found" };
      },

      // Generate new recruits for marketplace
      generateRecruits: () => {
        const reputationFactor =
          useGameStore.getState().reputation.employer / 100;
        const count = Math.floor(Math.random() * 3) + 2; // 2-4 recruits

        const newRecruits = [];

        for (let i = 0; i < count; i++) {
          const skills = createInitialSkills();

          // Better reputation attracts better candidates
          if (reputationFactor > 0) {
            Object.keys(skills).forEach((skill) => {
              skills[skill] += Math.floor(reputationFactor * 20);
            });
          }

          newRecruits.push({
            id: nanoid(),
            name: `Recruit ${Math.floor(Math.random() * 1000)}`,
            skills,
            personality: createPersonality(),
            salaryExpectation: 1000 + Math.floor(Math.random() * 2000),
            specialty: ["Frontend", "Backend", "Design", "Marketing"][
              Math.floor(Math.random() * 4)
            ],
          });
        }

        set({
          availableRecruits: newRecruits,
        });
      },

      // Update team morale and productivity
      updateTeamState: () => {
        const state = get();

        // Process each team member
        const updatedTeam = state.teamMembers.map((member) => {
          // Calculate morale changes based on various factors
          let moraleChange = 0;

          // Example: morale decreases if exploitation is high
          const exploitation = 100 - member.exploitationTolerance;
          if (exploitation > 0) {
            moraleChange -= exploitation * 0.02;
          }

          // Energy management - decreases over time, recovers with rest
          let energyChange = -0.5; // Natural energy decrease per tick

          return {
            ...member,
            morale: Math.max(0, Math.min(100, member.morale + moraleChange)),
            energy: Math.max(0, Math.min(100, member.energy + energyChange)),
          };
        });

        set({ teamMembers: updatedTeam });
      },

      // Handle team member skill improvement
      improveSkills: (memberId, skill, amount = 1) => {
        const state = get();

        set({
          teamMembers: state.teamMembers.map((member) =>
            member.id === memberId
              ? {
                  ...member,
                  skills: {
                    ...member.skills,
                    [skill]: member.skills[skill] + amount,
                  },
                }
              : member
          ),
        });
      },

      // Calculate team productivity stats
      getTeamStats: () => {
        const state = get();

        // Calculate totals across all team members
        return state.teamMembers.reduce(
          (stats, member) => {
            // Factor in morale and energy to productivity
            const productivityMultiplier =
              (member.morale / 100) * (member.energy / 100);

            return {
              coding:
                stats.coding + member.skills.coding * productivityMultiplier,
              design:
                stats.design + member.skills.design * productivityMultiplier,
              marketing:
                stats.marketing +
                member.skills.marketing * productivityMultiplier,
              business:
                stats.business +
                member.skills.business * productivityMultiplier,
              totalSalary: stats.totalSalary + member.salary,
              headcount: stats.headcount + 1,
              averageMorale:
                (stats.averageMorale * stats.headcount + member.morale) /
                (stats.headcount + 1),
              averageEnergy:
                (stats.averageEnergy * stats.headcount + member.energy) /
                (stats.headcount + 1),
            };
          },
          {
            coding: 0,
            design: 0,
            marketing: 0,
            business: 0,
            totalSalary: 0,
            headcount: 0,
            averageMorale: 0,
            averageEnergy: 0,
          }
        );
      },
    }),
    {
      name: "startup-simulator-team-storage",
    }
  )
);

export default useTeamStore;
