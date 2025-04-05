// src/components/marketing/MarketingCampaigns.jsx
import React, { useState } from "react";
import styles from "./MarketingCampaigns.module.scss";
import useGameStore from "../../store/gameStore";

const MarketingCampaigns = () => {
  const [activeTab, setActiveTab] = useState("campaigns");

  // Get game state
  const cash = useGameStore((state) => state.cash);
  const reputation = useGameStore((state) => state.reputation);

  // Mock marketing data (would come from a marketing store in the full implementation)
  const marketingData = {
    activeCampaigns: [
      {
        id: 1,
        name: "Social Media Blitz",
        type: "Social Media",
        budget: 1500,
        duration: 7,
        daysRemaining: 3,
        effectiveness: 65,
        reach: 8500,
        conversions: 120,
        status: "active",
      },
    ],
    pastCampaigns: [
      {
        id: 2,
        name: "Launch Email Campaign",
        type: "Email",
        budget: 1000,
        duration: 5,
        effectiveness: 70,
        reach: 5000,
        conversions: 75,
        status: "completed",
      },
    ],
    availableCampaigns: [
      {
        id: 3,
        name: "Tech Blog Sponsorship",
        type: "Content Marketing",
        budget: 3000,
        duration: 14,
        estimatedReach: 15000,
        estimatedConversions: "200-300",
        description:
          "Sponsor articles on popular tech blogs to showcase your product.",
      },
      {
        id: 4,
        name: "SEO Optimization",
        type: "Search Engine",
        budget: 2000,
        duration: 30,
        estimatedReach: 10000,
        estimatedConversions: "100-200",
        description:
          "Optimize your website for search engines to improve organic traffic.",
      },
      {
        id: 5,
        name: "Industry Conference",
        type: "Event",
        budget: 5000,
        duration: 3,
        estimatedReach: 3000,
        estimatedConversions: "50-100",
        description:
          "Set up a booth at a major industry conference to showcase your product.",
      },
    ],
    marketingStats: {
      totalReach: 13500,
      totalConversions: 195,
      conversionRate: 1.44,
      activeSpend: 1500,
      monthlyBudget: 5000,
      awareness: 15,
    },
  };

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  // Get effectiveness class
  const getEffectivenessClass = (effectiveness) => {
    if (effectiveness >= 75) return styles.excellent;
    if (effectiveness >= 50) return styles.good;
    if (effectiveness >= 25) return styles.fair;
    return styles.poor;
  };

  // Check if can afford
  const canAfford = (budget) => {
    return cash >= budget;
  };

  return (
    <div className={styles.marketingCampaigns}>
      <header className={styles.marketingHeader}>
        <h2>Marketing Campaigns</h2>

        <div className={styles.marketingBudget}>
          <span className={styles.budgetLabel}>Marketing Budget</span>
          <div className={styles.budgetInfo}>
            <span className={styles.spentAmount}>
              ${formatNumber(marketingData.marketingStats.activeSpend)}
            </span>
            <span className={styles.budgetDivider}>/</span>
            <span className={styles.totalBudget}>
              ${formatNumber(marketingData.marketingStats.monthlyBudget)}
            </span>
          </div>
        </div>
      </header>

      <div className={styles.marketingStats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Reach</span>
            <span className={styles.statValue}>
              {formatNumber(marketingData.marketingStats.totalReach)}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Conversions</span>
            <span className={styles.statValue}>
              {formatNumber(marketingData.marketingStats.totalConversions)}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Conversion Rate</span>
            <span className={styles.statValue}>
              {marketingData.marketingStats.conversionRate}%
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔊</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Brand Awareness</span>
            <span className={styles.statValue}>
              {marketingData.marketingStats.awareness}%
            </span>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "campaigns" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("campaigns")}
          >
            Campaigns
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "audience" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("audience")}
          >
            Audience
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "channels" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("channels")}
          >
            Channels
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "analytics" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "campaigns" && (
            <div className={styles.campaignsTab}>
              <div className={styles.sectionHeader}>
                <h3>Active Campaigns</h3>
              </div>

              {marketingData.activeCampaigns.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>
                    No active marketing campaigns. Start a new campaign to
                    promote your product!
                  </p>
                </div>
              ) : (
                <div className={styles.campaignsList}>
                  {marketingData.activeCampaigns.map((campaign) => (
                    <div key={campaign.id} className={styles.campaignCard}>
                      <div className={styles.campaignHeader}>
                        <h4 className={styles.campaignName}>{campaign.name}</h4>
                        <span className={styles.campaignType}>
                          {campaign.type}
                        </span>
                      </div>

                      <div className={styles.campaignStats}>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>Budget</span>
                          <span className={styles.statValue}>
                            ${formatNumber(campaign.budget)}
                          </span>
                        </div>

                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>Days Left</span>
                          <span className={styles.statValue}>
                            {campaign.daysRemaining} / {campaign.duration}
                          </span>
                        </div>
                      </div>

                      <div className={styles.campaignProgress}>
                        <div className={styles.progressHeader}>
                          <span className={styles.progressLabel}>Progress</span>
                          <span className={styles.progressValue}>
                            {Math.round(
                              ((campaign.duration - campaign.daysRemaining) /
                                campaign.duration) *
                                100
                            )}
                            %
                          </span>
                        </div>

                        <div className={styles.progressBarContainer}>
                          <div
                            className={styles.progressBar}
                            style={{
                              width: `${
                                ((campaign.duration - campaign.daysRemaining) /
                                  campaign.duration) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className={styles.campaignEffectiveness}>
                        <div className={styles.effectivenessHeader}>
                          <span className={styles.effectivenessLabel}>
                            Effectiveness
                          </span>
                          <span
                            className={`${
                              styles.effectivenessValue
                            } ${getEffectivenessClass(campaign.effectiveness)}`}
                          >
                            {campaign.effectiveness}%
                          </span>
                        </div>

                        <div className={styles.effectivenessBarContainer}>
                          <div
                            className={`${
                              styles.effectivenessBar
                            } ${getEffectivenessClass(campaign.effectiveness)}`}
                            style={{ width: `${campaign.effectiveness}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className={styles.campaignResults}>
                        <div className={styles.resultItem}>
                          <span className={styles.resultLabel}>Reach</span>
                          <span className={styles.resultValue}>
                            {formatNumber(campaign.reach)}
                          </span>
                        </div>

                        <div className={styles.resultItem}>
                          <span className={styles.resultLabel}>
                            Conversions
                          </span>
                          <span className={styles.resultValue}>
                            {formatNumber(campaign.conversions)}
                          </span>
                        </div>
                      </div>

                      <div className={styles.campaignActions}>
                        <button className={styles.actionButton}>Boost</button>
                        <button className={styles.actionButton}>Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.sectionHeader}>
                <h3>Available Campaigns</h3>
              </div>

              <div className={styles.campaignsList}>
                {marketingData.availableCampaigns.map((campaign) => (
                  <div key={campaign.id} className={styles.campaignCard}>
                    <div className={styles.campaignHeader}>
                      <h4 className={styles.campaignName}>{campaign.name}</h4>
                      <span className={styles.campaignType}>
                        {campaign.type}
                      </span>
                    </div>

                    <p className={styles.campaignDescription}>
                      {campaign.description}
                    </p>

                    <div className={styles.campaignDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Budget</span>
                        <span className={styles.detailValue}>
                          ${formatNumber(campaign.budget)}
                        </span>
                      </div>

                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Duration</span>
                        <span className={styles.detailValue}>
                          {campaign.duration} days
                        </span>
                      </div>
                    </div>

                    <div className={styles.campaignPotential}>
                      <div className={styles.potentialItem}>
                        <span className={styles.potentialLabel}>
                          Est. Reach
                        </span>
                        <span className={styles.potentialValue}>
                          {formatNumber(campaign.estimatedReach)}
                        </span>
                      </div>

                      <div className={styles.potentialItem}>
                        <span className={styles.potentialLabel}>
                          Est. Conversions
                        </span>
                        <span className={styles.potentialValue}>
                          {campaign.estimatedConversions}
                        </span>
                      </div>
                    </div>

                    <button
                      className={`${styles.startButton} ${
                        !canAfford(campaign.budget) ? styles.disabled : ""
                      }`}
                      disabled={!canAfford(campaign.budget)}
                    >
                      {canAfford(campaign.budget)
                        ? "Start Campaign"
                        : "Not Enough Cash"}
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.sectionHeader}>
                <h3>Past Campaigns</h3>
              </div>

              {marketingData.pastCampaigns.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No past campaigns to show.</p>
                </div>
              ) : (
                <div className={styles.campaignsList}>
                  {marketingData.pastCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className={`${styles.campaignCard} ${styles.pastCampaign}`}
                    >
                      <div className={styles.campaignHeader}>
                        <h4 className={styles.campaignName}>{campaign.name}</h4>
                        <span className={styles.campaignType}>
                          {campaign.type}
                        </span>
                      </div>

                      <div className={styles.campaignStats}>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>Budget</span>
                          <span className={styles.statValue}>
                            ${formatNumber(campaign.budget)}
                          </span>
                        </div>

                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>Duration</span>
                          <span className={styles.statValue}>
                            {campaign.duration} days
                          </span>
                        </div>
                      </div>

                      <div className={styles.campaignEffectiveness}>
                        <div className={styles.effectivenessHeader}>
                          <span className={styles.effectivenessLabel}>
                            Effectiveness
                          </span>
                          <span
                            className={`${
                              styles.effectivenessValue
                            } ${getEffectivenessClass(campaign.effectiveness)}`}
                          >
                            {campaign.effectiveness}%
                          </span>
                        </div>

                        <div className={styles.effectivenessBarContainer}>
                          <div
                            className={`${
                              styles.effectivenessBar
                            } ${getEffectivenessClass(campaign.effectiveness)}`}
                            style={{ width: `${campaign.effectiveness}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className={styles.campaignResults}>
                        <div className={styles.resultItem}>
                          <span className={styles.resultLabel}>Reach</span>
                          <span className={styles.resultValue}>
                            {formatNumber(campaign.reach)}
                          </span>
                        </div>

                        <div className={styles.resultItem}>
                          <span className={styles.resultLabel}>
                            Conversions
                          </span>
                          <span className={styles.resultValue}>
                            {formatNumber(campaign.conversions)}
                          </span>
                        </div>
                      </div>

                      <div className={styles.campaignActions}>
                        <button className={styles.actionButton}>
                          View Report
                        </button>
                        <button className={styles.actionButton}>
                          Run Again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "audience" && (
            <div className={styles.audienceTab}>
              <div className={styles.emptyState}>
                <p>Audience targeting tools coming soon!</p>
              </div>
            </div>
          )}

          {activeTab === "channels" && (
            <div className={styles.channelsTab}>
              <div className={styles.emptyState}>
                <p>Marketing channels configuration coming soon!</p>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className={styles.analyticsTab}>
              <div className={styles.emptyState}>
                <p>Marketing analytics dashboard coming soon!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingCampaigns;
