// src/utils/zustandHelpers.js

/**
 * Helper functions for using Zustand correctly and preventing common issues
 */

import { shallow } from "zustand/shallow";

/**
 * Helper hook to safely select multiple state values from a store
 * Ensures we're following best practices for Zustand to prevent unnecessary re-renders
 *
 * @param {Function} useStore - The Zustand store hook
 * @param {Array} selector - Array of state keys to select
 * @returns {Object} Object containing the selected state values
 *
 * @example
 * // Instead of:
 * // const { value1, value2 } = useMyStore();
 * // Use:
 * const { value1, value2 } = useStoreSelectors(useMyStore, ['value1', 'value2']);
 */
export function useStoreSelectors(useStore, selectors) {
  return useStore((state) => {
    const result = {};
    for (const key of selectors) {
      result[key] = state[key];
    }
    return result;
  }, shallow);
}

/**
 * Helper hook to safely select multiple actions from a store
 * Ensures we're following best practices for Zustand to prevent unnecessary re-renders
 *
 * @param {Function} useStore - The Zustand store hook
 * @param {Array} actionNames - Array of action names to select
 * @returns {Object} Object containing the selected actions
 *
 * @example
 * // Instead of:
 * // const { action1, action2 } = useMyStore();
 * // Use:
 * const { action1, action2 } = useStoreActions(useMyStore, ['action1', 'action2']);
 */
export function useStoreActions(useStore, actionNames) {
  return useStore((state) => {
    const result = {};
    for (const name of actionNames) {
      result[name] = state[name];
    }
    return result;
  }, shallow);
}

/**
 * Helper to safely check if one store needs to update another
 * Helps prevent circular updates between stores
 *
 * @param {Object} source - Source store state
 * @param {Object} target - Target store state
 * @param {Function} condition - Function that determines if update should happen
 * @param {Function} action - Action to perform if condition is true
 */
export function safeStoreUpdate(source, target, condition, action) {
  // Only proceed if both stores exist
  if (!source || !target) return;

  // Check condition with try/catch
  try {
    if (condition(source, target)) {
      action(source, target);
    }
  } catch (error) {
    console.error("Error in cross-store update:", error);
  }
}
