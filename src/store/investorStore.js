// src/store/investorStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import useGameStore from "./gameStore";
import useProductStore from "./productStore";
import useMarketingStore from "./marketingStore";

// Investor types
const INVESTOR_TYPES = [
  {
    id: "angel",
    name: "Angel Investor",
    minInvestment: 25000,
    maxInvestment: 150000,
    minEquity: 5,
    maxEquity: 15,
    riskTolerance: "high",
    expectations: "medium",
    interestThreshold: 40,
    focusAreas: ["user_growth", "innovative_tech"],
  },
  {
    id: "seed_vc",
    name: "Seed VC",
    minInvestment: 100000,
    maxInvestment: 500000,
    minEquity: 10,
    maxEquity: 25,
    riskTolerance: "medium",
    expectations: "medium",
    interestThreshold: 50,
    focusAreas: ["market_fit", "team_expertise"],
  },
  {
    id: "series_a",
    name: "Series A VC",
    minInvestment: 500000,
    maxInvestment: 2000000,
    minEquity: 15,
    maxEquity: 30,
    riskTolerance: "medium",
    expectations: "high",
    interestThreshold: 60,
    focusAreas: ["revenue_growth", "market_share"],
  },
  {
    id: "series_b",
    name: "Series B VC",
    minInvestment: 2000000,
    maxInvestment: 10000000,
    minEquity: 20,
    maxEquity: 35,
    riskTolerance: "low",
    expectations: "very_high",
    interestThreshold: 70,
    focusAreas: ["profitability", "scalability"],
  },
];

// Investor name pool
const INVESTOR_NAMES = {
  prefixes: [
    "Alpha",
    "Beta",
    "Gamma",
    "Delta",
    "Omega",
    "Nova",
    "Digital",
    "Quantum",
    "Venture",
    "Future",
    "Next",
    "First",
    "Prime",
    "Peak",
    "Summit",
    "Horizon",
  ],
  suffixes: [
    "Capital",
    "Ventures",
    "Partners",
    "Fund",
    "Equity",
    "Investments",
    "Group",
    "Associates",
    "Alliance",
    "Accelerator",
  ],
  people: [
    "Smith",
    "Jones",
    "Lee",
    "Kim",
    "Patel",
    "Garcia",
    "Chen",
    "Williams",
    "Singh",
    "Brown",
    "Johnson",
    "Müller",
    "Nguyen",
    "Rodriguez",
    "Suzuki",
  ],
};

// Investment expectations templates
const EXPECTATION_TEMPLATES = {
  user_growth: {
    metric: "User Growth",
    low: "Achieve 10% monthly user growth",
    medium: "Achieve 20% monthly user growth",
    high: "Achieve 30% monthly user growth",
    very_high: "Achieve 50% monthly user growth",
  },
  revenue_growth: {
    metric: "Revenue Growth",
    low: "Increase revenue by 15% in 6 months",
    medium: "Increase revenue by 25% in 6 months",
    high: "Double revenue in 6 months",
    very_high: "Triple revenue in 6 months",
  },
  product_launch: {
    metric: "Product Launch",
    low: "Launch MVP within 6 months",
    medium: "Launch product within 3 months",
    high: "Launch product within 2 months",
    very_high: "Launch product within 1 month",
  },
  market_fit: {
    metric: "Product-Market Fit",
    low: "Demonstrate initial traction",
    medium: "Achieve product-market fit",
    high: "Demonstrate strong market demand",
    very_high: "Become market leader in your niche",
  },
};

