"use client";

import React, { useCallback, useRef, useMemo } from "react";
import { motion, useTransform, useSpring, MotionValue } from "framer-motion";
import { cn } from "@/utils/cn";
import { isRangeStart, isRangeEnd, isInRange, isSameDay } from "@/utils/dateHelpers";
import { isPast, isFuture, isToday } from "date-fns";
import type { CalendarDay } from "@/utils/dateHelpers";
import type { DateRange } from "@/hooks/useDateRange";
import Tooltip from "./Tooltip";

interface DayCellProps {
  day: CalendarDay;
  range: DateRange;
  hoverDate: Date | null;
  onSelect: (date: Date) => void;
  onHover: (date: Date | null) => void;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
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
  mouseX,
  mouseY,
}: DayCellProps) {
  const { date, isCurrentMonth, holiday } = day;
  const cellRef = useRef<HTMLDivElement>(null);

  // States
  const todayFlag = isToday(date);
  const pastFlag = isPast(date) && !todayFlag;
  const futureFlag = isFuture(date);

  // Effective end for hover preview
  const effectiveEnd = range.start && !range.end ? hoverDate : range.end;

  const isStart = isRangeStart(date, range.start, effectiveEnd);
  const isEnd = isRangeEnd(date, range.start, effectiveEnd);
  const inRange = isInRange(date, range.start, effectiveEnd);
  const isSelected = isSameDay(date, range.start ?? new Date(0)) && !range.end;
  const isPreview = range.start && !range.end && inRange && !isStart;

  // Magnetic Hover Logic
  const strength = 12; // max displacement in px
  const magnetX = useSpring(0, { stiffness: 150, damping: 15 });
  const magnetY = useSpring(0, { stiffness: 150, damping: 15 });

  // Update magnetic pull based on global mouse motion values
  React.useEffect(() => {
    return mouseX.on("change", (latestX) => {
      if (!cellRef.current) return;
      const rect = cellRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = latestX + (window.innerWidth / 2) - centerX;
      const dy = mouseY.get() + (window.innerHeight / 2) - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const pull = (1 - distance / 100) * strength;
        magnetX.set(dx * (pull / distance));
        magnetY.set(dy * (pull / distance));
      } else {
        magnetX.set(0);
        magnetY.set(0);
      }
    });
  }, [mouseX, mouseY, magnetX, magnetY]);

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
      style={{ x: magnetX, y: magnetY }}
      whileHover={{ scale: 1.15, zIndex: 30 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      onMouseEnter={() => onHover(date)}
      onMouseLeave={() => onHover(null)}
      aria-label={`${date.toDateString()}${holiday ? ` — ${holiday}` : ""}`}
      className={cn(
        "relative group w-12 h-12 rounded-xl flex items-center justify-center",
        "text-sm font-bold transition-all duration-300 select-none border-gradient",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
        
        // Month contexts
        !isCurrentMonth && "text-slate-300 dark:text-slate-700 opacity-20",
        isCurrentMonth && !isStart && !isEnd && "text-slate-700 dark:text-slate-200",
        
        // Past / Future
        pastFlag && isCurrentMonth && !isStart && !isEnd && "opacity-50 grayscale-[0.3]",
        futureFlag && isCurrentMonth && !isStart && !isEnd && "animate-slide-up",
        
        // Today styling
        todayFlag && !isStart && !isEnd && !isSelected &&
          "bg-white dark:bg-slate-800 ring-2 ring-accent-500 shadow-glow-indigo text-accent-600 dark:text-accent-400",
          
        // Selected / Range Start/End
        (isStart || isEnd || isSelected) &&
          "bg-gradient-to-br from-accent-500 to-accent-600 text-white shadow-xl shadow-accent-500/40 z-20 scale-105",
        
        // Hover Preview (Ghost Range)
        isPreview && !isEnd && "bg-accent-500/20 text-accent-700 dark:text-accent-300 scale-105 shadow-sm",
        
        // Hover state for normal days
        isCurrentMonth && !isStart && !isEnd && !isSelected && !isPreview &&
          "hover:bg-white dark:hover:bg-slate-800 hover:shadow-premium-lg"
      )}
    >
      <span className="relative z-10">{dayNum}</span>
      
      {/* Today Ripple Ring */}
      {todayFlag && !isStart && !isEnd && (
        <span className="absolute inset-0 rounded-xl border-2 border-accent-500 animate-pulse-ring pointer-events-none" />
      )}

      {/* Holiday Indicator */}
      {holiday && isCurrentMonth && (
        <span
          className={cn(
            "absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
            isStart || isEnd || isSelected ? "bg-white" : "bg-amber-400 shadow-glow-amber"
          )}
        />
      )}
    </motion.button>
  );

  return (
    <div
      ref={cellRef}
      className={cn(
        "relative flex items-center justify-center h-16 w-full transition-all duration-500",
        inRange && !isStart && !isEnd && "bg-accent-500/10 dark:bg-accent-500/10 scale-y-90",
        isStart && "bg-gradient-to-r from-transparent via-accent-500/10 to-accent-500/10 rounded-l-2xl",
        isEnd && "bg-gradient-to-l from-transparent via-accent-500/10 to-accent-500/10 rounded-r-2xl",
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
