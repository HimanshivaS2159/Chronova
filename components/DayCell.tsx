"use client";

import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { isRangeStart, isRangeEnd, isInRange, isSameDay } from "@/utils/dateHelpers";
import type { CalendarDay } from "@/utils/dateHelpers";
import type { DateRange } from "@/hooks/useDateRange";
import Tooltip from "./Tooltip";

interface DayCellProps {
  day: CalendarDay;
  range: DateRange;
  hoverDate: Date | null;
  onSelect: (date: Date) => void;
  onHover: (date: Date | null) => void;
}

function createRipple(e: React.MouseEvent<HTMLButtonElement>) {
  const btn = e.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const rect = btn.getBoundingClientRect();
  circle.style.cssText = `
    position:absolute;width:${diameter}px;height:${diameter}px;
    left:${e.clientX - rect.left - diameter / 2}px;
    top:${e.clientY - rect.top - diameter / 2}px;
    border-radius:50%;background:rgba(255,255,255,0.4);
    transform:scale(0);animation:ripple 0.6s ease-out forwards;
    pointer-events:none;z-index:10;
  `;
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 700);
}

const DayCell = React.memo(function DayCell({
  day,
  range,
  hoverDate,
  onSelect,
  onHover,
}: DayCellProps) {
  const { date, isCurrentMonth, isToday: todayFlag, isWeekend, holiday } = day;

  // Effective end for hover preview
  const effectiveEnd = range.start && !range.end ? hoverDate : range.end;

  const isStart = isRangeStart(date, range.start, effectiveEnd);
  const isEnd = isRangeEnd(date, range.start, effectiveEnd);
  const inRange = isInRange(date, range.start, effectiveEnd);
  const isSelected = isSameDay(date, range.start ?? new Date(0)) && !range.end;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(e);
      onSelect(date);
    },
    [date, onSelect]
  );

  const dayNum = date.getDate();

  const cellButton = (
    <motion.button
      whileHover={{ scale: 1.1, translateY: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      onMouseEnter={() => onHover(date)}
      onMouseLeave={() => onHover(null)}
      aria-label={`${date.toDateString()}${holiday ? ` — ${holiday}` : ""}`}
      className={cn(
        "relative group w-12 h-12 rounded-xl flex items-center justify-center",
        "text-sm font-semibold transition-all duration-300 select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
        !isCurrentMonth && "text-slate-300 dark:text-slate-600 opacity-40",
        isCurrentMonth && !isStart && !isEnd && !todayFlag && "text-slate-700 dark:text-slate-200",
        isWeekend && isCurrentMonth && !isStart && !isEnd && "text-rose-500/80 dark:text-rose-400/80",
        
        // Today styling
        todayFlag && !isStart && !isEnd &&
          "bg-white dark:bg-slate-800 ring-2 ring-accent-500 text-accent-600 dark:text-accent-400 shadow-glow-indigo",
          
        // Selected / Range Start/End
        (isStart || isEnd || isSelected) &&
          "bg-gradient-to-br from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/30 z-20",
        
        // Hover state for normal days
        isCurrentMonth && !isStart && !isEnd && !isSelected &&
          "hover:bg-white dark:hover:bg-slate-800 hover:shadow-premium-lg hover:z-10"
      )}
    >
      {dayNum}
      
      {/* Holiday Indicator */}
      {holiday && isCurrentMonth && (
        <span
          className={cn(
            "absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
            isStart || isEnd || isSelected ? "bg-white" : "bg-amber-400 shadow-glow-amber"
          )}
        />
      )}
      
      {/* Selection Glow */}
      {(isStart || isEnd || isSelected) && (
        <motion.div
          layoutId="selectionGlow"
          className="absolute inset-0 rounded-xl bg-white/20 blur-sm pointer-events-none"
        />
      )}
    </motion.button>
  );

  return (
    <div
      className={cn(
        "relative flex items-center justify-center h-14 w-full transition-colors duration-300",
        inRange && !isStart && !isEnd && "bg-accent-100/50 dark:bg-accent-900/20",
        isStart && "bg-gradient-to-r from-transparent to-accent-100/50 dark:to-accent-900/20",
        isEnd && "bg-gradient-to-l from-transparent to-accent-100/50 dark:to-accent-900/20",
      )}
    >
      {holiday && isCurrentMonth ? (
        <Tooltip content={holiday}>{cellButton}</Tooltip>
      ) : (
        cellButton
      )}
    </div>
  );
});

export default DayCell;
