// src/store/productStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import useGameStore from "./gameStore";
import useTeamStore from "./teamStore";

// Initial feature templates based on common startup features
const INITIAL_FEATURES = [
  {
    id: "feature_1",
    name: "User Authentication",
    description: "Basic user registration and login system",
    complexity: 3,
    status: "planned",
    progress: 0,
    timeEstimate: 5, // days
    developmentCost: 2000,
    dependencies: [],
    assignedTeamMembers: [],
  },
  {
    id: "feature_2",
    name: "Dashboard UI",
    description: "Main interface for users to interact with the product",
    complexity: 2,
    status: "planned",
    progress: 0,
    timeEstimate: 3,
    developmentCost: 1500,
    dependencies: ["feature_1"],
    assignedTeamMembers: [],
  },
  {
    id: "feature_3",
    name: "Payment Processing",
    description: "Integration with payment providers to handle transactions",
    complexity: 4,
    status: "planned",
    progress: 0,
    timeEstimate: 7,
    developmentCost: 3000,
    dependencies: ["feature_1"],
    assignedTeamMembers: [],
  },
];

// Technology stack options
const TECH_STACK_OPTIONS = {
  frontend: [
    {
      id: "react",
      name: "React",
      popularity: 85,
      stability: 80,
      complexity: 60,
      cost: 0,
    },
    {
      id: "vue",
      name: "Vue.js",
      popularity: 70,
      stability: 75,
      complexity: 50,
      cost: 0,
    },
    {
      id: "angular",
      name: "Angular",
      popularity: 65,
      stability: 85,
      complexity: 75,
      cost: 0,
    },
    {
      id: "svelte",
      name: "Svelte",
      popularity: 55,
      stability: 65,
      complexity: 45,
      cost: 0,
    },
  ],
  backend: [
    {
      id: "node",
      name: "Node.js",
      popularity: 80,
      stability: 75,
      complexity: 60,
      cost: 0,
    },
    {
      id: "python",
      name: "Python",
      popularity: 85,
      stability: 85,
      complexity: 50,
      cost: 0,
    },
    {
      id: "ruby",
      name: "Ruby on Rails",
      popularity: 60,
      stability: 80,
      complexity: 55,
      cost: 0,
    },
    {
      id: "java",
      name: "Java Spring",
      popularity: 70,
      stability: 90,
      complexity: 80,
      cost: 0,
    },
  ],
  database: [
    {
      id: "mongodb",
      name: "MongoDB",
      popularity: 75,
      stability: 70,
      complexity: 50,
      cost: 0,
    },
    {
      id: "postgres",
      name: "PostgreSQL",
      popularity: 80,
      stability: 90,
      complexity: 65,
      cost: 0,
    },
    {
      id: "mysql",
      name: "MySQL",
      popularity: 85,
      stability: 85,
      complexity: 60,
      cost: 0,
    },
    {
      id: "firebase",
      name: "Firebase",
      popularity: 70,
      stability: 75,
      complexity: 45,
      cost: 0,
    },
  ],
  hosting: [
    {
      id: "aws",
      name: "AWS",
      popularity: 90,
      stability: 95,
      complexity: 85,
      cost: 500,
    },
    {
      id: "heroku",
      name: "Heroku",
      popularity: 75,
      stability: 80,
      complexity: 40,
      cost: 200,
    },
    {
      id: "netlify",
      name: "Netlify",
      popularity: 70,
      stability: 85,
      complexity: 30,
      cost: 100,
    },
    {
      id: "gcp",
      name: "Google Cloud",
      popularity: 85,
      stability: 90,
      complexity: 80,
      cost: 400,
    },
  ],
};

