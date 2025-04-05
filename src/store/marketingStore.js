// src/store/marketingStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import useGameStore from "./gameStore";
import useProductStore from "./productStore";

// Campaign templates
const CAMPAIGN_TEMPLATES = [
  {
    id: "social_media",
    name: "Social Media Campaign",
    type: "Social Media",
    description:
      "Run targeted ads on social media platforms to reach potential users.",
    baseCost: 1500,
    baseDuration: 7,
    baseEffectiveness: 60,
    baseReach: 5000,
    baseConversionRate: 2.0,
  },
  {
    id: "email_marketing",
    name: "Email Marketing",
    type: "Email",
    description:
      "Send promotional emails to a targeted list of potential customers.",
    baseCost: 1000,
    baseDuration: 5,
    baseEffectiveness: 55,
    baseReach: 3000,
    baseConversionRate: 2.5,
  },
  {
    id: "content_marketing",
    name: "Content Marketing",
    type: "Content",
    description:
      "Create and distribute valuable content to attract and engage your target audience.",
    baseCost: 2000,
    baseDuration: 14,
    baseEffectiveness: 65,
    baseReach: 8000,
    baseConversionRate: 1.8,
  },
  {
    id: "pr_release",
    name: "Press Release",
    type: "PR",
    description:
      "Issue a press release to announce major updates or milestones.",
    baseCost: 3000,
    baseDuration: 3,
    baseEffectiveness: 70,
    baseReach: 10000,
    baseConversionRate: 1.2,
  },
  {
    id: "influencer",
    name: "Influencer Partnership",
    type: "Influencer",
    description: "Partner with industry influencers to promote your product.",
    baseCost: 5000,
    baseDuration: 10,
    baseEffectiveness: 75,
    baseReach: 15000,
    baseConversionRate: 2.2,
  },
  {
    id: "seo",
    name: "SEO Optimization",
    type: "SEO",
    description:
      "Optimize your website for search engines to improve organic traffic.",
    baseCost: 2500,
    baseDuration: 30,
    baseEffectiveness: 60,
    baseReach: 7000,
    baseConversionRate: 3.0,
  },
  {
    id: "conference",
    name: "Industry Conference",
    type: "Event",
    description:
      "Attend or sponsor an industry conference to showcase your product.",
    baseCost: 7500,
    baseDuration: 3,
    baseEffectiveness: 80,
    baseReach: 2000,
    baseConversionRate: 5.0,
  },
];

// Marketing channels
const MARKETING_CHANNELS = [
  {
    id: "social",
    name: "Social Media",
    platforms: ["Facebook", "Twitter", "Instagram", "LinkedIn"],
    effectiveness: 70,
    costFactor: 1.0,
    audienceReach: "broad",
  },
  {
    id: "search",
    name: "Search Engines",
    platforms: ["Google", "Bing"],
    effectiveness: 65,
    costFactor: 1.2,
    audienceReach: "intent-based",
  },
  {
    id: "email",
    name: "Email",
    platforms: ["Newsletter", "Drip Campaigns"],
    effectiveness: 60,
    costFactor: 0.8,
    audienceReach: "targeted",
  },
  {
    id: "content",
    name: "Content Marketing",
    platforms: ["Blog", "YouTube", "Podcasts"],
    effectiveness: 55,
    costFactor: 0.9,
    audienceReach: "engaged",
  },
  {
    id: "pr",
    name: "Public Relations",
    platforms: ["Press Releases", "Media Outreach"],
    effectiveness: 50,
    costFactor: 1.5,
    audienceReach: "broad",
  },
];

// Audience segments
const AUDIENCE_SEGMENTS = [
  {
    id: "tech_enthusiasts",
    name: "Tech Enthusiasts",
    description: "Early adopters who love trying new technologies",
    conversionFactor: 2.0,
    reachFactor: 0.8,
    bestChannels: ["social", "content"],
  },
  {
    id: "businesses",
    name: "Business Professionals",
    description: "Corporate users looking for productivity solutions",
    conversionFactor: 1.5,
    reachFactor: 0.9,
    bestChannels: ["search", "email", "pr"],
  },
  {
    id: "students",
    name: "Students",
    description: "Young users with limited budget but high engagement",
    conversionFactor: 1.0,
    reachFactor: 1.2,
    bestChannels: ["social", "content"],
  },
  {
    id: "developers",
    name: "Developers",
    description: "Technical users who value function over form",
    conversionFactor: 1.8,
    reachFactor: 0.7,
    bestChannels: ["content", "search"],
  },
];

