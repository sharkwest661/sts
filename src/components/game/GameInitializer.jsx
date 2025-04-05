// src/components/game/GameInitializer.jsx
import React, { useEffect, useRef } from "react";
import { useGameStore } from "../../store";
import useAchievementStore from "../../store/achievementStore";

/**
 * GameInitializer handles the core game loop and initializes game systems
 * Fixed version with proper cleanup and frame rate limiting
 */
const GameInitializer = () => {
  // Get store methods
  const incrementTick = useGameStore((state) => state.incrementTick);
  const gameSpeed = useGameStore((state) => state.gameSpeed);
  const gameStarted = useGameStore((state) => state.gameStarted);
  const checkAchievements = useAchievementStore(
    (state) => state.checkAchievements
  );

  // Use refs to store the timer and last time to prevent re-renders from affecting the loop
  const timerRef = useRef(null);
  const lastTickTimeRef = useRef(Date.now());
  const targetFpsRef = useRef(1); // 1 frame per second default tick rate

  // Initialize game systems
  useEffect(() => {
    if (!gameStarted) return;

    // Initialize stores that need it
    try {
      // Initialize each subsystem with proper error handling
      if (window.teamStore) {
        window.teamStore.getState().generateRecruits();
      }

      if (window.productStore) {
        window.productStore.getState().initializeProduct();
      }

      if (window.investorStore) {
        window.investorStore.getState().initializeInvestors();
      }

      console.log("Game systems initialized");
    } catch (error) {
      console.error("Error initializing game systems:", error);
    }
  }, [gameStarted]);

  // Set up and manage the game loop
  useEffect(() => {
    if (!gameStarted) return;

    // Update the target FPS based on game speed
    targetFpsRef.current = gameSpeed;

    // Game loop function with frame rate control
    const gameLoop = () => {
      const now = Date.now();
      const elapsed = now - lastTickTimeRef.current;
      const targetFrameTime = 1000 / targetFpsRef.current;

      // Only process a tick if enough time has passed
      if (elapsed >= targetFrameTime) {
        lastTickTimeRef.current = now - (elapsed % targetFrameTime);

        try {
          // Process game tick
          incrementTick();

          // Check achievements periodically (not on every tick)
          // This reduces the frequency of cross-store checks
          if (Math.random() < 0.2) {
            // 20% chance per tick
            setTimeout(() => {
              checkAchievements();
            }, 50);
          }
        } catch (error) {
          console.error("Error in game loop:", error);
        }
      }

      // Schedule the next frame
      timerRef.current = requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    timerRef.current = requestAnimationFrame(gameLoop);

    // Cleanup function to cancel the animation frame
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [gameStarted, gameSpeed, incrementTick, checkAchievements]);

  // No UI rendering needed
  return null;
};

export default GameInitializer;
