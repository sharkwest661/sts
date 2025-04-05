// src/components/game/StartupSelector.jsx
import React, { useState, useEffect } from "react";
import styles from "./StartupSelector.module.scss";
import useGameStore from "../../store/gameStore";
import { motion } from "framer-motion";

// Mock startup ideas data (will be moved to game/data in actual implementation)
const STARTUP_IDEAS = [
  {
    id: "erp-criminal",
    name: "CorruptERP",
    tagline: "Enterprise Resource Planning for criminal organizations.",
    description:
      "Help criminal enterprises manage their resources, personnel, and operations with enterprise-grade software. What could go wrong?",
    marketPotential: 85,
    complexity: 70,
    legalRisk: 95,
    icon: "💼🔫",
  },
  {
    id: "qr-beggar",
    name: "ScanPlease",
    tagline: "QR code app for modern beggars.",
    description:
      "Disrupting the panhandling industry with cutting-edge QR code technology. Join the digital revolution in street-based fundraising!",
    marketPotential: 45,
    complexity: 20,
    legalRisk: 35,
    icon: "📱💸",
  },
  {
    id: "nuclear-gov",
    name: "NukeNow",
    tagline: "Sloppy nuclear mobile app for government.",
    description:
      "A hastily coded mobile app for managing nuclear facilities. Minimum viable product with minimal testing. Government contract guaranteed!",
    marketPotential: 60,
    complexity: 90,
    legalRisk: 100,
    icon: "☢️📱",
  },
  {
    id: "ai-dating",
    name: "AIDate",
    tagline: "AI that swipes and chats on dating apps for you.",
    description:
      "Let our AI handle the tedious parts of online dating. Why talk to potential matches yourself when an AI can do it better?",
    marketPotential: 75,
    complexity: 65,
    legalRisk: 40,
    icon: "❤️🤖",
  },
  {
    id: "blockchain-milk",
    name: "MilkChain",
    tagline: "Blockchain-based milk tracking system.",
    description:
      "Revolutionizing the dairy industry with an immutable ledger for tracking every drop of milk from cow to carton. NFT-backed cow ownership included!",
    marketPotential: 55,
    complexity: 75,
    legalRisk: 25,
    icon: "🥛⛓️",
  },
];

const StartupSelector = ({ onComplete }) => {
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [nameError, setNameError] = useState("");
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Get game state actions
  const selectStartupIdea = useGameStore((state) => state.selectStartupIdea);
  const setCompanyNameAction = useGameStore((state) => state.setCompanyName);

  // Handle idea selection
  const handleSelectIdea = (idea) => {
    setSelectedIdea(idea);
  };

  // Handle company name change
  const handleNameChange = (e) => {
    const name = e.target.value;
    setCompanyName(name);

    // Validate name
    if (name.length > 0 && name.length < 3) {
      setNameError("Company name must be at least 3 characters.");
    } else if (name.length > 30) {
      setNameError("Company name must be less than 30 characters.");
    } else {
      setNameError("");
    }
  };

  // Start the game with selected idea
  const startGame = () => {
    if (!selectedIdea) return;
    if (!companyName || companyName.length < 3) {
      setNameError("Please enter a valid company name.");
      return;
    }

    // Set company name and select startup idea
    setCompanyNameAction(companyName);
    selectStartupIdea(selectedIdea);

    // Call the completion callback
    if (onComplete) onComplete();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className={styles.selectorContainer}>
      <h1 className={styles.title}>Choose Your Startup Idea</h1>
      <p className={styles.subtitle}>
        Select one of these absurd startup concepts to begin your
        entrepreneurial journey.
      </p>

      <motion.div
        className={styles.ideasGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {STARTUP_IDEAS.map((idea) => (
          <motion.div
            key={idea.id}
            className={`${styles.ideaCard} ${
              selectedIdea?.id === idea.id ? styles.selected : ""
            }`}
            onClick={() => handleSelectIdea(idea)}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={styles.ideaIcon}>{idea.icon}</div>
            <h3>{idea.name}</h3>
            <p className={styles.tagline}>{idea.tagline}</p>

            {selectedIdea?.id === idea.id && (
              <motion.div
                className={styles.ideaDetails}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <p>{idea.description}</p>

                <div className={styles.statsGrid}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Market Potential</span>
                    <div className={styles.statBarContainer}>
                      <div
                        className={`${styles.statBar} ${styles.statMarket}`}
                        style={{ width: `${idea.marketPotential}%` }}
                      ></div>
                    </div>
                    <span className={styles.statValue}>
                      {idea.marketPotential}%
                    </span>
                  </div>

                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Complexity</span>
                    <div className={styles.statBarContainer}>
                      <div
                        className={`${styles.statBar} ${styles.statComplexity}`}
                        style={{ width: `${idea.complexity}%` }}
                      ></div>
                    </div>
                    <span className={styles.statValue}>{idea.complexity}%</span>
                  </div>

                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Legal Risk</span>
                    <div className={styles.statBarContainer}>
                      <div
                        className={`${styles.statBar} ${styles.statRisk}`}
                        style={{ width: `${idea.legalRisk}%` }}
                      ></div>
                    </div>
                    <span className={styles.statValue}>{idea.legalRisk}%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}

        <motion.div
          className={`${styles.ideaCard} ${styles.customIdeaCard}`}
          onClick={() => setShowCustomizer(true)}
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={styles.ideaIcon}>✨</div>
          <h3>Custom Idea</h3>
          <p className={styles.tagline}>
            Create your own ridiculous startup concept.
          </p>
          <p className={styles.comingSoon}>(Coming soon in future update)</p>
        </motion.div>
      </motion.div>

      {selectedIdea && (
        <motion.div
          className={styles.companySetup}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2>Name Your Company</h2>

          <div className={styles.nameInputContainer}>
            <input
              type="text"
              value={companyName}
              onChange={handleNameChange}
              placeholder="Enter company name"
              className={styles.nameInput}
              maxLength={30}
            />
            {nameError && <span className={styles.nameError}>{nameError}</span>}
          </div>

          <button
            className={styles.startButton}
            onClick={startGame}
            disabled={!selectedIdea || !companyName || companyName.length < 3}
          >
            Launch Startup
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default StartupSelector;
