// src/components/minigames/InvestorPitchGame.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./InvestorPitchGame.module.scss";

// Pool of buzzwords and their categories
const BUZZWORDS = {
  tech: [
    "AI",
    "Blockchain",
    "Machine Learning",
    "Neural Networks",
    "Cloud Computing",
    "IoT",
    "Big Data",
    "Serverless",
    "Quantum Computing",
    "Microservices",
  ],
  business: [
    "Disruptive",
    "Scalable",
    "Revenue Stream",
    "Market Fit",
    "Monetization",
    "Growth Hacking",
    "ROI",
    "User Acquisition",
    "Retention",
    "Pivot",
  ],
  innovation: [
    "Revolutionary",
    "Game-Changing",
    "Breakthrough",
    "Cutting-Edge",
    "Innovative",
    "Next-Generation",
    "Paradigm Shift",
    "Visionary",
    "Transformative",
    "Pioneering",
  ],
  metrics: [
    "KPI",
    "Conversion Rate",
    "Engagement",
    "DAU/MAU",
    "Churn Rate",
    "Burn Rate",
    "CAC",
    "LTV",
    "Virality",
    "Network Effects",
  ],
};

const InvestorPitchGame = ({
  investorPreferences,
  onComplete,
  onCancel,
  difficulty = "medium",
}) => {
  const [buzzwordCards, setBuzzwordCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [droppedCards, setDroppedCards] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [investorReaction, setInvestorReaction] = useState(null);

  // Default preferences if not provided
  const preferences = investorPreferences || {
    techInterest: 70,
    businessInterest: 60,
    innovationInterest: 40,
    metricsInterest: 50,
    focusAreas: ["tech", "business"],
  };

  // Generate cards based on difficulty
  useEffect(() => {
    // Define number of cards based on difficulty
    const cardCounts = {
      easy: 8,
      medium: 12,
      hard: 16,
    };

    const totalCards = cardCounts[difficulty] || 12;

    // Create a pool of buzzwords weighted by investor preferences
    const weightedPool = [];

    // Add buzzwords from each category based on investor interests
    Object.keys(BUZZWORDS).forEach((category) => {
      const interest = preferences[`${category}Interest`] || 50;
      const count = Math.ceil((interest / 100) * (totalCards / 4));

      // Randomly select buzzwords from the category
      const selectedBuzzwords = [...BUZZWORDS[category]]
        .sort(() => 0.5 - Math.random())
        .slice(0, count);

      // Add to pool with category
      selectedBuzzwords.forEach((word) => {
        weightedPool.push({
          id: `${category}-${word}`,
          text: word,
          category,
        });
      });
    });

    // If we need more cards, add random ones
    while (weightedPool.length < totalCards) {
      const randomCategory =
        Object.keys(BUZZWORDS)[
          Math.floor(Math.random() * Object.keys(BUZZWORDS).length)
        ];
      const randomWord =
        BUZZWORDS[randomCategory][
          Math.floor(Math.random() * BUZZWORDS[randomCategory].length)
        ];

      // Check if this word is already in the pool
      if (!weightedPool.find((item) => item.text === randomWord)) {
        weightedPool.push({
          id: `${randomCategory}-${randomWord}`,
          text: randomWord,
          category: randomCategory,
        });
      }
    }

    // If we have too many cards, trim the pool
    const finalPool = weightedPool.slice(0, totalCards);

    // Set the cards with positions
    setBuzzwordCards(
      finalPool.map((card) => ({
        ...card,
        position: {
          x: Math.random() * 300 - 150,
          y: Math.random() * 200 - 100,
        },
      }))
    );

    // Set time limit based on difficulty
    const timeLimits = {
      easy: 90,
      medium: 60,
      hard: 45,
    };

    setTimeLeft(timeLimits[difficulty] || 60);
  }, [difficulty, preferences]);

  // Timer effect
  useEffect(() => {
    if (completed || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [completed, timeLeft]);

  // Handle time up
  const handleTimeUp = () => {
    // Calculate score based on current selection
    const finalScore = calculateScore();

    // Complete the game
    setCompleted(true);
    setScore(finalScore);

    // Determine investor reaction
    if (finalScore >= 80) {
      setInvestorReaction("excited");
    } else if (finalScore >= 50) {
      setInvestorReaction("interested");
    } else {
      setInvestorReaction("skeptical");
    }
  };

  // Handle card selection
  const handleCardClick = (card) => {
    if (completed || timeLeft <= 0) return;

    // Toggle selection
    if (selectedCards.find((c) => c.id === card.id)) {
      setSelectedCards(selectedCards.filter((c) => c.id !== card.id));
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  };

  // Handle adding card to pitch deck
  const handleAddToPitch = () => {
    if (completed || timeLeft <= 0 || selectedCards.length === 0) return;

    // Move selected cards to dropped area
    setDroppedCards([...droppedCards, ...selectedCards]);

    // Remove selected cards from available cards
    setBuzzwordCards(
      buzzwordCards.filter(
        (card) => !selectedCards.find((c) => c.id === card.id)
      )
    );

    // Clear selection
    setSelectedCards([]);

    // If no more cards, end the game
    if (buzzwordCards.length - selectedCards.length === 0) {
      handlePitchComplete();
    }
  };

  // Handle completing the pitch
  const handlePitchComplete = () => {
    const finalScore = calculateScore();

    // Complete the game
    setCompleted(true);
    setScore(finalScore);

    // Determine investor reaction
    if (finalScore >= 80) {
      setInvestorReaction("excited");
    } else if (finalScore >= 50) {
      setInvestorReaction("interested");
    } else {
      setInvestorReaction("skeptical");
    }
  };

  // Calculate score based on selected cards
  const calculateScore = () => {
    if (droppedCards.length === 0) return 0;

    let score = 0;

    // For each card, calculate points based on investor preferences
    droppedCards.forEach((card) => {
      const categoryInterest = preferences[`${card.category}Interest`] || 50;

      // Base points from category interest (0-20)
      const basePoints = categoryInterest / 5;

      // Bonus if it's in investor focus areas (0-10)
      const focusAreaBonus = preferences.focusAreas.includes(card.category)
        ? 10
        : 0;

      // Add to score
      score += basePoints + focusAreaBonus;
    });

    // Normalize score to 0-100 scale
    const maxPossibleScore = droppedCards.length * 30; // Max 30 points per card
    const normalizedScore = Math.min(100, (score / maxPossibleScore) * 100);

    return Math.round(normalizedScore);
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle continue after game completion
  const handleContinue = () => {
    if (onComplete) {
      onComplete({
        success: score >= 50,
        score: score,
        investorReaction: investorReaction,
      });
    }
  };

  // Get category color class
  const getCategoryColorClass = (category) => {
    switch (category) {
      case "tech":
        return styles.tech;
      case "business":
        return styles.business;
      case "innovation":
        return styles.innovation;
      case "metrics":
        return styles.metrics;
      default:
        return "";
    }
  };

  return (
    <div className={styles.pitchGameContainer}>
      <div className={styles.pitchHeader}>
        <h3 className={styles.pitchTitle}>Investor Pitch</h3>
        <div className={styles.pitchStats}>
          <div className={styles.timeLeft}>
            <span className={styles.statLabel}>Time:</span>
            <span
              className={`${styles.statValue} ${
                timeLeft < 15 ? styles.warning : ""
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className={styles.cardsLeft}>
            <span className={styles.statLabel}>Cards:</span>
            <span className={styles.statValue}>{buzzwordCards.length}</span>
          </div>
        </div>
      </div>

      <div className={styles.pitchInstructions}>
        Select buzzwords that match this investor's interests and add them to
        your pitch deck.
        <div className={styles.investorInterests}>
          <span className={styles.interestLabel}>Investor Preferences:</span>
          <div className={styles.interestBars}>
            <div className={styles.interestItem}>
              <span className={`${styles.interestCategory} ${styles.tech}`}>
                Tech
              </span>
              <div className={styles.interestBarContainer}>
                <div
                  className={styles.interestBar}
                  style={{ width: `${preferences.techInterest}%` }}
                ></div>
              </div>
            </div>

            <div className={styles.interestItem}>
              <span className={`${styles.interestCategory} ${styles.business}`}>
                Business
              </span>
              <div className={styles.interestBarContainer}>
                <div
                  className={styles.interestBar}
                  style={{ width: `${preferences.businessInterest}%` }}
                ></div>
              </div>
            </div>

            <div className={styles.interestItem}>
              <span
                className={`${styles.interestCategory} ${styles.innovation}`}
              >
                Innovation
              </span>
              <div className={styles.interestBarContainer}>
                <div
                  className={styles.interestBar}
                  style={{ width: `${preferences.innovationInterest}%` }}
                ></div>
              </div>
            </div>

            <div className={styles.interestItem}>
              <span className={`${styles.interestCategory} ${styles.metrics}`}>
                Metrics
              </span>
              <div className={styles.interestBarContainer}>
                <div
                  className={styles.interestBar}
                  style={{ width: `${preferences.metricsInterest}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.gameArea}>
        <div className={styles.cardsArea}>
          <AnimatePresence>
            {buzzwordCards.map((card) => (
              <motion.div
                key={card.id}
                className={`${styles.buzzwordCard} ${getCategoryColorClass(
                  card.category
                )} ${
                  selectedCards.find((c) => c.id === card.id)
                    ? styles.selected
                    : ""
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: card.position.x,
                  y: card.position.y,
                  rotate: Math.random() * 10 - 5,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => handleCardClick(card)}
                whileHover={{ scale: 1.1, rotate: 0 }}
              >
                {card.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className={styles.pitchDeckArea}>
          <h4 className={styles.pitchDeckTitle}>Your Pitch Deck</h4>
          <div className={styles.pitchDeckCards}>
            {droppedCards.map((card, index) => (
              <div
                key={card.id}
                className={`${styles.pitchDeckCard} ${getCategoryColorClass(
                  card.category
                )}`}
                style={{
                  top: `${10 + index * 5}%`,
                  left: `${10 + index * 2}%`,
                  zIndex: index + 1,
                }}
              >
                {card.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.pitchActions}>
        <button
          className={styles.addToPitchButton}
          onClick={handleAddToPitch}
          disabled={selectedCards.length === 0 || completed}
        >
          Add to Pitch ({selectedCards.length})
        </button>

        <button
          className={styles.completePitchButton}
          onClick={handlePitchComplete}
          disabled={droppedCards.length === 0 || completed}
        >
          Complete Pitch
        </button>

        <button
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={completed}
        >
          Cancel
        </button>
      </div>

      {completed && (
        <div className={styles.resultOverlay}>
          <div className={styles.resultContent}>
            <h3 className={styles.resultTitle}>
              {investorReaction === "excited"
                ? "Pitch Successful!"
                : investorReaction === "interested"
                ? "Investor Interested"
                : "Investor Skeptical"}
            </h3>

            <div className={styles.investorImage}>
              {investorReaction === "excited"
                ? "😃"
                : investorReaction === "interested"
                ? "🤔"
                : "😕"}
            </div>

            <div className={styles.scoreDisplay}>
              <div className={styles.scoreLabel}>Investor Interest:</div>
              <div className={styles.scoreValue}>{score}%</div>
              <div className={styles.scoreBarContainer}>
                <div
                  className={`${styles.scoreBar} ${
                    score >= 80
                      ? styles.excellent
                      : score >= 50
                      ? styles.good
                      : score >= 30
                      ? styles.fair
                      : styles.poor
                  }`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>

            <p className={styles.resultDescription}>
              {investorReaction === "excited"
                ? "The investor loved your pitch! They are very interested in your startup and will likely make an offer."
                : investorReaction === "interested"
                ? "The investor found your pitch interesting, but needs more convincing before making a decision."
                : "The investor was not impressed by your pitch. You may need to refine your approach."}
            </p>

            <button className={styles.continueButton} onClick={handleContinue}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorPitchGame;
