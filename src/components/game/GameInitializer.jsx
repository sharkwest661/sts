// src/components/game/GameInitializer.jsx
import React, { useEffect } from "react";
import {
  useGameStore,
  useTeamStore,
  useProductStore,
  useMarketingStore,
  useInvestorStore,
} from "../../store";

// This component doesn't render anything but handles game initialization
const GameInitializer = () => {
  const gameStarted = useGameStore((state) => state.gameStarted);
  const gameTick = useGameStore((state) => state.gameTick);
  const gameSpeed = useGameStore((state) => state.gameSpeed);
  const incrementTick = useGameStore((state) => state.incrementTick);

  // Initialize stores when game starts
  useEffect(() => {
    if (gameStarted && gameTick === 0) {
      console.log("Initializing game stores...");

      // Initialize stores
      useProductStore.getState().initializeProduct();
      useInvestorStore.getState().initializeInvestors();

      // Add initial objectives
      const addObjective = useGameStore.getState().addObjective;

      addObjective({
        title: "Build Your Team",
        description: "Hire at least 3 team members",
        checkCompletion: (state) => state.teamSize >= 3,
        reward: "Reputation Boost",
      });

      addObjective({
        title: "Launch Your Product",
        description: "Complete and launch at least 3 features",
        checkCompletion: () => {
          const features = useProductStore.getState().features;
          return features.filter((f) => f.status === "completed").length >= 3;
        },
        reward: "User Growth",
      });

      addObjective({
        title: "Secure Funding",
        description: "Get an investment of at least $50,000",
        checkCompletion: () => {
          const totalFunding = useInvestorStore.getState().totalFundingRaised;
          return totalFunding >= 50000;
        },
        reward: "Cash Boost",
      });

      // Welcome notification
      useGameStore.getState().addNotification({
        title: "Welcome to Startup Simulator",
        message:
          "Build your team, create a product, and grow your startup from nothing to a successful business!",
        type: "info",
      });
    }
  }, [gameStarted, gameTick]);

  // Game tick effect (runs game loop)
  useEffect(() => {
    let gameTickInterval;

    if (gameStarted && gameSpeed > 0) {
      const tickInterval = 1000 / gameSpeed; // Adjust frequency based on speed

      gameTickInterval = setInterval(() => {
        incrementTick();
      }, tickInterval);
    }

    // Cleanup on unmount
    return () => {
      if (gameTickInterval) clearInterval(gameTickInterval);
    };
  }, [gameStarted, gameSpeed, incrementTick]);

  // No rendering, just initialization logic
  return null;
};

export default GameInitializer;
