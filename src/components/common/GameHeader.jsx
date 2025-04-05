// src/components/common/GameHeader.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GameHeader.module.scss";
import useGameStore from "../../store/gameStore";

const GameHeader = ({ toggleTheme, theme }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  // Get game state
  const companyName = useGameStore((state) => state.companyName);
  const cash = useGameStore((state) => state.cash);
  const startupIdea = useGameStore((state) => state.startupIdea);
  const gameTick = useGameStore((state) => state.gameTick);
  const gameSpeed = useGameStore((state) => state.gameSpeed);
  const setGameSpeed = useGameStore((state) => state.setGameSpeed);
  const saveGame = useGameStore((state) => state.saveGame);

  // Calculate game time (each tick = 1 minute)
  useEffect(() => {
    const gameMinutes = gameTick;
    const gameHours = Math.floor(gameMinutes / 60) % 24;
    const gameDays = Math.floor(gameMinutes / (60 * 24)) + 1;

    setCurrentTime(
      `Day ${gameDays} - ${gameHours.toString().padStart(2, "0")}:${(
        gameMinutes % 60
      )
        .toString()
        .padStart(2, "0")}`
    );
  }, [gameTick]);

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
  const speedOptions = [
    { value: 0.5, label: "0.5x" },
    { value: 1, label: "1x" },
    { value: 2, label: "2x" },
    { value: 4, label: "4x" },
  ];

  return (
    <header className={styles.header}>
      <div
        className={styles.logoSection}
        onClick={() => navigate("/dashboard")}
      >
        <div className={styles.logo}>🚀</div>
        <div className={styles.companyInfo}>
          <h1 className={styles.companyName}>{companyName}</h1>
          <span className={styles.productName}>{startupIdea?.name}</span>
        </div>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>💰</span>
          <span className={styles.statValue}>${formatNumber(cash)}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statIcon}>🕒</span>
          <span className={styles.statValue}>{currentTime}</span>
        </div>

        <div className={styles.speedControls}>
          <button
            className={styles.speedButton}
            onClick={() => setGameSpeed(gameSpeed === 0 ? 1 : 0)}
          >
            {gameSpeed === 0 ? "▶️" : "⏸️"}
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
        >
          💾
        </button>

        <button
          className={styles.iconButton}
          onClick={toggleTheme}
          title={
            theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
          }
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <button
          className={styles.iconButton}
          onClick={() => setShowSettings(!showSettings)}
          title="Settings"
        >
          ⚙️
        </button>

        <button
          className={styles.iconButton}
          onClick={() => setShowMenu(!showMenu)}
          title="Menu"
        >
          ☰
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
