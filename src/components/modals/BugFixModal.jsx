// src/components/modals/BugFixModal.jsx
import React, { useState } from "react";
import { useModal } from "../../context/ModalContext";
import { useProductStore } from "../../store";
import DebuggingPuzzle from "../minigames/DebuggingPuzzle";
import styles from "./BugFixModal.module.scss";

const BugFixModal = ({ bug, onComplete }) => {
  const [showMinigame, setShowMinigame] = useState(false);
  const [result, setResult] = useState(null);

  const { closeModal } = useModal();
  const fixBug = useProductStore((state) => state.fixBug);

  // Get bug severity class
  const getSeverityClass = (severity) => {
    switch (severity) {
      case "critical":
        return styles.critical;
      case "high":
        return styles.high;
      case "medium":
        return styles.medium;
      case "low":
        return styles.low;
      default:
        return "";
    }
  };

  // Get difficulty based on bug severity
  const getDifficulty = (severity) => {
    switch (severity) {
      case "critical":
        return "hard";
      case "high":
        return "medium";
      case "low":
        return "easy";
      default:
        return "medium";
    }
  };

  // Handle starting the debugging game
  const handleStartDebugging = () => {
    setShowMinigame(true);
  };

  // Handle completion of the debugging game
  const handleGameComplete = (gameResult) => {
    setResult(gameResult);
    setShowMinigame(false);

    if (gameResult.success) {
      // Fix the bug
      fixBug(bug.id);
    }

    // Notify parent component
    if (onComplete) {
      onComplete({
        ...gameResult,
        bug,
      });
    }
  };

  // Handle canceling the game
  const handleCancelGame = () => {
    setShowMinigame(false);
  };

  // Handle closing the modal
  const handleClose = () => {
    closeModal();
  };

  return (
    <div className={styles.bugFixModal}>
      {showMinigame ? (
        <DebuggingPuzzle
          difficulty={getDifficulty(bug.severity)}
          onComplete={handleGameComplete}
          bugId={bug.id}
          onCancel={handleCancelGame}
        />
      ) : result ? (
        <div className={styles.resultView}>
          <div
            className={`${styles.resultHeader} ${
              result.success ? styles.success : styles.failure
            }`}
          >
            <h3>{result.success ? "Bug Fixed!" : "Debugging Failed"}</h3>
          </div>

          <div className={styles.resultContent}>
            <div className={styles.scoreDisplay}>
              <span className={styles.scoreLabel}>Score:</span>
              <span className={styles.scoreValue}>{result.score}</span>
            </div>

            <p className={styles.resultMessage}>
              {result.success
                ? `You successfully fixed the "${bug.title}" bug. Your code quality has improved!`
                : `You were unable to fix the "${bug.title}" bug. It will continue to affect your product.`}
            </p>

            <div className={styles.impactSection}>
              <h4>Impact:</h4>
              <ul>
                {result.success ? (
                  <>
                    <li>Product quality improved</li>
                    <li>Technical debt reduced</li>
                    <li>Customer satisfaction increased</li>
                  </>
                ) : (
                  <>
                    <li>Bug remains in the system</li>
                    <li>Customer satisfaction may decrease</li>
                    <li>The bug may cause other issues</li>
                  </>
                )}
              </ul>
            </div>

            <button className={styles.continueButton} onClick={handleClose}>
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.bugDetails}>
          <div
            className={`${styles.bugHeader} ${getSeverityClass(bug.severity)}`}
          >
            <div className={styles.bugInfo}>
              <h3 className={styles.bugTitle}>{bug.title}</h3>
              <span className={styles.bugSeverity}>{bug.severity}</span>
            </div>

            <div className={styles.affectedFeature}>
              <span className={styles.featureLabel}>Affects:</span>
              <span className={styles.featureName}>
                {bug.affectedFeature || "Multiple features"}
              </span>
            </div>
          </div>

          <div className={styles.bugDescription}>
            <p>{bug.description}</p>
          </div>

          <div className={styles.impactAnalysis}>
            <h4>Impact Analysis:</h4>
            <ul>
              {bug.severity === "critical" && (
                <>
                  <li>Causes severe user experience issues</li>
                  <li>Prevents core functionality from working</li>
                  <li>High priority fix required</li>
                </>
              )}

              {bug.severity === "high" && (
                <>
                  <li>Significantly impacts user experience</li>
                  <li>Some features may not work correctly</li>
                  <li>Should be fixed soon</li>
                </>
              )}

              {bug.severity === "medium" && (
                <>
                  <li>Moderate impact on user experience</li>
                  <li>Features work but with issues</li>
                  <li>Should be fixed when possible</li>
                </>
              )}

              {bug.severity === "low" && (
                <>
                  <li>Minor impact on user experience</li>
                  <li>Cosmetic or non-critical issue</li>
                  <li>Can be fixed in a future update</li>
                </>
              )}
            </ul>
          </div>

          <div className={styles.debuggingOptions}>
            <button
              className={styles.debugButton}
              onClick={handleStartDebugging}
            >
              Start Debugging
            </button>

            <button className={styles.cancelButton} onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Utility function to open a bug fix modal
export const openBugFixModal = (modalUtils, bug, onComplete) => {
  return modalUtils.openModal({
    title: "Fix Bug",
    size: "medium",
    disableBackdropClose: true,
    content: ({ closeModal }) => (
      <BugFixModal
        bug={bug}
        onComplete={(result) => {
          if (onComplete) onComplete(result);
        }}
      />
    ),
  });
};

export default BugFixModal;
