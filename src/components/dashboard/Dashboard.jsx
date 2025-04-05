// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { shallow } from "zustand/shallow";
import styles from "./Dashboard.module.scss";
import { useGameStore } from "../../store";
import useTeamStore from "../../store/teamStore";

// Import Lucide icons
import {
  Clock,
  TrendingUp,
  Users,
  Code,
  DollarSign,
  Bell,
  CheckSquare,
} from "lucide-react";

// Dashboard widgets
import MetricsWidget from "./widgets/MetricsWidget";
import TeamOverviewWidget from "./widgets/TeamOverviewWidget";
import ProductStatusWidget from "./widgets/ProductStatusWidget";
import FinancialWidget from "./widgets/FinancialWidget";
import NotificationsWidget from "./widgets/NotificationsWidget";
import TasksWidget from "./widgets/TasksWidget";

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeOfDay, setTimeOfDay] = useState("morning");

  // Get game state - use proper selector pattern
  const gameState = useGameStore(
    (state) => ({
      companyName: state.companyName,
      companyValuation: state.companyValuation,
      cash: state.cash,
      revenue: state.revenue,
      expenses: state.expenses,
      startupIdea: state.startupIdea,
      reputation: state.reputation,
      gameTime: state.gameTime,
    }),
    shallow
  );

  // FIXED: Don't use method calls in selectors, get raw data instead
  const teamMembers = useTeamStore((state) => state.teamMembers);

  // FIXED: Calculate team stats locally instead of calling the method
  const teamStats = useMemo(() => {
    if (!teamMembers || teamMembers.length === 0) {
      return {
        coding: 0,
        design: 0,
        marketing: 0,
        business: 0,
        totalSalary: 0,
        headcount: 0,
        averageMorale: 0,
        averageEnergy: 0,
      };
    }

    // Calculate team stats from team members
    return teamMembers.reduce(
      (stats, member) => {
        // Factor in morale and energy to productivity
        const productivityMultiplier =
          (member.morale / 100) * (member.energy / 100);

        return {
          coding:
            stats.coding +
            (member.skills?.coding || 0) * productivityMultiplier,
          design:
            stats.design +
            (member.skills?.design || 0) * productivityMultiplier,
          marketing:
            stats.marketing +
            (member.skills?.marketing || 0) * productivityMultiplier,
          business:
            stats.business +
            (member.skills?.business || 0) * productivityMultiplier,
          totalSalary: stats.totalSalary + (member.salary || 0),
          headcount: stats.headcount + 1,
          averageMorale:
            (stats.averageMorale * stats.headcount + member.morale) /
            (stats.headcount + 1),
          averageEnergy:
            (stats.averageEnergy * stats.headcount + member.energy) /
            (stats.headcount + 1),
        };
      },
      {
        coding: 0,
        design: 0,
        marketing: 0,
        business: 0,
        totalSalary: 0,
        headcount: 0,
        averageMorale: 0,
        averageEnergy: 0,
      }
    );
  }, [teamMembers]);

  // Set time of day based on game time
  useEffect(() => {
    if (!gameState.gameTime) return;

    const { hour } = gameState.gameTime;

    if (hour >= 5 && hour < 12) {
      setTimeOfDay("morning");
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDay("afternoon");
    } else {
      setTimeOfDay("evening");
    }
  }, [gameState.gameTime]);

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  // Calculate metrics using useMemo to prevent recalculations
  const metrics = useMemo(() => {
    // Calculate monthly profit/loss
    const monthlyProfitLoss = gameState.revenue - gameState.expenses;

    // Calculate burn rate
    const burnRate =
      gameState.expenses > 0
        ? (gameState.cash / gameState.expenses).toFixed(1)
        : "∞";

    const monthsLabel =
      burnRate === "∞"
        ? "months"
        : monthlyProfitLoss >= 0
        ? "profit/mo"
        : "until broke";

    return {
      monthlyProfitLoss,
      burnRate,
      monthsLabel,
    };
  }, [gameState.revenue, gameState.expenses, gameState.cash]);

  // Mock data for widgets that would normally come from their respective stores
  const productStatus = {
    currentVersion: "0.2",
    features: 4,
    bugs: 7,
    development: 68, // percentage complete
    nextRelease: "in 3 days",
  };

  const recentNotifications = [
    {
      id: 1,
      type: "investor",
      message: 'VC firm "Money Burner Capital" is interested in your startup',
      time: "2h ago",
    },
    {
      id: 2,
      type: "team",
      message: "Developer Jane is feeling overworked",
      time: "5h ago",
    },
    {
      id: 3,
      type: "product",
      message: "Critical bug reported in production",
      time: "1d ago",
    },
  ];

  const pendingTasks = [
    { id: 1, title: "Hire a designer", priority: "high", deadline: "2d" },
    {
      id: 2,
      title: "Fix payment system bug",
      priority: "critical",
      deadline: "1d",
    },
    {
      id: 3,
      title: "Prepare investor pitch",
      priority: "medium",
      deadline: "5d",
    },
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <div className={styles.greeting}>
          <h1>Good {timeOfDay}, CEO</h1>
          <p className={styles.headerTagline}>
            Here's the current status of{" "}
            <span className={styles.companyHighlight}>
              {gameState.companyName}
            </span>
          </p>
        </div>

        <div className={styles.valuationDisplay}>
          <span className={styles.valuationLabel}>Company Valuation</span>
          <span className={styles.valuationAmount}>
            ${formatNumber(gameState.companyValuation)}
          </span>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        <MetricsWidget
          cash={gameState.cash}
          revenue={gameState.revenue}
          expenses={gameState.expenses}
          burnRate={metrics.burnRate}
          monthlyProfitLoss={metrics.monthlyProfitLoss}
          monthsLabel={metrics.monthsLabel}
          reputation={gameState.reputation}
        />

        <TeamOverviewWidget
          teamStats={teamStats}
          teamCount={teamMembers.length}
          onViewTeam={() => navigate("/team")}
        />

        <ProductStatusWidget
          productName={gameState.startupIdea?.name || "Your Product"}
          productStatus={productStatus}
          onViewProduct={() => navigate("/product")}
        />

        <FinancialWidget
          cash={gameState.cash}
          revenue={gameState.revenue}
          expenses={gameState.expenses}
          onViewInvestors={() => navigate("/investors")}
        />

        <NotificationsWidget notifications={recentNotifications} />

        <TasksWidget tasks={pendingTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
