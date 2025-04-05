// src/components/dashboard/widgets/FinancialWidget.jsx
import React from "react";
import styles from "./FinancialWidget.module.scss";

const FinancialWidget = ({ cash, revenue, expenses, onViewInvestors }) => {
  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  // Calculate monthly profit/loss
  const monthlyProfitLoss = revenue - expenses;
  const isProfitable = monthlyProfitLoss >= 0;

  // Mock financial data (would come from actual game state)
  const financialData = [
    { month: "Jan", revenue: 0, expenses: 5000, balance: 15000 },
    { month: "Feb", revenue: 0, expenses: 7500, balance: 7500 },
    { month: "Mar", revenue: 1000, expenses: 8000, balance: 500 },
    { month: "Apr", revenue: 3000, expenses: 8500, balance: -5000 },
    { month: "May", revenue: 5500, expenses: 9000, balance: -8500 },
    { month: "Jun", revenue: 9000, expenses: 9500, balance: -9000 },
    { month: "Jul", revenue: 12000, expenses: 10000, balance: -7000 },
    { month: "Aug", revenue, expenses, balance: cash },
  ];

  // Calculate max value for chart scale
  const maxValue = Math.max(
    ...financialData.map((d) =>
      Math.max(d.revenue, d.expenses, Math.abs(d.balance))
    )
  );

  // Function to get height percentage based on value
  const getBarHeight = (value) => {
    return (Math.abs(value) / maxValue) * 100;
  };

  return (
    <div className={styles.financialWidget}>
      <h3 className={styles.widgetTitle}>Financial Overview</h3>

      <div className={styles.financialStats}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>💰</span>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Current Cash</span>
            <span className={styles.statValue}>${formatNumber(cash)}</span>
          </div>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statIcon}>📈</span>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Monthly Revenue</span>
            <span className={styles.statValue}>${formatNumber(revenue)}</span>
          </div>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statIcon}>📉</span>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Monthly Expenses</span>
            <span className={styles.statValue}>${formatNumber(expenses)}</span>
          </div>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statIcon}>{isProfitable ? "✅" : "⚠️"}</span>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>
              Monthly {isProfitable ? "Profit" : "Loss"}
            </span>
            <span
              className={`${styles.statValue} ${
                isProfitable ? styles.profit : styles.loss
              }`}
            >
              ${formatNumber(Math.abs(monthlyProfitLoss))}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.financialChart}>
        <h4 className={styles.chartTitle}>Financial History</h4>

        <div className={styles.chartContainer}>
          {financialData.map((data, index) => (
            <div key={data.month} className={styles.chartColumn}>
              <div className={styles.barContainer}>
                <div className={styles.barLabels}>
                  <div className={styles.revenueLabel}>
                    {data.revenue > 0 && `$${formatNumber(data.revenue)}`}
                  </div>
                  <div className={styles.expensesLabel}>
                    {data.expenses > 0 && `$${formatNumber(data.expenses)}`}
                  </div>
                  <div className={styles.balanceLabel}>
                    {data.balance !== 0 &&
                      `$${formatNumber(Math.abs(data.balance))}`}
                  </div>
                </div>

                <div className={styles.bars}>
                  <div
                    className={styles.revenueBar}
                    style={{ height: `${getBarHeight(data.revenue)}%` }}
                    title={`Revenue: $${formatNumber(data.revenue)}`}
                  ></div>

                  <div
                    className={styles.expensesBar}
                    style={{ height: `${getBarHeight(data.expenses)}%` }}
                    title={`Expenses: $${formatNumber(data.expenses)}`}
                  ></div>

                  <div
                    className={`${styles.balanceBar} ${
                      data.balance >= 0
                        ? styles.positiveBalance
                        : styles.negativeBalance
                    }`}
                    style={{ height: `${getBarHeight(data.balance)}%` }}
                    title={`Balance: $${formatNumber(data.balance)}`}
                  ></div>
                </div>
              </div>

              <div className={styles.monthLabel}>{data.month}</div>
            </div>
          ))}
        </div>

        <div className={styles.chartLegend}>
          <div className={styles.legendItem}>
            <span
              className={`${styles.legendColor} ${styles.revenueColor}`}
            ></span>
            <span className={styles.legendLabel}>Revenue</span>
          </div>

          <div className={styles.legendItem}>
            <span
              className={`${styles.legendColor} ${styles.expensesColor}`}
            ></span>
            <span className={styles.legendLabel}>Expenses</span>
          </div>

          <div className={styles.legendItem}>
            <span
              className={`${styles.legendColor} ${styles.balanceColor}`}
            ></span>
            <span className={styles.legendLabel}>Balance</span>
          </div>
        </div>
      </div>

      <button className={styles.viewInvestorsButton} onClick={onViewInvestors}>
        Find Investors
      </button>
    </div>
  );
};

export default FinancialWidget;
