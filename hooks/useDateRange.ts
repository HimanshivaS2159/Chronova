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
        // Nothing selected → set start
        if (!prev.start) return { start: date, end: null };
        // Start selected, no end → set end (or reset if same day)
        if (prev.start && !prev.end) {
          if (isSameDay(date, prev.start)) return { start: null, end: null };
          return { start: prev.start, end: date };
        }
        // Both selected → restart
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
