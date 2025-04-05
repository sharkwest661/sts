// src/components/dashboard/widgets/TeamOverviewWidget.jsx
import React from "react";
import styles from "./TeamOverviewWidget.module.scss";

const TeamOverviewWidget = ({ teamStats, teamCount, onViewTeam }) => {
  // Helper function to determine morale status
  const getMoraleStatus = (morale) => {
    if (morale >= 75) return { label: "Excellent", class: styles.excellent };
    if (morale >= 50) return { label: "Good", class: styles.good };
    if (morale >= 25) return { label: "Fair", class: styles.fair };
    return { label: "Poor", class: styles.poor };
  };

  // Helper function to determine energy status
  const getEnergyStatus = (energy) => {
    if (energy >= 75) return { label: "High", class: styles.excellent };
    if (energy >= 50) return { label: "Medium", class: styles.good };
    if (energy >= 25) return { label: "Low", class: styles.fair };
    return { label: "Critical", class: styles.poor };
  };

  // Get morale and energy status
  const moraleStatus = getMoraleStatus(teamStats.averageMorale || 0);
  const energyStatus = getEnergyStatus(teamStats.averageEnergy || 0);

  return (
    <div className={styles.teamWidget}>
      <h3 className={styles.widgetTitle}>Team Overview</h3>

      <div className={styles.teamStats}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>👥</span>
          <span className={styles.statValue}>{teamCount}</span>
          <span className={styles.statLabel}>Team Members</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statIcon}>💼</span>
          <span className={styles.statValue}>
            ${teamStats.totalSalary?.toLocaleString() || 0}
          </span>
          <span className={styles.statLabel}>Monthly Salaries</span>
        </div>
      </div>

      <div className={styles.teamMorale}>
        <div className={styles.moraleItem}>
          <div className={styles.moraleHeader}>
            <span className={styles.moraleLabel}>Team Morale</span>
            <span className={`${styles.moraleValue} ${moraleStatus.class}`}>
              {moraleStatus.label}
            </span>
          </div>

          <div className={styles.moraleBarContainer}>
            <div
              className={`${styles.moraleBar} ${moraleStatus.class}`}
              style={{ width: `${teamStats.averageMorale || 0}%` }}
            ></div>
          </div>
        </div>

        <div className={styles.moraleItem}>
          <div className={styles.moraleHeader}>
            <span className={styles.moraleLabel}>Energy Level</span>
            <span className={`${styles.moraleValue} ${energyStatus.class}`}>
              {energyStatus.label}
            </span>
          </div>

          <div className={styles.moraleBarContainer}>
            <div
              className={`${styles.moraleBar} ${energyStatus.class}`}
              style={{ width: `${teamStats.averageEnergy || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className={styles.skillBreakdown}>
        <h4 className={styles.sectionTitle}>Skills Distribution</h4>

        <div className={styles.skillsGrid}>
          <div className={styles.skillItem}>
            <span className={styles.skillLabel}>Coding</span>
            <div className={styles.skillBarContainer}>
              <div
                className={styles.skillBar}
                style={{
                  width: `${Math.min(
                    100,
                    ((teamStats.coding || 0) / (teamCount * 100)) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className={styles.skillItem}>
            <span className={styles.skillLabel}>Design</span>
            <div className={styles.skillBarContainer}>
              <div
                className={styles.skillBar}
                style={{
                  width: `${Math.min(
                    100,
                    ((teamStats.design || 0) / (teamCount * 100)) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className={styles.skillItem}>
            <span className={styles.skillLabel}>Marketing</span>
            <div className={styles.skillBarContainer}>
              <div
                className={styles.skillBar}
                style={{
                  width: `${Math.min(
                    100,
                    ((teamStats.marketing || 0) / (teamCount * 100)) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className={styles.skillItem}>
            <span className={styles.skillLabel}>Business</span>
            <div className={styles.skillBarContainer}>
              <div
                className={styles.skillBar}
                style={{
                  width: `${Math.min(
                    100,
                    ((teamStats.business || 0) / (teamCount * 100)) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <button className={styles.viewTeamButton} onClick={onViewTeam}>
        Manage Team
      </button>
    </div>
  );
};

export default TeamOverviewWidget;
