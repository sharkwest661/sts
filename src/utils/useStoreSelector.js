// src/utils/useStoreSelector.js
import { useCallback, useRef } from "react";
import { useStore } from "zustand";

/**
 * Custom hook for safely selecting state from a Zustand store
 * Fixes "getSnapshot" warning and prevents infinite rerenders
 *
 * @param {Function} store - Zustand store
 * @param {Function} selector - Selector function that extracts state from the store
 * @param {Function} equalityFn - Optional equality function to determine if values have changed
 * @returns The selected state value
 */
export function useStoreSelector(store, selector, equalityFn = Object.is) {
  // Use useStore directly without additional hooks
  return useStore(
    store,
    // Use callback to ensure stable reference
    useCallback(selector, []),
    // Use equality function to prevent unnecessary updates
    equalityFn
  );
}

/**
 * Custom hook for selecting multiple values from a Zustand store
 *
 * @param {Function} store - Zustand store
 * @param {String[]} keys - Array of state keys to select
 * @returns {Object} Object containing selected state values
 */
export function useStoreKeys(store, keys) {
  const selectorRef = useRef((state) => {
    const result = {};
    keys.forEach((key) => {
      result[key] = state[key];
    });
    return result;
  });

  // Custom equality function that compares each selected key
  const equalityFn = (a, b) => {
    if (a === b) return true;
    if (
      typeof a !== "object" ||
      a === null ||
      typeof b !== "object" ||
      b === null
    ) {
      return false;
    }

    for (const key of keys) {
      if (!Object.is(a[key], b[key])) return false;
    }
    return true;
  };

  return useStore(store, selectorRef.current, equalityFn);
}

/**
 * Custom hook for selecting actions from a Zustand store
 * Prevents unnecessary re-renders by comparing function references
 *
 * @param {Function} store - Zustand store
 * @param {String[]} actionNames - Array of action names to select
 * @returns {Object} Object containing selected actions
 */
export function useStoreActions(store, actionNames) {
  const selectorRef = useRef((state) => {
    const result = {};
    actionNames.forEach((name) => {
      result[name] = state[name];
    });
    return result;
  });

  // Custom equality function that always returns true for functions
  // This prevents re-renders when action references haven't changed
  const equalityFn = (a, b) => {
    if (a === b) return true;
    if (
      typeof a !== "object" ||
      a === null ||
      typeof b !== "object" ||
      b === null
    ) {
      return false;
    }

    for (const key of actionNames) {
      // Functions are considered equal if they're both functions
      // This works because Zustand actions don't change between renders
      const aIsFunc = typeof a[key] === "function";
      const bIsFunc = typeof b[key] === "function";

      if (aIsFunc && bIsFunc) continue;
      if (!Object.is(a[key], b[key])) return false;
    }
    return true;
  };

  return useStore(store, selectorRef.current, equalityFn);
}
