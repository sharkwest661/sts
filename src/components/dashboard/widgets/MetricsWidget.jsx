// src/components/dashboard/widgets/MetricsWidget.jsx
import React from "react";
import styles from "./MetricsWidget.module.scss";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Clock,
  Award,
  Users,
  ThumbsUp,
} from "lucide-react";

const MetricsWidget = ({
  cash,
  revenue,
  expenses,
  burnRate,
  monthlyProfitLoss,
  monthsLabel,
  reputation,
}) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: amount >= 1000000 ? "compact" : "standard",
      maximumFractionDigits: amount >= 1000000 ? 1 : 0,
    }).format(amount);
  };

  // Check if profit or loss
  const isProfitable = monthlyProfitLoss >= 0;

  return (
    <div className={styles.metricsWidget}>
      <div className={styles.widgetHeader}>
        <h2 className={styles.widgetTitle}>
          <TrendingUp size={18} className={styles.titleIcon} />
          Key Metrics
        </h2>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <DollarSign size={18} />
          </div>
          <div className={styles.metricContent}>
            <h3 className={styles.metricTitle}>Cash Balance</h3>
            <p className={styles.metricValue}>{formatCurrency(cash)}</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <CreditCard size={18} />
          </div>
          <div className={styles.metricContent}>
            <h3 className={styles.metricTitle}>
              Monthly {isProfitable ? "Profit" : "Loss"}
            </h3>
            <p
              className={`${styles.metricValue} ${
                isProfitable ? styles.positive : styles.negative
              }`}
            >
              {isProfitable ? "+" : ""}
              {formatCurrency(monthlyProfitLoss)}
            </p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <Clock size={18} />
          </div>
          <div className={styles.metricContent}>
            <h3 className={styles.metricTitle}>Runway</h3>
            <p className={styles.metricValue}>
              {burnRate}{" "}
              <span className={styles.metricUnit}>{monthsLabel}</span>
            </p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <Award size={18} />
          </div>
          <div className={styles.metricContent}>
            <h3 className={styles.metricTitle}>Industry Rep</h3>
            <div className={styles.reputationBar}>
              <div
                className={styles.reputationFill}
                style={{ width: `${reputation.industry}%` }}
              ></div>
            </div>
            <p className={styles.metricSmallValue}>{reputation.industry}/100</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <Users size={18} />
          </div>
          <div className={styles.metricContent}>
            <h3 className={styles.metricTitle}>Employer Rep</h3>
            <div className={styles.reputationBar}>
              <div
                className={styles.reputationFill}
                style={{ width: `${reputation.employer}%` }}
              ></div>
            </div>
            <p className={styles.metricSmallValue}>{reputation.employer}/100</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <ThumbsUp size={18} />
          </div>
          <div className={styles.metricContent}>
            <h3 className={styles.metricTitle}>Customer Rep</h3>
            <div className={styles.reputationBar}>
              <div
                className={styles.reputationFill}
                style={{ width: `${reputation.customer}%` }}
              ></div>
            </div>
            <p className={styles.metricSmallValue}>{reputation.customer}/100</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MetricsWidget);
