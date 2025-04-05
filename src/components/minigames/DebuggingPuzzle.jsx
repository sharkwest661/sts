// src/components/minigames/DebuggingPuzzle.jsx
import React, { useState, useEffect } from "react";
import styles from "./DebuggingPuzzle.module.scss";

const DebuggingPuzzle = ({
  difficulty = "medium",
  onComplete,
  bugId,
  onCancel,
}) => {
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds time limit
  const [score, setScore] = useState(0);

  // Generate puzzle based on difficulty
  useEffect(() => {
    // Define the grid size based on difficulty
    const sizeMap = {
      easy: 3, // 3x3 grid
      medium: 4, // 4x4 grid
      hard: 5, // 5x5 grid
    };

    const size = sizeMap[difficulty] || 4;

    // Generate tiles with different patterns
    const patterns = [
      { type: "bug", symbol: "🐛", count: Math.ceil(size * size * 0.3) }, // 30% are bugs
      { type: "code", symbol: "💻", count: Math.ceil(size * size * 0.2) }, // 20% are code
      { type: "data", symbol: "📊", count: Math.ceil(size * size * 0.2) }, // 20% are data
      { type: "empty", symbol: "⬜", count: Math.floor(size * size * 0.3) }, // 30% are empty
    ];

    // Create the tiles array
    let allTiles = [];

    patterns.forEach((pattern) => {
      for (let i = 0; i < pattern.count; i++) {
        allTiles.push({
          id: `${pattern.type}-${i}`,
          type: pattern.type,
          symbol: pattern.symbol,
          selected: false,
        });
      }
    });

    // Pad with empty tiles if needed
    while (allTiles.length < size * size) {
      allTiles.push({
        id: `empty-${allTiles.length}`,
        type: "empty",
        symbol: "⬜",
        selected: false,
      });
    }

    // Shuffle the tiles
    allTiles = shuffleArray(allTiles);

    // Create a 2D grid of tiles
    const tilesGrid = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        const index = i * size + j;
        row.push(allTiles[index]);
      }
      tilesGrid.push(row);
    }

    setTiles(tilesGrid);

    // Set time limit based on difficulty
    const timeLimits = {
      easy: 60,
      medium: 45,
      hard: 30,
    };

    setTimeLeft(timeLimits[difficulty] || 45);
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    if (completed || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [completed, timeLeft]);

  // Check for game over
  useEffect(() => {
    if (timeLeft === 0 && !completed) {
      // Time's up - game over
      handleGameOver();
    }
  }, [timeLeft, completed]);

  // Handle tile selection
  const handleTileClick = (rowIndex, colIndex) => {
    if (completed || timeLeft <= 0) return;

    const tile = tiles[rowIndex][colIndex];

    // Toggle selection
    const updatedTiles = [...tiles];
    updatedTiles[rowIndex][colIndex] = {
      ...tile,
      selected: !tile.selected,
    };

    setTiles(updatedTiles);

    // Update selected tiles
    if (!tile.selected) {
      // Adding to selection
      setSelectedTiles([
        ...selectedTiles,
        { ...tile, position: { row: rowIndex, col: colIndex } },
      ]);

      // If it's a bug, increase score
      if (tile.type === "bug") {
        setScore((prevScore) => prevScore + 10);
      } else if (tile.type === "code") {
        // If it's code, decrease score
        setScore((prevScore) => Math.max(0, prevScore - 5));
      }
    } else {
      // Removing from selection
      setSelectedTiles(
        selectedTiles.filter(
          (t) => !(t.position.row === rowIndex && t.position.col === colIndex)
        )
      );

      // Adjust score accordingly
      if (tile.type === "bug") {
        setScore((prevScore) => Math.max(0, prevScore - 10));
      } else if (tile.type === "code") {
        setScore((prevScore) => prevScore + 5);
      }
    }

    // Check if all bugs are selected
    const allBugs = updatedTiles.flat().filter((t) => t.type === "bug");
    const selectedBugs = allBugs.filter((t) => t.selected);

    if (selectedBugs.length === allBugs.length) {
      // All bugs found!
      handleSuccess();
    }
  };

  // Handle successful completion
  const handleSuccess = () => {
    setCompleted(true);

    // Calculate final score based on time left and selections
    const timeBonus = timeLeft * 2;
    const finalScore = score + timeBonus;

    // Notify parent component
    if (onComplete) {
      onComplete({
        success: true,
        score: finalScore,
        bugId,
      });
    }
  };

  // Handle game over
  const handleGameOver = () => {
    // Notify parent component
    if (onComplete) {
      onComplete({
        success: false,
        score: score,
        bugId,
      });
    }
  };

  // Handle giving up / cancelling
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.puzzleContainer}>
      <div className={styles.puzzleHeader}>
        <h3 className={styles.puzzleTitle}>Debug the Code</h3>
        <div className={styles.puzzleStats}>
          <div className={styles.timeLeft}>
            <span className={styles.statLabel}>Time:</span>
            <span
              className={`${styles.statValue} ${
                timeLeft < 10 ? styles.warning : ""
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className={styles.score}>
            <span className={styles.statLabel}>Score:</span>
            <span className={styles.statValue}>{score}</span>
          </div>
        </div>
      </div>

      <div className={styles.puzzleInstructions}>
        Find and select all the bugs (🐛) in the code. Be careful not to select
        too many code blocks (💻) or you'll lose points!
      </div>

      <div className={styles.puzzleGrid}>
        {tiles.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className={styles.puzzleRow}>
            {row.map((tile, colIndex) => (
              <div
                key={`tile-${rowIndex}-${colIndex}`}
                className={`${styles.puzzleTile} ${
                  tile.selected ? styles.selected : ""
                } ${styles[tile.type]}`}
                onClick={() => handleTileClick(rowIndex, colIndex)}
              >
                <span className={styles.tileSymbol}>{tile.symbol}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {completed && (
        <div className={styles.successOverlay}>
          <div className={styles.successMessage}>
            <h3>Bug Fixed!</h3>
            <p>You successfully found all the bugs.</p>
            <div className={styles.finalScore}>
              <span>Final Score: {score + timeLeft * 2}</span>
            </div>
            <button
              className={styles.continueButton}
              onClick={() =>
                onComplete &&
                onComplete({
                  success: true,
                  score: score + timeLeft * 2,
                  bugId,
                })
              }
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {timeLeft === 0 && !completed && (
        <div className={styles.failureOverlay}>
          <div className={styles.failureMessage}>
            <h3>Time's Up!</h3>
            <p>You didn't find all the bugs in time.</p>
            <div className={styles.finalScore}>
              <span>Score: {score}</span>
            </div>
            <button
              className={styles.continueButton}
              onClick={() =>
                onComplete && onComplete({ success: false, score, bugId })
              }
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <div className={styles.puzzleActions}>
        <button className={styles.cancelButton} onClick={handleCancel}>
          Give Up
        </button>
      </div>
    </div>
  );
};

// Helper function to shuffle an array
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default DebuggingPuzzle;
