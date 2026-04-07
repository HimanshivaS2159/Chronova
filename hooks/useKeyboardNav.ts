"use client";

import { useEffect, useCallback } from "react";

interface UseKeyboardNavProps {
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

/**
 * Keyboard shortcuts for calendar navigation:
 *   ArrowLeft  → previous month
 *   ArrowRight → next month
 *   t / T      → jump to today
 *   Escape     → clear selection (via onToday reset)
 */
export function useKeyboardNav({ onPrev, onNext, onToday }: UseKeyboardNavProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      // Don't fire when user is typing in an input / textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          onPrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          onNext();
          break;
        case "t":
        case "T":
          e.preventDefault();
          onToday();
          break;
      }
    },
    [onPrev, onNext, onToday]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);
}
