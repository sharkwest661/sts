// src/components/common/GameMenu.jsx
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./GameMenu.module.scss";
import useGameStore from "../../store/gameStore";
import useTeamStore from "../../store/teamStore";

const GameMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Get necessary game state
  const companyValuation = useGameStore((state) => state.companyValuation);
  const cash = useGameStore((state) => state.cash);
  const revenue = useGameStore((state) => state.revenue);
  const expenses = useGameStore((state) => state.expenses);

  // Get team stats
  const teamStats = useTeamStore((state) => state.getTeamStats());

  // Menu items configuration
  const menuItems = [
    {
      path: "/dashboard",
      icon: "📊",
      label: "Dashboard",
      description: "Overview of your startup",
    },
    {
      path: "/office",
      icon: "🏢",
      label: "Office",
      description: "Manage your workplace",
    },
    {
      path: "/team",
      icon: "👥",
      label: "Team",
      description: "Hire and manage employees",
      badge: teamStats.headcount.toString(),
    },
    {
      path: "/product",
      icon: "💻",
      label: "Product",
      description: "Develop your software",
    },
    {
      path: "/investors",
      icon: "💰",
      label: "Investors",
      description: "Secure funding",
      notification: "New investor interest!",
    },
    {
      path: "/marketing",
      icon: "📣",
      label: "Marketing",
      description: "Promote your product",
    },
  ];

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  // Calculate monthly profit/loss
  const monthlyProfitLoss = revenue - expenses;
  const isProfitable = monthlyProfitLoss >= 0;

  return (
    <nav className={`${styles.menu} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.menuHeader}>
        <button
          className={styles.collapseButton}
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Menu" : "Collapse Menu"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <div className={styles.menuItems}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }
            title={collapsed ? item.label : ""}
          >
            <span className={styles.menuIcon}>{item.icon}</span>

            {!collapsed && (
              <div className={styles.menuContent}>
                <div className={styles.menuLabelRow}>
                  <span className={styles.menuLabel}>{item.label}</span>
                  {item.badge && (
                    <span className={styles.menuBadge}>{item.badge}</span>
                  )}
                </div>
                <span className={styles.menuDescription}>
                  {item.description}
                </span>
              </div>
            )}

            {!collapsed && item.notification && (
              <div className={styles.menuNotification}>
                <span className={styles.notificationDot}></span>
                {item.notification}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {!collapsed && (
        <div className={styles.financialSummary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Valuation</span>
            <span className={styles.summaryValue}>
              ${formatNumber(companyValuation)}
            </span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Cash</span>
            <span className={styles.summaryValue}>${formatNumber(cash)}</span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Monthly</span>
            <span
              className={`${styles.summaryValue} ${
                isProfitable ? styles.profit : styles.loss
              }`}
            >
              {isProfitable ? "+" : ""}
              {formatNumber(monthlyProfitLoss)}
            </span>
          </div>

          <div className={styles.burnRateBar}>
            <div className={styles.burnRateLabel}>Burn Rate</div>
            <div className={styles.burnRateTrack}>
              <div
                className={styles.burnRateFill}
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, (expenses / (revenue || 1)) * 100)
                  )}%`,
                  backgroundColor: isProfitable
                    ? "var(--color-success)"
                    : "var(--color-error)",
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default GameMenu;
