// src/components/investors/InvestorRelations.jsx
import React, { useState } from "react";
import styles from "./InvestorRelations.module.scss";
import useGameStore from "../../store/gameStore";

const InvestorRelations = () => {
  const [activeTab, setActiveTab] = useState("investors");

  // Get game state
  const companyName = useGameStore((state) => state.companyName);
  const companyValuation = useGameStore((state) => state.companyValuation);
  const cash = useGameStore((state) => state.cash);
  const revenue = useGameStore((state) => state.revenue);
  const expenses = useGameStore((state) => state.expenses);

  // Mock investor data (would come from an investor store in the full implementation)
  const investorData = {
    currentInvestors: [
      {
        id: 1,
        name: "Seed Fund Capital",
        type: "Angel Investor",
        investment: 50000,
        equity: 10,
        relationship: 75,
        expectations: "Launch MVP within 3 months",
        invested: true,
      },
    ],
    potentialInvestors: [
      {
        id: 2,
        name: "Money Burner Capital",
        type: "VC Firm",
        interest: 65,
        potentialInvestment: 250000,
        equityRequest: 15,
        focus: "Tech startups with AI integration",
        expectations: "Triple revenue within a year",
      },
      {
        id: 3,
        name: "Growth Partners",
        type: "VC Firm",
        interest: 40,
        potentialInvestment: 500000,
        equityRequest: 25,
        focus: "Market expansion and scalability",
        expectations: "Aggressive growth and market dominance",
      },
    ],
    fundingRounds: [
      {
        id: 1,
        name: "Pre-seed",
        amount: 50000,
        equity: 10,
        date: "3 months ago",
        investors: ["Seed Fund Capital"],
        valuation: 500000,
        completed: true,
      },
    ],
    fundingHistory: [
      {
        date: "3 months ago",
        event: "Received $50,000 from Seed Fund Capital for 10% equity",
        type: "investment",
      },
      {
        date: "2 months ago",
        event: "Board meeting with Seed Fund Capital",
        type: "meeting",
      },
      {
        date: "2 weeks ago",
        event: "Initial interest from Money Burner Capital",
        type: "interest",
      },
    ],
  };

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  // Calculate monthly profit/loss
  const monthlyProfitLoss = revenue - expenses;
  const isProfitable = monthlyProfitLoss >= 0;

  // Calculate relationships
  const getRelationshipClass = (relationship) => {
    if (relationship >= 75) return styles.excellent;
    if (relationship >= 50) return styles.good;
    if (relationship >= 25) return styles.fair;
    return styles.poor;
  };

  // Calculate interest level
  const getInterestClass = (interest) => {
    if (interest >= 75) return styles.excellent;
    if (interest >= 50) return styles.good;
    if (interest >= 25) return styles.fair;
    return styles.poor;
  };

  return (
    <div className={styles.investorRelations}>
      <header className={styles.investorHeader}>
        <h2>Investor Relations</h2>

        <div className={styles.companyValuation}>
          <span className={styles.valuationLabel}>Company Valuation</span>
          <span className={styles.valuationAmount}>
            ${formatNumber(companyValuation)}
          </span>
        </div>
      </header>

      <div className={styles.financialSnapshot}>
        <div className={styles.snapshotItem}>
          <span className={styles.snapshotLabel}>Current Cash</span>
          <span className={styles.snapshotValue}>${formatNumber(cash)}</span>
        </div>

        <div className={styles.snapshotItem}>
          <span className={styles.snapshotLabel}>Monthly Revenue</span>
          <span className={styles.snapshotValue}>${formatNumber(revenue)}</span>
        </div>

        <div className={styles.snapshotItem}>
          <span className={styles.snapshotLabel}>Monthly Expenses</span>
          <span className={styles.snapshotValue}>
            ${formatNumber(expenses)}
          </span>
        </div>

        <div className={styles.snapshotItem}>
          <span className={styles.snapshotLabel}>
            Monthly {isProfitable ? "Profit" : "Loss"}
          </span>
          <span
            className={`${styles.snapshotValue} ${
              isProfitable ? styles.profit : styles.loss
            }`}
          >
            ${formatNumber(Math.abs(monthlyProfitLoss))}
          </span>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "investors" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("investors")}
          >
            Investors
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "funding" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("funding")}
          >
            Funding Rounds
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "pitch" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("pitch")}
          >
            Pitch Deck
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "history" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "investors" && (
            <div className={styles.investorsTab}>
              <div className={styles.sectionHeader}>
                <h3>Current Investors</h3>
              </div>

              {investorData.currentInvestors.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>
                    You don't have any investors yet. Try pitching to potential
                    investors!
                  </p>
                </div>
              ) : (
                <div className={styles.investorsList}>
                  {investorData.currentInvestors.map((investor) => (
                    <div key={investor.id} className={styles.investorCard}>
                      <div className={styles.investorHeader}>
                        <h4 className={styles.investorName}>{investor.name}</h4>
                        <span className={styles.investorType}>
                          {investor.type}
                        </span>
                      </div>

                      <div className={styles.investmentDetails}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Investment</span>
                          <span className={styles.detailValue}>
                            ${formatNumber(investor.investment)}
                          </span>
                        </div>

                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Equity</span>
                          <span className={styles.detailValue}>
                            {investor.equity}%
                          </span>
                        </div>
                      </div>

                      <div className={styles.relationshipSection}>
                        <div className={styles.relationshipHeader}>
                          <span className={styles.relationshipLabel}>
                            Relationship
                          </span>
                          <span
                            className={`${
                              styles.relationshipValue
                            } ${getRelationshipClass(investor.relationship)}`}
                          >
                            {investor.relationship}%
                          </span>
                        </div>

                        <div className={styles.relationshipBarContainer}>
                          <div
                            className={`${
                              styles.relationshipBar
                            } ${getRelationshipClass(investor.relationship)}`}
                            style={{ width: `${investor.relationship}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className={styles.expectationsSection}>
                        <span className={styles.expectationsLabel}>
                          Expectations:
                        </span>
                        <p className={styles.expectationsText}>
                          {investor.expectations}
                        </p>
                      </div>

                      <div className={styles.investorActions}>
                        <button className={styles.actionButton}>
                          Schedule Meeting
                        </button>
                        <button className={styles.actionButton}>Update</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.sectionHeader}>
                <h3>Potential Investors</h3>
                <button className={styles.findButton}>
                  Find More Investors
                </button>
              </div>

              {investorData.potentialInvestors.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>
                    No potential investors at the moment. Improve your company
                    metrics to attract investors!
                  </p>
                </div>
              ) : (
                <div className={styles.investorsList}>
                  {investorData.potentialInvestors.map((investor) => (
                    <div key={investor.id} className={styles.investorCard}>
                      <div className={styles.investorHeader}>
                        <h4 className={styles.investorName}>{investor.name}</h4>
                        <span className={styles.investorType}>
                          {investor.type}
                        </span>
                      </div>

                      <div className={styles.interestSection}>
                        <div className={styles.interestHeader}>
                          <span className={styles.interestLabel}>
                            Interest Level
                          </span>
                          <span
                            className={`${
                              styles.interestValue
                            } ${getInterestClass(investor.interest)}`}
                          >
                            {investor.interest}%
                          </span>
                        </div>

                        <div className={styles.interestBarContainer}>
                          <div
                            className={`${
                              styles.interestBar
                            } ${getInterestClass(investor.interest)}`}
                            style={{ width: `${investor.interest}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className={styles.potentialDetails}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>
                            Potential Investment
                          </span>
                          <span className={styles.detailValue}>
                            ${formatNumber(investor.potentialInvestment)}
                          </span>
                        </div>

                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>
                            Equity Request
                          </span>
                          <span className={styles.detailValue}>
                            {investor.equityRequest}%
                          </span>
                        </div>
                      </div>

                      <div className={styles.focusSection}>
                        <span className={styles.focusLabel}>Focus:</span>
                        <p className={styles.focusText}>{investor.focus}</p>
                      </div>

                      <div className={styles.expectationsSection}>
                        <span className={styles.expectationsLabel}>
                          Expectations:
                        </span>
                        <p className={styles.expectationsText}>
                          {investor.expectations}
                        </p>
                      </div>

                      <div className={styles.investorActions}>
                        <button className={styles.actionButton}>Pitch</button>
                        <button className={styles.actionButton}>
                          Research
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "funding" && (
            <div className={styles.fundingTab}>
              <div className={styles.emptyState}>
                <p>Funding rounds management coming soon!</p>
              </div>
            </div>
          )}

          {activeTab === "pitch" && (
            <div className={styles.pitchTab}>
              <div className={styles.emptyState}>
                <p>Pitch deck builder coming soon!</p>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className={styles.historyTab}>
              <div className={styles.timelineHeader}>
                <h3>Investment Timeline</h3>
              </div>

              <div className={styles.timeline}>
                {investorData.fundingHistory.map((event, index) => (
                  <div
                    key={index}
                    className={`${styles.timelineEvent} ${styles[event.type]}`}
                  >
                    <div className={styles.timelineDot}></div>
                    <div className={styles.timelineContent}>
                      <span className={styles.timelineDate}>{event.date}</span>
                      <p className={styles.timelineText}>{event.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorRelations;
