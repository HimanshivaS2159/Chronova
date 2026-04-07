"use client";

import { useState, useCallback } from "react";
import { isSameDay } from "@/utils/dateHelpers";

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export function useDateRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const selectDate = useCallback(
    (date: Date) => {
      setRange((prev) => {
        // 1. Nothing selected or both selected (start new cycle)
        if (!prev.start || (prev.start && prev.end)) {
          return { start: date, end: null };
        }
        
        // 2. Start selected, no end (set end or reset if 3rd state)
        if (prev.start && !prev.end) {
          // If clicking same day as start, reset (optional but good for UX)
          if (isSameDay(date, prev.start)) return { start: null, end: null };
          
          // Ensure start is before end
          if (date < prev.start) {
            return { start: date, end: prev.start };
          }
          return { start: prev.start, end: date };
        }

        return { start: date, end: null };
      });
    },
    []
  );

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
    setHoverDate(null);
  }, []);

  return { range, hoverDate, setHoverDate, selectDate, clearRange };
}
