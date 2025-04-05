// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import styles from "./App.module.scss";
import useGameStore from "./store/gameStore";
import useTeamStore from "./store/teamStore";

// Component imports
import StartupSelector from "./components/game/StartupSelector";
import Dashboard from "./components/dashboard/Dashboard";
import OfficeView from "./components/office/OfficeView";
import TeamManagement from "./components/team/TeamManagement";
import ProductDevelopment from "./components/product/ProductDevelopment";
import InvestorRelations from "./components/investors/InvestorRelations";
import MarketingCampaigns from "./components/marketing/MarketingCampaigns";
import GameMenu from "./components/common/GameMenu";
import GameHeader from "./components/common/GameHeader";
import LoadingScreen from "./components/common/LoadingScreen";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  // Get game state
  const gameStarted = useGameStore((state) => state.gameStarted);
  const incrementTick = useGameStore((state) => state.incrementTick);

  // Team actions
  const updateTeamState = useTeamStore((state) => state.updateTeamState);

  // Game tick effect (runs game loop)
  useEffect(() => {
    // Initial loading
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Setup game tick (runs every second)
    let gameTickInterval;

    if (gameStarted && !isLoading) {
      gameTickInterval = setInterval(() => {
        // Increment game tick
        incrementTick();

        // Update team state on each tick
        updateTeamState();

        // Other tick-based updates would go here
      }, 1000);
    }

    // Cleanup on unmount
    return () => {
      clearTimeout(loadingTimeout);
      if (gameTickInterval) clearInterval(gameTickInterval);
    };
  }, [gameStarted, isLoading, incrementTick, updateTeamState]);

  // Theme toggle handler
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  // Initialize theme from localStorage on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`${styles.app} ${styles[theme]}`}>
      <Router>
        {gameStarted ? (
          <>
            <GameHeader toggleTheme={toggleTheme} theme={theme} />
            <div className={styles.gameLayout}>
              <GameMenu />
              <main className={styles.mainContent}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/office" element={<OfficeView />} />
                  <Route path="/team" element={<TeamManagement />} />
                  <Route path="/product" element={<ProductDevelopment />} />
                  <Route path="/investors" element={<InvestorRelations />} />
                  <Route path="/marketing" element={<MarketingCampaigns />} />
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </main>
            </div>
          </>
        ) : (
          <div className={styles.introContainer}>
            <Routes>
              <Route path="/" element={<StartupSelector />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        )}
      </Router>
    </div>
  );
};

export default App;