// Create the investor store
const useInvestorStore = create(
  persist(
    (set, get) => ({
      // Investor state
      investors: [],
      potentialInvestors: [],
      fundingHistory: [],
      fundingRounds: [],
      totalFundingRaised: 0,
      totalEquitySold: 0,
      currentValuation: 0,
      lastValuationDate: null,

      // Initialize with seed investors
      initializeInvestors: () => {
        // Generate 1-2 potential angel investors
        const seedInvestorCount = 1 + Math.floor(Math.random() * 2);
        const potentialInvestors = [];

        for (let i = 0; i < seedInvestorCount; i++) {
          potentialInvestors.push(generateInvestor("angel"));
        }

        set({ potentialInvestors });
      },

      // Calculate current company valuation
      calculateValuation: () => {
        const gameState = useGameStore.getState();
        const productQuality = useProductStore.getState().getProductQuality();
        const brandAwareness =
          useMarketingStore.getState().marketingStats.brandAwareness;

        // Base valuation factors
        const revenueMultiplier = 8; // Value is 8x annual revenue
        const annualRevenue = gameState.revenue * 12;

        // Valuation components
        const revenueComponent = annualRevenue * revenueMultiplier;
        const teamComponent = gameState.teamSize * 50000; // Each team member adds value
        const productComponent = productQuality * 5000; // Product quality adds value
        const brandComponent = brandAwareness * 2000; // Brand awareness adds value
        const reputationComponent =
          (gameState.reputation.industry + gameState.reputation.customer) *
          1000;

        // Calculate valuation
        const newValuation = Math.max(
          500000, // Minimum valuation
          revenueComponent +
            teamComponent +
            productComponent +
            brandComponent +
            reputationComponent
        );

        // Update valuation in store
        set({
          currentValuation: newValuation,
          lastValuationDate: Date.now(),
        });

        // Update game store valuation
        useGameStore.getState().updateValuation(newValuation);

        return newValuation;
      },

      // Get all investors types
      getInvestorTypes: () => INVESTOR_TYPES,

      // Find new potential investors
      findInvestors: (options = {}) => {
        // Consider reputation and current state to determine available investor types
        const gameState = useGameStore.getState();
        const industryReputation = gameState.reputation.industry;

        // Determine which investor types are available based on reputation
        let availableTypes = [];

        if (industryReputation >= 70) {
          availableTypes = ["angel", "seed_vc", "series_a", "series_b"];
        } else if (industryReputation >= 50) {
          availableTypes = ["angel", "seed_vc", "series_a"];
        } else if (industryReputation >= 30) {
          availableTypes = ["angel", "seed_vc"];
        } else {
          availableTypes = ["angel"];
        }

        // Limit by stage if provided
        if (options.stage && availableTypes.includes(options.stage)) {
          availableTypes = [options.stage];
        }

        // Generate 1-3 new potential investors
        const newInvestorCount = 1 + Math.floor(Math.random() * 3);
        const newInvestors = [];

        for (let i = 0; i < newInvestorCount; i++) {
          // Pick a random investor type from available types
          const type =
            availableTypes[Math.floor(Math.random() * availableTypes.length)];
          newInvestors.push(generateInvestor(type));
        }

        // Add to potential investors
        set((state) => ({
          potentialInvestors: [...state.potentialInvestors, ...newInvestors],
        }));

        return newInvestors;
      },

      // Prepare a pitch for an investor
      preparePitch: (investorId, pitchData) => {
        const investor = get().potentialInvestors.find(
          (inv) => inv.id === investorId
        );
        if (!investor) return { success: false, message: "Investor not found" };

        // Starting interest based on investor's initial interest
        let interestScore = investor.interest;

        // Add pitch quality bonus
        if (pitchData.pitchQuality) {
          interestScore += pitchData.pitchQuality;
        }

        // Check alignment with investor's focus areas
        if (pitchData.focusAreas) {
          const matchingFocusAreas = investor.focusAreas.filter((area) =>
            pitchData.focusAreas.includes(area)
          );

          interestScore += matchingFocusAreas.length * 10;
        }

        // Product quality impact
        const productQuality = useProductStore.getState().getProductQuality();
        interestScore += productQuality / 10;

        // Traction impact
        const marketingStats = useMarketingStore.getState().marketingStats;
        if (marketingStats.totalConversions > 1000) {
          interestScore += 15;
        } else if (marketingStats.totalConversions > 500) {
          interestScore += 10;
        } else if (marketingStats.totalConversions > 100) {
          interestScore += 5;
        }

        // Team size and reputation impact
        const gameState = useGameStore.getState();
        interestScore += gameState.teamSize * 2;
        interestScore += gameState.reputation.industry / 5;

        // Cap interest at 0-100
        interestScore = Math.max(0, Math.min(100, interestScore));

        // Update investor interest
        set((state) => ({
          potentialInvestors: state.potentialInvestors.map((inv) =>
            inv.id === investorId ? { ...inv, interest: interestScore } : inv
          ),
        }));

        // Check if interested enough to make an offer
        const interested = interestScore >= investor.interestThreshold;

        // If interested, generate investment offer
        let offer = null;
        if (interested) {
          const currentValuation = get().calculateValuation();

          // Investment amount based on valuation and investor type
          const investorType = INVESTOR_TYPES.find(
            (type) => type.id === investor.type
          );
          const maxInvestment = Math.min(
            investorType.maxInvestment,
            currentValuation * 0.4 // Max 40% of valuation
          );
          const minInvestment = Math.min(
            investorType.minInvestment,
            maxInvestment
          );

          // Random investment amount in range
          const investmentAmount =
            minInvestment + Math.random() * (maxInvestment - minInvestment);

          // Calculate equity percentage
          const equityPercentage = (investmentAmount / currentValuation) * 100;

          // Cap equity percentage within investor's range
          const cappedEquity = Math.max(
            investorType.minEquity,
            Math.min(investorType.maxEquity, equityPercentage)
          );

          // Generate expectations based on investor type
          const expectationLevel = investorType.expectations;
          const focusArea =
            investor.focusAreas[
              Math.floor(Math.random() * investor.focusAreas.length)
            ];
          const expectation =
            EXPECTATION_TEMPLATES[focusArea]?.[expectationLevel] ||
            "Demonstrate significant progress within 6 months";

          offer = {
            investorId,
            amount: Math.round(investmentAmount),
            equity: Math.round(cappedEquity * 10) / 10, // Round to 1 decimal place
            valuation: currentValuation,
            expectations: expectation,
            expiresIn: 7, // Days until offer expires
          };
        }

        return {
          success: true,
          interestScore,
          interested,
          offer,
        };
      },

      // Accept investment offer
      acceptOffer: (investorId, offer) => {
        const investor = get().potentialInvestors.find(
          (inv) => inv.id === investorId
        );
        if (!investor) return { success: false, message: "Investor not found" };

        // Update investor with investment details
        const updatedInvestor = {
          ...investor,
          invested: true,
          investmentAmount: offer.amount,
          equityOwned: offer.equity,
          investmentDate: Date.now(),
          relationship: 80, // Start with good relationship
          expectations: offer.expectations,
        };

        // Move from potential to active investors
        set((state) => ({
          investors: [...state.investors, updatedInvestor],
          potentialInvestors: state.potentialInvestors.filter(
            (inv) => inv.id !== investorId
          ),
          totalFundingRaised: state.totalFundingRaised + offer.amount,
          totalEquitySold: state.totalEquitySold + offer.equity,
        }));

        // Add to funding history
        const fundingEntry = {
          id: nanoid(),
          date: Date.now(),
          type: "investment",
          investor: investor.name,
          amount: offer.amount,
          equity: offer.equity,
          valuation: offer.valuation,
        };

        set((state) => ({
          fundingHistory: [...state.fundingHistory, fundingEntry],
        }));

        // Create funding round if it's the first of its type
        const investorType = INVESTOR_TYPES.find(
          (type) => type.id === investor.type
        );
        const roundName = getRoundNameFromType(investorType.id);

        const existingRound = get().fundingRounds.find(
          (round) => round.name === roundName
        );

        if (!existingRound) {
          const newRound = {
            id: nanoid(),
            name: roundName,
            startDate: Date.now(),
            endDate: Date.now(),
            totalRaised: offer.amount,
            totalEquity: offer.equity,
            valuation: offer.valuation,
            investors: [investor.name],
            completed: true,
          };

          set((state) => ({
            fundingRounds: [...state.fundingRounds, newRound],
          }));
        } else {
          // Update existing round
          set((state) => ({
            fundingRounds: state.fundingRounds.map((round) =>
              round.id === existingRound.id
                ? {
                    ...round,
                    endDate: Date.now(),
                    totalRaised: round.totalRaised + offer.amount,
                    totalEquity: round.totalEquity + offer.equity,
                    investors: [...round.investors, investor.name],
                  }
                : round
            ),
          }));
        }

        // Add cash to company
        useGameStore.getState().updateCash(offer.amount);

        return { success: true };
      },

      // Reject investment offer
      rejectOffer: (investorId) => {
        // Add to funding history
        const investor = get().potentialInvestors.find(
          (inv) => inv.id === investorId
        );
        if (!investor) return false;

        const fundingEntry = {
          id: nanoid(),
          date: Date.now(),
          type: "rejected_offer",
          investor: investor.name,
        };

        set((state) => ({
          fundingHistory: [...state.fundingHistory, fundingEntry],
          // Reduce investor interest
          potentialInvestors: state.potentialInvestors.map((inv) =>
            inv.id === investorId
              ? { ...inv, interest: Math.max(0, inv.interest - 20) }
              : inv
          ),
        }));

        return true;
      },

      // Update investor relationship
      updateInvestorRelationship: (investorId, change) => {
        set((state) => ({
          investors: state.investors.map((inv) =>
            inv.id === investorId
              ? {
                  ...inv,
                  relationship: Math.max(
                    0,
                    Math.min(100, inv.relationship + change)
                  ),
                }
              : inv
          ),
        }));
      },

      // Schedule meeting with investor
      scheduleMeeting: (investorId) => {
        // Add to funding history
        const investor =
          get().investors.find((inv) => inv.id === investorId) ||
          get().potentialInvestors.find((inv) => inv.id === investorId);

        if (!investor) return false;

        const fundingEntry = {
          id: nanoid(),
          date: Date.now(),
          type: "meeting",
          investor: investor.name,
        };

        set((state) => ({
          fundingHistory: [...state.fundingHistory, fundingEntry],
        }));

        // Improve relationship if it's an active investor
        if (investor.invested) {
          get().updateInvestorRelationship(investorId, 10);
        } else {
          // Increase interest if it's a potential investor
          set((state) => ({
            potentialInvestors: state.potentialInvestors.map((inv) =>
              inv.id === investorId
                ? { ...inv, interest: Math.min(100, inv.interest + 10) }
                : inv
            ),
          }));
        }

        return true;
      },

      // Process investors (called on game tick)
      processInvestors: () => {
        // Check for expired offers
        // Check expectations being met
        // Update relationships based on company performance

        // For now, just periodically update relationships
        set((state) => ({
          investors: state.investors.map((investor) => {
            // Check if company is meeting expectations
            const gameState = useGameStore.getState();
            const productQuality = useProductStore
              .getState()
              .getProductQuality();

            // Simple relationship change based on revenue growth and product quality
            let relationshipChange = 0;

            // Revenue growth improves relationship
            if (gameState.revenueGrowth > 10) {
              relationshipChange += 1;
            } else if (gameState.revenueGrowth < 0) {
              relationshipChange -= 1;
            }

            // Product quality impacts relationship
            if (productQuality > 75) {
              relationshipChange += 0.5;
            } else if (productQuality < 40) {
              relationshipChange -= 0.5;
            }

            // Apply relationship change
            return {
              ...investor,
              relationship: Math.max(
                0,
                Math.min(100, investor.relationship + relationshipChange)
              ),
            };
          }),
        }));
      },

      // Reset investor state (for new games)
      resetInvestors: () => {
        set({
          investors: [],
          potentialInvestors: [],
          fundingHistory: [],
          fundingRounds: [],
          totalFundingRaised: 0,
          totalEquitySold: 0,
          currentValuation: 500000,
          lastValuationDate: null,
        });
      },
    }),
    {
      name: "startup-simulator-investor-storage",
    }
  )
);

