// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

  // FIXED: Use individual selectors instead of destructuring to prevent infinite updates
  const companyName = useGameStore((state) => state.companyName);
  const companyValuation = useGameStore((state) => state.companyValuation);
  const cash = useGameStore((state) => state.cash);
  const revenue = useGameStore((state) => state.revenue);
  const expenses = useGameStore((state) => state.expenses);
  const startupIdea = useGameStore((state) => state.startupIdea);
  const reputation = useGameStore((state) => state.reputation);
  const gameTime = useGameStore((state) => state.gameTime);

  // FIXED: Get raw team members data instead of calling methods in render
  const teamMembers = useTeamStore((state) => state.teamMembers);

  // FIXED: Calculate team stats locally with useMemo instead of calling the method
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
    if (!gameTime) return;

    const { hour } = gameTime;

    if (hour >= 5 && hour < 12) {
      setTimeOfDay("morning");
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDay("afternoon");
    } else {
      setTimeOfDay("evening");
    }
  }, [gameTime]);

  // Format large numbers with commas - memoize to prevent recreation
  const formatNumber = useMemo(() => {
    return (num) => {
      return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
    };
  }, []);

  // Calculate metrics using useMemo to prevent recalculations
  const metrics = useMemo(() => {
    // Calculate monthly profit/loss
    const monthlyProfitLoss = revenue - expenses;

    // Calculate burn rate
    const burnRate = expenses > 0 ? (cash / expenses).toFixed(1) : "∞";

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
  }, [revenue, expenses, cash]);

  // Mock data for widgets that would normally come from their respective stores
  // FIXED: Use useMemo to prevent recreating these objects on every render
  const productStatus = useMemo(
    () => ({
      currentVersion: "0.2",
      features: 4,
      bugs: 7,
      development: 68, // percentage complete
      nextRelease: "in 3 days",
    }),
    []
  );

  const recentNotifications = useMemo(
    () => [
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
    ],
    []
  );

  const pendingTasks = useMemo(
    () => [
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
    ],
    []
  );

  // FIXED: Memoize navigation handlers to prevent recreating function references
  const handleNavigateToTeam = useMemo(
    () => () => navigate("/team"),
    [navigate]
  );
  const handleNavigateToProduct = useMemo(
    () => () => navigate("/product"),
    [navigate]
  );
  const handleNavigateToInvestors = useMemo(
    () => () => navigate("/investors"),
    [navigate]
  );

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <div className={styles.greeting}>
          <h1>Good {timeOfDay}, CEO</h1>
          <p className={styles.headerTagline}>
            Here's the current status of{" "}
            <span className={styles.companyHighlight}>{companyName}</span>
          </p>
        </div>

        <div className={styles.valuationDisplay}>
          <span className={styles.valuationLabel}>Company Valuation</span>
          <span className={styles.valuationAmount}>
            ${formatNumber(companyValuation)}
          </span>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        <MetricsWidget
          cash={cash}
          revenue={revenue}
          expenses={expenses}
          burnRate={metrics.burnRate}
          monthlyProfitLoss={metrics.monthlyProfitLoss}
          monthsLabel={metrics.monthsLabel}
          reputation={reputation}
        />

        <TeamOverviewWidget
          teamStats={teamStats}
          teamCount={teamMembers.length}
          onViewTeam={handleNavigateToTeam}
        />

        <ProductStatusWidget
          productName={startupIdea?.name || "Your Product"}
          productStatus={productStatus}
          onViewProduct={handleNavigateToProduct}
        />

        <FinancialWidget
          cash={cash}
          revenue={revenue}
          expenses={expenses}
          onViewInvestors={handleNavigateToInvestors}
        />

        <NotificationsWidget notifications={recentNotifications} />

        <TasksWidget tasks={pendingTasks} />
      </div>
    </div>
  );
};

// FIXED: Use React.memo to prevent unnecessary re-renders
export default React.memo(Dashboard);
