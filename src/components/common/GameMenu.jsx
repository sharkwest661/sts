// src/components/common/GameMenu.jsx
import React, { useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { shallow } from "zustand/shallow";
import styles from "./GameMenu.module.scss";
import { useGameStore } from "../../store";
import {
  LayoutDashboard,
  Building2,
  Users,
  Code,
  Banknote,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Flame,
} from "lucide-react";

const GameMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // FIXED: Use proper selectors for individual state values
  // This prevents unnecessary re-renders
  const companyValuation = useGameStore((state) => state.companyValuation);
  const cash = useGameStore((state) => state.cash);
  const revenue = useGameStore((state) => state.revenue);
  const expenses = useGameStore((state) => state.expenses);

  // FIXED: Get teamSize directly from state instead of calling a method
  const teamSize = useGameStore((state) => state.teamSize);

  // Calculate profit/loss without triggering re-renders
  const monthlyProfitLoss = useMemo(
    () => revenue - expenses,
    [revenue, expenses]
  );
  const isProfitable = useMemo(
    () => monthlyProfitLoss >= 0,
    [monthlyProfitLoss]
  );

  // Menu items configuration with Lucide icons
  const menuItems = useMemo(
    () => [
      {
        path: "/dashboard",
        icon: <LayoutDashboard size={18} />,
        label: "Dashboard",
        description: "Overview of your startup",
      },
      {
        path: "/office",
        icon: <Building2 size={18} />,
        label: "Office",
        description: "Manage your workplace",
      },
      {
        path: "/team",
        icon: <Users size={18} />,
        label: "Team",
        description: "Hire and manage employees",
        badge: teamSize > 0 ? teamSize.toString() : null,
      },
      {
        path: "/product",
        icon: <Code size={18} />,
        label: "Product",
        description: "Develop your software",
      },
      {
        path: "/investors",
        icon: <Banknote size={18} />,
        label: "Investors",
        description: "Secure funding",
        // REMOVED: hardcoded notification that might cause unnecessary renders
      },
      {
        path: "/marketing",
        icon: <Megaphone size={18} />,
        label: "Marketing",
        description: "Promote your product",
      },
    ],
    [teamSize]
  );

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  return (
    <nav className={`${styles.menu} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.menuHeader}>
        <button
          className={styles.collapseButton}
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Menu" : "Collapse Menu"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
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
            <span className={styles.summaryLabel}>
              <DollarSign size={12} /> Valuation
            </span>
            <span className={styles.summaryValue}>
              ${formatNumber(companyValuation)}
            </span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>
              <DollarSign size={12} /> Cash
            </span>
            <span className={styles.summaryValue}>${formatNumber(cash)}</span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>
              <TrendingUp size={12} /> Monthly
            </span>
            <span
              className={`${styles.summaryValue} ${
                isProfitable ? styles.profit : styles.loss
              }`}
            >
              {isProfitable ? "+" : ""}${formatNumber(monthlyProfitLoss)}
            </span>
          </div>

          <div className={styles.burnRateBar}>
            <div className={styles.burnRateLabel}>
              <Flame size={12} /> Burn Rate
            </div>
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
