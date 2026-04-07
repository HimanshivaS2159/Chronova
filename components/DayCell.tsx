"use client";

import React, { useCallback } from "react";
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
    border-radius:50%;background:rgba(99,102,241,0.35);
    transform:scale(0);animation:ripple 0.6s ease-out forwards;
    pointer-events:none;
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
    <button
      onClick={handleClick}
      onMouseEnter={() => onHover(date)}
      onMouseLeave={() => onHover(null)}
      aria-label={`${date.toDateString()}${holiday ? ` — ${holiday}` : ""}`}
      aria-pressed={isStart || isEnd}
      className={cn(
        "relative overflow-hidden w-9 h-9 rounded-full flex items-center justify-center",
        "text-sm font-medium transition-all duration-200 ease-out select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        !isCurrentMonth && "text-slate-300 dark:text-slate-600",
        isCurrentMonth && !isStart && !isEnd && !todayFlag && "text-slate-700 dark:text-slate-200",
        isWeekend && isCurrentMonth && !isStart && !isEnd && "text-rose-500 dark:text-rose-400",
        todayFlag && !isStart && !isEnd &&
          "ring-2 ring-indigo-400 dark:ring-indigo-500 text-indigo-600 dark:text-indigo-300 font-bold animate-[todayPulse_2s_ease-in-out_infinite]",
        (isStart || isEnd) &&
          "bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-600 text-white shadow-day-hover scale-105",
        isSelected && "bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-600 text-white shadow-day-hover",
        isCurrentMonth &&
          !isStart &&
          !isEnd &&
          "hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:scale-110 hover:shadow-day"
      )}
    >
      {dayNum}
      {holiday && isCurrentMonth && (
        <span
          className={cn(
            "absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
            isStart || isEnd ? "bg-white" : "bg-amber-400"
          )}
        />
      )}
    </button>
  );

  return (
    <div
      className={cn(
        "relative flex items-center justify-center h-10",
        inRange && !isStart && !isEnd && "bg-indigo-100/70 dark:bg-indigo-900/30",
        isStart && "rounded-l-full",
        isEnd && "rounded-r-full",
        (isStart || isEnd) && "bg-indigo-100/70 dark:bg-indigo-900/30"
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
