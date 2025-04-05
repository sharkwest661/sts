// src/components/game/GameInitializer.jsx
import React, { useEffect, useRef } from "react";
import { useGameStore } from "../../store";

/**
 * GameInitializer handles the core game loop and initializes game systems
 * Fixed version with proper cleanup and frame rate limiting
 */
const GameInitializer = () => {
  // Get store methods - IMPORTANT: Use individual selectors, not full state
  const incrementTick = useGameStore((state) => state.incrementTick);
  const gameSpeed = useGameStore((state) => state.gameSpeed);
  const gameStarted = useGameStore((state) => state.gameStarted);

  // Use refs to store the timer and last time to prevent re-renders affecting the loop
  const timerRef = useRef(null);
  const lastTickTimeRef = useRef(Date.now());
  const targetFpsRef = useRef(1); // 1 frame per second default tick rate

  // Initialize game systems - only runs once when gameStarted changes to true
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

  // Set up the game loop - creates a new effect when gameSpeed changes
  useEffect(() => {
    if (!gameStarted) return;

    // Update the target FPS based on game speed
    targetFpsRef.current = gameSpeed;

    // Cancel any existing timer to prevent duplicates
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
    }

    // Game loop function with frame rate control
    const gameLoop = () => {
      const now = Date.now();
      const elapsed = now - lastTickTimeRef.current;
      const targetFrameTime = 1000 / targetFpsRef.current;

      // Only process a tick if enough time has passed and game isn't paused
      if (elapsed >= targetFrameTime && gameSpeed > 0) {
        lastTickTimeRef.current = now - (elapsed % targetFrameTime);

        try {
          // Process game tick
          incrementTick();
        } catch (error) {
          console.error("Error in game loop:", error);
        }
      }

      // Schedule the next frame - store ref for cleanup
      timerRef.current = requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    timerRef.current = requestAnimationFrame(gameLoop);

    // Cleanup function to cancel the animation frame when component unmounts
    // or when gameSpeed/gameStarted changes
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameStarted, gameSpeed, incrementTick]);

  // No UI rendering needed
  return null;
};

export default GameInitializer;
