// src/components/common/LoadingScreen.jsx
import React, { useState, useEffect } from "react";
import styles from "./LoadingScreen.module.scss";

// Random satirical startup loading messages
const LOADING_MESSAGES = [
  "Disrupting traditional loading screens...",
  "Pivoting to a mobile-first strategy...",
  "Securing Series A funding for this loading screen...",
  "Calculating burn rate...",
  "Optimizing for blockchain integration...",
  "Leveraging AI to enhance user experience...",
  "Implementing agile methodology...",
  "Ideating outside the box...",
  "Synergizing cross-platform solutions...",
  "Creating a minimum viable product...",
  "Iterating on user feedback...",
  "Scaling vertical solutions horizontally...",
  "Running growth hacking algorithms...",
  "Onboarding unpaid interns...",
  "Analyzing market fit metrics...",
  "Evangelizing our proprietary technology...",
  "Maximizing stakeholder value...",
  "Monetizing user engagement...",
];

const LoadingScreen = () => {
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Choose random message
    setMessage(
      LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
    );

    // Animate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15;

        // When close to completion, slow down to create anticipation
        if (next > 85) {
          return prev + Math.random() * 3;
        }

        return next > 100 ? 100 : next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Update message periodically
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessage(
        LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
      );
    }, 3000);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className={styles.loadingScreen}>
      <div className={styles.loadingContent}>
        <div className={styles.loadingLogo}>🚀</div>
        <h1 className={styles.loadingTitle}>Startup Simulator</h1>

        <div className={styles.loadingBarContainer}>
          <div
            className={styles.loadingBar}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className={styles.loadingMessage}>{message}</div>
      </div>

      <div className={styles.loadingFooter}>
        <div className={styles.buzzwordContainer}>
          {[
            "AI",
            "Blockchain",
            "Cloud",
            "Disruptive",
            "Synergy",
            "IoT",
            "Big Data",
            "ML",
          ].map((word, index) => (
            <span
              key={word}
              className={styles.buzzword}
              style={{
                animationDelay: `${index * 0.5}s`,
                opacity: Math.random() * 0.5 + 0.5,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
