"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DayCell from "./DayCell";
import { buildCalendarDays } from "@/utils/dateHelpers";
import type { DateRange } from "@/hooks/useDateRange";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
  viewDate: Date;
  range: DateRange;
  hoverDate: Date | null;
  onSelect: (date: Date) => void;
  onHover: (date: Date | null) => void;
  direction: number; // -1 prev, 1 next
  isLoading?: boolean;
}

const SkeletonCell = () => (
  <div className="flex items-center justify-center h-10">
    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer bg-[length:200%_100%]" />
  </div>
);

export default function CalendarGrid({
  viewDate,
  range,
  hoverDate,
  onSelect,
  onHover,
  direction,
  isLoading,
}: CalendarGridProps) {
  const days = useMemo(() => buildCalendarDays(viewDate), [viewDate]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      rotateY: dir > 0 ? 8 : -8,
    }),
    center: { x: 0, opacity: 1, rotateY: 0 },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      rotateY: dir > 0 ? -8 : 8,
    }),
  };

  return (
    <div className="w-full">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid with page-flip animation */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={viewDate.toISOString()}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          style={{ perspective: 800 }}
          className="grid grid-cols-7"
        >
          {isLoading
            ? Array.from({ length: 35 }).map((_, i) => <SkeletonCell key={i} />)
            : days.map((day) => (
                <DayCell
                  key={day.date.toISOString()}
                  day={day}
                  range={range}
                  hoverDate={hoverDate}
                  onSelect={onSelect}
                  onHover={onHover}
                />
              ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