// Helper function to generate a random investor
function generateInvestor(type) {
  const investorType = INVESTOR_TYPES.find((t) => t.id === type);

  if (!investorType) {
    throw new Error(`Invalid investor type: ${type}`);
  }

  // Generate random name
  const useCompanyName = Math.random() > 0.3; // 70% chance of company name
  let name;

  if (useCompanyName) {
    const prefix =
      INVESTOR_NAMES.prefixes[
        Math.floor(Math.random() * INVESTOR_NAMES.prefixes.length)
      ];
    const suffix =
      INVESTOR_NAMES.suffixes[
        Math.floor(Math.random() * INVESTOR_NAMES.suffixes.length)
      ];
    name = `${prefix} ${suffix}`;
  } else {
    const person =
      INVESTOR_NAMES.people[
        Math.floor(Math.random() * INVESTOR_NAMES.people.length)
      ];
    name = `${person} Ventures`;
  }

  // Pick 1-2 random focus areas
  const allFocusAreas = [
    "user_growth",
    "revenue_growth",
    "product_launch",
    "market_fit",
    "innovative_tech",
    "team_expertise",
    "market_share",
    "profitability",
    "scalability",
  ];

  const focusAreasCount = 1 + Math.floor(Math.random() * 2);
  const focusAreas = [];

  // Always include investorType's focus areas
  investorType.focusAreas.forEach((area) => {
    if (focusAreas.length < focusAreasCount && !focusAreas.includes(area)) {
      focusAreas.push(area);
    }
  });

  // Add additional random focus areas if needed
  while (focusAreas.length < focusAreasCount) {
    const area =
      allFocusAreas[Math.floor(Math.random() * allFocusAreas.length)];
    if (!focusAreas.includes(area)) {
      focusAreas.push(area);
    }
  }

  // Initial interest based on investor type and some randomness
  const baseInterest =
    {
      angel: 40,
      seed_vc: 30,
      series_a: 20,
      series_b: 10,
    }[type] || 30;

  const interest = baseInterest + Math.floor(Math.random() * 20);

  // Create the investor
  return {
    id: nanoid(),
    name,
    type: investorType.id,
    interest,
    interestThreshold: investorType.interestThreshold,
    focusAreas,
    contacted: false,
    invested: false,
  };
}

// Helper function to get round name from investor type
function getRoundNameFromType(type) {
  switch (type) {
    case "angel":
      return "Pre-Seed";
    case "seed_vc":
      return "Seed";
    case "series_a":
      return "Series A";
    case "series_b":
      return "Series B";
    default:
      return "Unknown Round";
  }
}

export default useInvestorStore;
