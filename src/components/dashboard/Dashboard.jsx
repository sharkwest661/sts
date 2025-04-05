// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.scss";
import useGameStore from "../../store/gameStore";
import useTeamStore from "../../store/teamStore";

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

  // Get game state
  const companyName = useGameStore((state) => state.companyName);
  const companyValuation = useGameStore((state) => state.companyValuation);
  const cash = useGameStore((state) => state.cash);
  const revenue = useGameStore((state) => state.revenue);
  const expenses = useGameStore((state) => state.expenses);
  const startupIdea = useGameStore((state) => state.startupIdea);
  const gameTick = useGameStore((state) => state.gameTick);
  const reputation = useGameStore((state) => state.reputation);

  // Get team stats
  const teamStats = useTeamStore((state) => state.getTeamStats());
  const teamMembers = useTeamStore((state) => state.teamMembers);

  // Set time of day based on game tick
  useEffect(() => {
    const gameHours = Math.floor((gameTick / 60) % 24);

    if (gameHours >= 5 && gameHours < 12) {
      setTimeOfDay("morning");
    } else if (gameHours >= 12 && gameHours < 18) {
      setTimeOfDay("afternoon");
    } else {
      setTimeOfDay("evening");
    }
  }, [gameTick]);

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  // Calculate monthly profit/loss
  const monthlyProfitLoss = revenue - expenses;

  // Calculate metrics for display
  const burnRate = expenses > 0 ? (cash / expenses).toFixed(1) : "∞";
  const monthsLabel =
    burnRate === "∞"
      ? "months"
      : monthlyProfitLoss >= 0
      ? "profit/mo"
      : "until broke";

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
          burnRate={burnRate}
          monthlyProfitLoss={monthlyProfitLoss}
          monthsLabel={monthsLabel}
          reputation={reputation}
        />

        <TeamOverviewWidget
          teamStats={teamStats}
          teamCount={teamMembers.length}
          onViewTeam={() => navigate("/team")}
        />

        <ProductStatusWidget
          productName={startupIdea?.name || "Your Product"}
          productStatus={productStatus}
          onViewProduct={() => navigate("/product")}
        />

        <FinancialWidget
          cash={cash}
          revenue={revenue}
          expenses={expenses}
          onViewInvestors={() => navigate("/investors")}
        />

        <NotificationsWidget notifications={recentNotifications} />

        <TasksWidget tasks={pendingTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
