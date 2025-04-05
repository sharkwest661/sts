// src/components/common/GameSettings.jsx
import React, { useState } from "react";
import styles from "./GameSettings.module.scss";
import { useGameStore } from "../../store";

const GameSettings = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Get game state
  const gameSpeed = useGameStore((state) => state.gameSpeed);
  const setGameSpeed = useGameStore((state) => state.setGameSpeed);
  const cash = useGameStore((state) => state.cash);
  const companyName = useGameStore((state) => state.companyName);
  const saveGame = useGameStore((state) => state.saveGame);
  const resetGame = useGameStore((state) => state.resetGame);

  // Get game time
  const gameTime = useGameStore((state) => state.gameTime);

  // Format game time for display
  const formatGameTime = () => {
    const day = gameTime.day;
    const hour = gameTime.hour.toString().padStart(2, "0");
    const minute = gameTime.minute.toString().padStart(2, "0");

    return `Day ${day} - ${hour}:${minute}`;
  };

  // Speed options
  const speedOptions = [
    { value: 0, label: "Pause" },
    { value: 0.5, label: "0.5x" },
    { value: 1, label: "1x" },
    { value: 2, label: "2x" },
    { value: 4, label: "4x" },
  ];

  // Handle save game
  const handleSave = () => {
    saveGame();
    // Show a notification or feedback that the game was saved
    alert("Game saved successfully!");
  };

  // Handle reset game with confirmation
  const handleResetGame = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the game? All progress will be lost!"
      )
    ) {
      resetGame();
      window.location.reload(); // Reload the page to fully reset
    }
  };

  return (
    <div className={styles.settingsContainer}>
      {/* Game time and settings toggle */}
      <div
        className={styles.gameTimeDisplay}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.timeIcon}>🕒</div>
        <div className={styles.timeInfo}>
          <span className={styles.timeValue}>{formatGameTime()}</span>
          <div className={styles.speedControls}>
            <div className={styles.currentSpeed}>
              <span className={styles.speedLabel}>Speed:</span>
              <span className={styles.speedValue}>
                {gameSpeed === 0 ? "Paused" : `${gameSpeed}x`}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.toggleIcon}>{isOpen ? "▲" : "▼"}</div>
      </div>

      {/* Settings panel */}
      {isOpen && (
        <div className={styles.settingsPanel}>
          <div className={styles.settingsGroup}>
            <h3 className={styles.settingsTitle}>Game Speed</h3>
            <div className={styles.speedButtons}>
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  className={`${styles.speedButton} ${
                    gameSpeed === option.value ? styles.active : ""
                  }`}
                  onClick={() => setGameSpeed(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.settingsGroup}>
            <h3 className={styles.settingsTitle}>Game Info</h3>
            <div className={styles.gameInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Company:</span>
                <span className={styles.infoValue}>{companyName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Cash:</span>
                <span className={styles.infoValue}>
                  ${cash.toLocaleString()}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Game Time:</span>
                <span className={styles.infoValue}>{formatGameTime()}</span>
              </div>
            </div>
          </div>

          <div className={styles.settingsActions}>
            <button className={styles.actionButton} onClick={handleSave}>
              💾 Save Game
            </button>

            <button
              className={`${styles.actionButton} ${styles.warningButton}`}
              onClick={handleResetGame}
            >
              🔄 Reset Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSettings;