// Create the marketing store
const useMarketingStore = create(
  persist(
    (set, get) => ({
      // Marketing state
      activeCampaigns: [],
      pastCampaigns: [],
      targetAudience: null,
      availableChannels: MARKETING_CHANNELS.map((channel) => ({
        ...channel,
        unlocked: channel.id === "social" ? true : false, // Only social media unlocked initially
      })),
      marketingStats: {
        totalReach: 0,
        totalConversions: 0,
        totalSpent: 0,
        monthlyBudget: 5000,
        averageConversionRate: 0,
        brandAwareness: 0,
      },

      // Get available campaign templates
      getCampaignTemplates: () => {
        // Filter based on unlocked channels
        const unlockedChannelIds = get()
          .availableChannels.filter((channel) => channel.unlocked)
          .map((channel) => channel.id);

        return CAMPAIGN_TEMPLATES.filter((template) => {
          const templateChannel = template.type.toLowerCase();
          return unlockedChannelIds.some((id) => templateChannel.includes(id));
        });
      },

      // Get all audience segments
      getAudienceSegments: () => AUDIENCE_SEGMENTS,

      // Select target audience
      selectTargetAudience: (audienceId) => {
        const audience = AUDIENCE_SEGMENTS.find(
          (segment) => segment.id === audienceId
        );
        if (!audience) return false;

        set({ targetAudience: audience });
        return true;
      },

      // Start a new marketing campaign
      startCampaign: (campaignTemplate, options = {}) => {
        const template = CAMPAIGN_TEMPLATES.find(
          (t) => t.id === campaignTemplate
        );
        if (!template)
          return { success: false, message: "Invalid campaign template" };

        // Calculate campaign cost with modifiers
        const budget = options.budget || template.baseCost;
        const duration = options.duration || template.baseDuration;

        // Check if we can afford it
        const cash = useGameStore.getState().cash;
        if (cash < budget) {
          return {
            success: false,
            message: "Not enough cash to start this campaign",
          };
        }

        // Apply audience targeting modifiers
        const targetAudience = get().targetAudience;
        const audienceFactor = targetAudience
          ? targetAudience.bestChannels.includes(template.type.toLowerCase())
            ? 1.5
            : 0.8
          : 1.0;

        // Apply product quality factor
        const productQuality = useProductStore.getState().getProductQuality();
        const qualityFactor = 0.5 + (productQuality / 100) * 1.0;

        // Calculate effectiveness with all factors
        const effectiveness = Math.min(
          100,
          template.baseEffectiveness * audienceFactor * qualityFactor
        );

        // Calculate expected reach and conversions
        const reach = Math.round(
          template.baseReach * (budget / template.baseCost)
        );
        const conversionRate =
          template.baseConversionRate * audienceFactor * qualityFactor;
        const estimatedConversions = Math.round((reach * conversionRate) / 100);

        // Create new campaign
        const newCampaign = {
          id: nanoid(),
          templateId: template.id,
          name: options.name || template.name,
          type: template.type,
          budget,
          duration,
          daysRemaining: duration,
          startDate: options.startDate || Date.now(),
          effectiveness,
          reach: 0, // Will accumulate over time
          conversions: 0, // Will accumulate over time
          targetAudienceId: targetAudience?.id,
          status: "active",
          estimatedReach: reach,
          estimatedConversions,
          estimatedConversionRate: conversionRate,
        };

        // Deduct cost from cash
        useGameStore.getState().updateCash(-budget);

        // Add to active campaigns
        set((state) => ({
          activeCampaigns: [...state.activeCampaigns, newCampaign],
          marketingStats: {
            ...state.marketingStats,
            totalSpent: state.marketingStats.totalSpent + budget,
          },
        }));

        return { success: true, campaign: newCampaign };
      },

      // Process active campaigns (called on game tick)
      processCampaigns: () => {
        const state = get();

        if (state.activeCampaigns.length === 0) return;

        let updatedCampaigns = [];
        let completedCampaigns = [];
        let totalNewReach = 0;
        let totalNewConversions = 0;

        state.activeCampaigns.forEach((campaign) => {
          // Reduce days remaining
          const daysRemaining = campaign.daysRemaining - 1 / 24; // 1 hour per tick

          if (daysRemaining <= 0) {
            // Campaign is complete
            completedCampaigns.push({
              ...campaign,
              status: "completed",
              daysRemaining: 0,
            });
          } else {
            // Campaign is still active
            // Calculate daily reach and conversions
            const dailyReach = campaign.estimatedReach / campaign.duration;
            const dailyConversions =
              campaign.estimatedConversions / campaign.duration;

            // Add hourly amounts (1/24 of daily)
            const hourlyReach = Math.round(dailyReach / 24);
            const hourlyConversions = Math.round(dailyConversions / 24);

            // Update campaign
            const updatedCampaign = {
              ...campaign,
              daysRemaining,
              reach: campaign.reach + hourlyReach,
              conversions: campaign.conversions + hourlyConversions,
            };

            updatedCampaigns.push(updatedCampaign);
            totalNewReach += hourlyReach;
            totalNewConversions += hourlyConversions;
          }
        });

        // Update brand awareness based on reach
        const currentAwareness = state.marketingStats.brandAwareness;
        const awarenessIncrease =
          totalNewReach > 0 ? (totalNewReach / 10000) * 0.5 : 0;

        // Update marketing stats
        const updatedStats = {
          ...state.marketingStats,
          totalReach: state.marketingStats.totalReach + totalNewReach,
          totalConversions:
            state.marketingStats.totalConversions + totalNewConversions,
          brandAwareness: Math.min(100, currentAwareness + awarenessIncrease),
        };

        // Calculate new average conversion rate
        if (updatedStats.totalReach > 0) {
          updatedStats.averageConversionRate =
            (updatedStats.totalConversions / updatedStats.totalReach) * 100;
        }

        // Move completed campaigns to past campaigns
        set((state) => ({
          activeCampaigns: updatedCampaigns,
          pastCampaigns: [...state.pastCampaigns, ...completedCampaigns],
          marketingStats: updatedStats,
        }));

        // Update game metrics based on campaign performance
        if (totalNewConversions > 0) {
          // Increase customer reputation based on conversions
          useGameStore
            .getState()
            .updateReputation("customer", totalNewConversions * 0.05);

          // Increase industry reputation based on reach
          useGameStore
            .getState()
            .updateReputation("industry", totalNewReach * 0.01);
        }
      },

      // Cancel an active campaign
      cancelCampaign: (campaignId) => {
        const campaign = get().activeCampaigns.find((c) => c.id === campaignId);
        if (!campaign) return false;

        // Calculate completion percentage
        const completionPercentage =
          ((campaign.duration - campaign.daysRemaining) / campaign.duration) *
          100;

        // Update campaign status
        const updatedCampaign = {
          ...campaign,
          status: "cancelled",
          daysRemaining: 0,
        };

        // Move to past campaigns
        set((state) => ({
          activeCampaigns: state.activeCampaigns.filter(
            (c) => c.id !== campaignId
          ),
          pastCampaigns: [...state.pastCampaigns, updatedCampaign],
        }));

        return true;
      },

      // Boost an active campaign with additional budget
      boostCampaign: (campaignId, additionalBudget) => {
        const campaign = get().activeCampaigns.find((c) => c.id === campaignId);
        if (!campaign) return { success: false, message: "Campaign not found" };

        // Check if we can afford it
        const cash = useGameStore.getState().cash;
        if (cash < additionalBudget) {
          return {
            success: false,
            message: "Not enough cash to boost this campaign",
          };
        }

        // Calculate boost impact
        const reachIncrease = Math.round(
          campaign.estimatedReach * (additionalBudget / campaign.budget) * 0.8
        );
        const conversionIncrease = Math.round(
          campaign.estimatedConversions *
            (additionalBudget / campaign.budget) *
            0.8
        );

        // Update campaign
        set((state) => ({
          activeCampaigns: state.activeCampaigns.map((c) =>
            c.id === campaignId
              ? {
                  ...c,
                  budget: c.budget + additionalBudget,
                  estimatedReach: c.estimatedReach + reachIncrease,
                  estimatedConversions:
                    c.estimatedConversions + conversionIncrease,
                }
              : c
          ),
          marketingStats: {
            ...state.marketingStats,
            totalSpent: state.marketingStats.totalSpent + additionalBudget,
          },
        }));

        // Deduct cost from cash
        useGameStore.getState().updateCash(-additionalBudget);

        return { success: true };
      },

      // Unlock a new marketing channel
      unlockChannel: (channelId) => {
        const channel = get().availableChannels.find((c) => c.id === channelId);
        if (!channel || channel.unlocked) return false;

        // Set channel as unlocked
        set((state) => ({
          availableChannels: state.availableChannels.map((c) =>
            c.id === channelId ? { ...c, unlocked: true } : c
          ),
        }));

        return true;
      },

      // Set monthly marketing budget
      setMonthlyBudget: (amount) => {
        set((state) => ({
          marketingStats: {
            ...state.marketingStats,
            monthlyBudget: amount,
          },
        }));
      },

      // Reset marketing state (for new games)
      resetMarketing: () => {
        set({
          activeCampaigns: [],
          pastCampaigns: [],
          targetAudience: null,
          availableChannels: MARKETING_CHANNELS.map((channel) => ({
            ...channel,
            unlocked: channel.id === "social" ? true : false, // Only social media unlocked initially
          })),
          marketingStats: {
            totalReach: 0,
            totalConversions: 0,
            totalSpent: 0,
            monthlyBudget: 5000,
            averageConversionRate: 0,
            brandAwareness: 0,
          },
        });
      },
    }),
    {
      name: "startup-simulator-marketing-storage",
    }
  )
);

export default useMarketingStore;
