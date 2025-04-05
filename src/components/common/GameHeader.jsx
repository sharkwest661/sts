// src/components/common/GameHeader.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GameHeader.module.scss";
import { useGameStore } from "../../store";
import {
  Rocket,
  DollarSign,
  Clock,
  PlayCircle,
  PauseCircle,
  Save,
  Moon,
  Sun,
  Settings,
  Menu,
} from "lucide-react";

const GameHeader = ({ toggleTheme, theme }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Get game state using proper selector pattern
  const companyName = useGameStore((state) => state.companyName);
  const cash = useGameStore((state) => state.cash);
  const startupIdea = useGameStore((state) => state.startupIdea);
  const gameTime = useGameStore((state) => state.gameTime);
  const gameSpeed = useGameStore((state) => state.gameSpeed);

  // Get actions
  const setGameSpeed = useGameStore((state) => state.setGameSpeed);
  const saveGame = useGameStore((state) => state.saveGame);

  // Format the game time display
  const formattedTime = useMemo(() => {
    if (!gameTime) return "Day 1 - 00:00";

    const { day, hour, minute } = gameTime;
    return `Day ${day} - ${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  }, [gameTime]);

  // Handle manual save
  const handleSave = () => {
    saveGame();
    // Show notification (would be handled by a notification system)
    alert("Game saved successfully");
  };

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  // Game speed options
  const speedOptions = useMemo(
    () => [
      { value: 0.5, label: "0.5x" },
      { value: 1, label: "1x" },
      { value: 2, label: "2x" },
      { value: 4, label: "4x" },
    ],
    []
  );

  return (
    <header className={styles.header}>
      <div
        className={styles.logoSection}
        onClick={() => navigate("/dashboard")}
      >
        <div className={styles.logo}>
          <Rocket size={24} />
        </div>
        <div className={styles.companyInfo}>
          <h1 className={styles.companyName}>{companyName}</h1>
          <span className={styles.productName}>{startupIdea?.name}</span>
        </div>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>
            <DollarSign size={18} />
          </span>
          <span className={styles.statValue}>${formatNumber(cash)}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statIcon}>
            <Clock size={18} />
          </span>
          <span className={styles.statValue}>{formattedTime}</span>
        </div>

        <div className={styles.speedControls}>
          <button
            className={styles.speedButton}
            onClick={() => setGameSpeed(gameSpeed === 0 ? 1 : 0)}
            aria-label={gameSpeed === 0 ? "Resume game" : "Pause game"}
          >
            {gameSpeed === 0 ? (
              <PlayCircle size={18} />
            ) : (
              <PauseCircle size={18} />
            )}
          </button>

          <div className={styles.speedSelector}>
            {speedOptions.map((option) => (
              <button
                key={option.value}
                className={`${styles.speedOption} ${
                  gameSpeed === option.value ? styles.active : ""
                }`}
                onClick={() => setGameSpeed(option.value)}
                disabled={gameSpeed === 0}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.controlsSection}>
        <button
          className={styles.iconButton}
          onClick={handleSave}
          title="Save Game"
          aria-label="Save game"
        >
          <Save size={18} />
        </button>

        <button
          className={styles.iconButton}
          onClick={toggleTheme}
          title={
            theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
          }
          aria-label={
            theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
          }
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button
          className={styles.iconButton}
          onClick={() => setShowSettings(!showSettings)}
          title="Settings"
          aria-label="Open settings"
        >
          <Settings size={18} />
        </button>

        <button
          className={styles.iconButton}
          onClick={() => setShowMenu(!showMenu)}
          title="Menu"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
      </div>

      {showMenu && (
        <div className={styles.mobileMenu}>
          <button
            onClick={() => {
              navigate("/dashboard");
              setShowMenu(false);
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              navigate("/office");
              setShowMenu(false);
            }}
          >
            Office
          </button>
          <button
            onClick={() => {
              navigate("/team");
              setShowMenu(false);
            }}
          >
            Team
          </button>
          <button
            onClick={() => {
              navigate("/product");
              setShowMenu(false);
            }}
          >
            Product
          </button>
          <button
            onClick={() => {
              navigate("/investors");
              setShowMenu(false);
            }}
          >
            Investors
          </button>
          <button
            onClick={() => {
              navigate("/marketing");
              setShowMenu(false);
            }}
          >
            Marketing
          </button>
        </div>
      )}

      {showSettings && (
        <div className={styles.settingsPanel}>
          <h3>Game Settings</h3>

          <div className={styles.settingItem}>
            <label>Game Speed</label>
            <div className={styles.settingControls}>
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  className={`${styles.speedOption} ${
                    gameSpeed === option.value ? styles.active : ""
                  }`}
                  onClick={() => setGameSpeed(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.settingItem}>
            <label>Theme</label>
            <button className={styles.themeToggle} onClick={toggleTheme}>
              {theme === "light"
                ? "Switch to Dark Mode"
                : "Switch to Light Mode"}
            </button>
          </div>

          <div className={styles.settingActions}>
            <button className={styles.saveButton} onClick={handleSave}>
              Save Game
            </button>

            <button
              className={styles.closeButton}
              onClick={() => setShowSettings(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default GameHeader;