// Create the product store
const useProductStore = create(
  persist(
    (set, get) => ({
      // Product state
      currentVersion: "0.1",
      features: [],
      bugs: [],
      techStack: {
        frontend: null,
        backend: null,
        database: null,
        hosting: null,
      },
      techDebt: 0,
      releases: [],
      developmentPoints: 0, // Points accumulated through team work

      // Initialize with default features based on startup idea
      initializeProduct: () => {
        const startupIdea = useGameStore.getState().startupIdea;

        if (!startupIdea) return;

        // Clone initial features and add any idea-specific modifications
        const initialFeatures = INITIAL_FEATURES.map((feature) => ({
          ...feature,
          id: nanoid(),
        }));

        set({
          features: initialFeatures,
          currentVersion: "0.1",
          techDebt: 0,
        });
      },

      // Add a new feature
      addFeature: (feature) => {
        const newFeature = {
          id: nanoid(),
          name: feature.name,
          description: feature.description,
          complexity: feature.complexity || 3,
          status: "planned",
          progress: 0,
          timeEstimate: feature.timeEstimate || feature.complexity * 2,
          developmentCost: feature.developmentCost || feature.complexity * 500,
          dependencies: feature.dependencies || [],
          assignedTeamMembers: [],
        };

        set((state) => ({
          features: [...state.features, newFeature],
        }));

        return newFeature.id;
      },

      // Update a feature
      updateFeature: (featureId, updates) => {
        set((state) => ({
          features: state.features.map((feature) =>
            feature.id === featureId ? { ...feature, ...updates } : feature
          ),
        }));
      },

      // Remove a feature
      removeFeature: (featureId) => {
        set((state) => ({
          features: state.features.filter(
            (feature) => feature.id !== featureId
          ),
        }));
      },

      // Add a new bug
      addBug: (bug) => {
        const newBug = {
          id: nanoid(),
          title: bug.title,
          description: bug.description,
          severity: bug.severity || "medium",
          status: "open",
          affectedFeature: bug.affectedFeature,
          reportedAt: Date.now(),
          fixEstimate: bug.fixEstimate || 2,
          assignedTeamMembers: [],
        };

        set((state) => ({
          bugs: [...state.bugs, newBug],
        }));

        return newBug.id;
      },

      // Update a bug
      updateBug: (bugId, updates) => {
        set((state) => ({
          bugs: state.bugs.map((bug) =>
            bug.id === bugId ? { ...bug, ...updates } : bug
          ),
        }));
      },

      // Fix a bug
      fixBug: (bugId) => {
        set((state) => ({
          bugs: state.bugs.map((bug) =>
            bug.id === bugId ? { ...bug, status: "fixed" } : bug
          ),
          // Fixing bugs reduces tech debt
          techDebt: Math.max(0, state.techDebt - 2),
        }));
      },

      // Select tech stack
      selectTechStack: (category, techId) => {
        const tech = TECH_STACK_OPTIONS[category].find((t) => t.id === techId);

        if (!tech) return false;

        // Check if can afford
        const cash = useGameStore.getState().cash;
        if (tech.cost > cash) return false;

        // Pay for the tech if it has a cost
        if (tech.cost > 0) {
          useGameStore.getState().updateCash(-tech.cost);
        }

        set((state) => ({
          techStack: {
            ...state.techStack,
            [category]: tech,
          },
        }));

        return true;
      },

      // Get all tech stack options
      getTechStackOptions: () => TECH_STACK_OPTIONS,

      // Create a new release
      createRelease: (releaseData) => {
        const currentVersion = get().currentVersion;
        const newVersion =
          releaseData.version || incrementVersion(currentVersion);

        const newRelease = {
          id: nanoid(),
          version: newVersion,
          features: releaseData.features || [],
          fixedBugs: releaseData.fixedBugs || [],
          releaseDate: Date.now(),
          notes: releaseData.notes || "",
          qualityScore: calculateQualityScore(
            get(),
            releaseData.features,
            releaseData.fixedBugs
          ),
          techDebtIncurred: releaseData.rushRelease ? 10 : 0,
        };

        // Update features status
        releaseData.features.forEach((featureId) => {
          get().updateFeature(featureId, {
            status: "completed",
            progress: 100,
          });
        });

        // Update bugs status
        releaseData.fixedBugs.forEach((bugId) => {
          get().updateBug(bugId, { status: "fixed" });
        });

        // Update tech debt
        if (releaseData.rushRelease) {
          set((state) => ({
            techDebt: state.techDebt + 10,
          }));
        }

        set((state) => ({
          currentVersion: newVersion,
          releases: [...state.releases, newRelease],
        }));

        // Trigger game events based on release quality
        const gameStore = useGameStore.getState();

        // Update customer reputation based on release quality
        const qualityImpact = newRelease.qualityScore - 50;
        gameStore.updateReputation("customer", qualityImpact / 5);

        return newRelease;
      },

      // Process development work each tick
      processDevTick: () => {
        const teamStats = useTeamStore.getState().getTeamStats();
        const devPoints = (teamStats.coding + teamStats.design) / 10;

        if (devPoints <= 0) return;

        // Add dev points to total
        set((state) => ({
          developmentPoints: state.developmentPoints + devPoints,
        }));

        // Process features in progress
        const state = get();
        const inProgressFeatures = state.features.filter(
          (f) => f.status === "in-progress"
        );

        if (inProgressFeatures.length > 0) {
          // Distribute points among features
          const pointsPerFeature =
            state.developmentPoints / inProgressFeatures.length;

          let remainingPoints = state.developmentPoints;
          let updatedFeatures = [...state.features];

          for (let i = 0; i < inProgressFeatures.length; i++) {
            const feature = inProgressFeatures[i];
            const pointsNeeded = feature.complexity * 100 - feature.progress;
            const pointsToApply = Math.min(
              pointsPerFeature,
              pointsNeeded,
              remainingPoints
            );

            if (pointsToApply > 0) {
              const newProgress = feature.progress + pointsToApply;
              remainingPoints -= pointsToApply;

              updatedFeatures = updatedFeatures.map((f) =>
                f.id === feature.id ? { ...f, progress: newProgress } : f
              );
            }
          }

          // Update features and reset development points
          set({
            features: updatedFeatures,
            developmentPoints: remainingPoints,
          });
        }
      },

      // Start working on a feature
      startFeature: (featureId) => {
        const feature = get().features.find((f) => f.id === featureId);

        if (!feature || feature.status !== "planned") return false;

        // Check dependencies
        const uncompletedDependencies = feature.dependencies.filter((depId) => {
          const dep = get().features.find((f) => f.id === depId);
          return !dep || dep.status !== "completed";
        });

        if (uncompletedDependencies.length > 0) return false;

        set((state) => ({
          features: state.features.map((f) =>
            f.id === featureId ? { ...f, status: "in-progress" } : f
          ),
        }));

        return true;
      },

      // Calculate product quality score (0-100)
      getProductQuality: () => {
        const state = get();

        // No features = no quality
        if (state.features.length === 0) return 0;

        // Calculate completed features ratio
        const completedFeatures = state.features.filter(
          (f) => f.status === "completed"
        ).length;
        const completedRatio = completedFeatures / state.features.length;

        // Calculate bugs impact
        const openBugs = state.bugs.filter((b) => b.status === "open").length;
        const bugPenalty = Math.min(50, openBugs * 5);

        // Calculate tech stack impact
        let techStackScore = 0;
        let techStackCount = 0;

        for (const category in state.techStack) {
          if (state.techStack[category]) {
            techStackScore +=
              (state.techStack[category].stability +
                state.techStack[category].popularity) /
              2;
            techStackCount++;
          }
        }

        const techStackImpact =
          techStackCount > 0 ? techStackScore / techStackCount : 0;

        // Calculate tech debt impact
        const techDebtPenalty = Math.min(30, state.techDebt);

        // Calculate final score
        const baseScore = completedRatio * 70 + (techStackImpact / 100) * 30;
        return Math.max(
          0,
          Math.min(100, baseScore - bugPenalty - techDebtPenalty)
        );
      },

      // Reset product state (for new games)
      resetProduct: () => {
        set({
          currentVersion: "0.1",
          features: [],
          bugs: [],
          techStack: {
            frontend: null,
            backend: null,
            database: null,
            hosting: null,
          },
          techDebt: 0,
          releases: [],
          developmentPoints: 0,
        });
      },
    }),
    {
      name: "startup-simulator-product-storage",
    }
  )
);

// Helper function to increment version number
function incrementVersion(version) {
  const parts = version.split(".");
  const lastPart = parseInt(parts[parts.length - 1]) + 1;
  parts[parts.length - 1] = lastPart.toString();
  return parts.join(".");
}

// Helper function to calculate release quality score
function calculateQualityScore(state, featureIds, bugIds) {
  // Base score starts at 50
  let score = 50;

  // Add points for each feature
  featureIds.forEach((featureId) => {
    const feature = state.features.find((f) => f.id === featureId);
    if (feature) {
      // More complex features add more value
      score += feature.complexity * 2;
    }
  });

  // Add points for bug fixes
  bugIds.forEach((bugId) => {
    const bug = state.bugs.find((b) => b.id === bugId);
    if (bug) {
      // Higher severity bugs add more value when fixed
      const severityValue = { low: 1, medium: 2, high: 3, critical: 5 };
      score += severityValue[bug.severity] || 2;
    }
  });

  // Tech debt reduces quality
  score -= state.techDebt;

  // Cap score between 0-100
  return Math.max(0, Math.min(100, score));
}

export default useProductStore;
