// src/App.jsx (Fixed Version)
import React, { useState, useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import styles from "./App.module.scss";
import { useGameStore } from "./store";

// Core component imports
import StartupSelector from "./components/game/StartupSelector";
import Dashboard from "./components/dashboard/Dashboard";
import OfficeView from "./components/office/OfficeView";
import TeamManagement from "./components/team/TeamManagement";
import ProductDevelopment from "./components/product/ProductDevelopment";
import InvestorRelations from "./components/investors/InvestorRelations";
import MarketingCampaigns from "./components/marketing/MarketingCampaigns";

// Common component imports
import GameMenu from "./components/common/GameMenu";
import GameHeader from "./components/common/GameHeader";
import LoadingScreen from "./components/common/LoadingScreen";
import NotificationSystem from "./components/common/NotificationSystem";
import GameSettings from "./components/common/GameSettings";

// Game logic imports
import GameInitializer from "./components/game/GameInitializer";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  // Get game state using proper selector pattern
  // FIXED: Use individual selectors to prevent unnecessary rerenders
  const gameStarted = useGameStore((state) => state.gameStarted);

  // Initialize theme from localStorage on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Initial loading with cleanup
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadingTimeout);
  }, []);

  // Theme toggle handler - memoize to prevent recreating on each render
  const toggleTheme = useMemo(() => {
    return () => {
      setTheme((prevTheme) => {
        const newTheme = prevTheme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        return newTheme;
      });
    };
  }, []);

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`${styles.app} ${styles[theme]}`}>
      <Router>
        {/* Game initializer handles core game loop */}
        <GameInitializer />

        {gameStarted ? (
          <>
            <GameHeader toggleTheme={toggleTheme} theme={theme} />
            <div className={styles.gameLayout}>
              <GameMenu />
              <main className={styles.mainContent}>
                <div className={styles.utilityControls}>
                  <GameSettings />
                  <NotificationSystem />
                </div>

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
