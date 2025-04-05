// src/components/dashboard/widgets/MetricsWidget.jsx
import React from "react";
import styles from "./MetricsWidget.module.scss";

const MetricsWidget = ({
  cash,
  revenue,
  expenses,
  burnRate,
  monthlyProfitLoss,
  monthsLabel,
  reputation,
}) => {
  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  // Determine if profitable
  const isProfitable = monthlyProfitLoss >= 0;

  return (
    <div className={styles.metricsWidget}>
      <h3 className={styles.widgetTitle}>Business Metrics</h3>

      <div className={styles.metricsGrid}>
        <div className={styles.metricItem}>
          <span className={styles.metricIcon}>💰</span>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Cash</span>
            <span className={styles.metricValue}>${formatNumber(cash)}</span>
          </div>
        </div>

        <div className={styles.metricItem}>
          <span className={styles.metricIcon}>📈</span>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Revenue</span>
            <span className={styles.metricValue}>
              ${formatNumber(revenue)}/mo
            </span>
          </div>
        </div>

        <div className={styles.metricItem}>
          <span className={styles.metricIcon}>📉</span>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Expenses</span>
            <span className={styles.metricValue}>
              ${formatNumber(expenses)}/mo
            </span>
          </div>
        </div>

        <div className={styles.metricItem}>
          <span className={styles.metricIcon}>⏱️</span>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Runway</span>
            <span className={styles.metricValue}>
              {burnRate} {monthsLabel}
            </span>
          </div>
        </div>

        <div className={styles.metricItem}>
          <span className={styles.metricIcon}>
            {isProfitable ? "✅" : "⚠️"}
          </span>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>
              {isProfitable ? "Profit" : "Loss"}
            </span>
            <span
              className={`${styles.metricValue} ${
                isProfitable ? styles.positive : styles.negative
              }`}
            >
              {isProfitable ? "+" : ""}
              {formatNumber(monthlyProfitLoss)}/mo
            </span>
          </div>
        </div>
      </div>

      <div className={styles.reputationSection}>
        <h4 className={styles.sectionTitle}>Reputation</h4>
        <div className={styles.reputationGrid}>
          <div className={styles.reputationItem}>
            <span className={styles.reputationLabel}>Industry</span>
            <div className={styles.reputationBarContainer}>
              <div
                className={styles.reputationBar}
                style={{ width: `${reputation.industry}%` }}
              ></div>
            </div>
            <span className={styles.reputationValue}>
              {reputation.industry}%
            </span>
          </div>

          <div className={styles.reputationItem}>
            <span className={styles.reputationLabel}>Employer</span>
            <div className={styles.reputationBarContainer}>
              <div
                className={styles.reputationBar}
                style={{ width: `${reputation.employer}%` }}
              ></div>
            </div>
            <span className={styles.reputationValue}>
              {reputation.employer}%
            </span>
          </div>

          <div className={styles.reputationItem}>
            <span className={styles.reputationLabel}>Customer</span>
            <div className={styles.reputationBarContainer}>
              <div
                className={styles.reputationBar}
                style={{ width: `${reputation.customer}%` }}
              ></div>
            </div>
            <span className={styles.reputationValue}>
              {reputation.customer}%
            </span>
          </div>
        </div>
      </div>

      <div className={styles.burnRateIndicator}>
        <span className={styles.burnRateLabel}>Burn Rate:</span>
        <div className={styles.burnRateTrack}>
          <div
            className={`${styles.burnRateFill} ${
              isProfitable ? styles.profitable : ""
            }`}
            style={{
              width: `${Math.min(
                100,
                Math.max(0, (expenses / (revenue || 1)) * 100)
              )}%`,
            }}
          ></div>
        </div>
        <span className={styles.burnRateValue}>
          {formatNumber(expenses)}/${formatNumber(revenue)}
        </span>
      </div>
    </div>
  );
};

export default MetricsWidget;
