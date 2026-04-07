"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, ChevronLeft, ChevronRight, X, CalendarCheck } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatMonthYear, formatShortDate } from "@/utils/dateHelpers";
import { isToday as dateFnsIsToday, isSameMonth } from "date-fns";
import type { DateRange } from "@/hooks/useDateRange";

interface HeaderProps {
  viewDate: Date;
  isDark: boolean;
  onToggleDark: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  range: DateRange;
  onClearRange: () => void;
}

export default function Header({
  viewDate,
  isDark,
  onToggleDark,
  onPrev,
  onNext,
  onToday,
  range,
  onClearRange,
}: HeaderProps) {
  const hasRange = range.start && range.end;
  const isCurrentMonth = isSameMonth(viewDate, new Date());

  return (
    <div className="flex items-center justify-between px-6 py-4">
      {/* Month navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={onPrev}
          aria-label="Previous month"
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center",
            "bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm",
            "border border-white/40 dark:border-slate-600/40",
            "text-slate-600 dark:text-slate-300",
            "hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-400",
            "transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <motion.div
          key={viewDate.toISOString()}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-center min-w-[160px]"
        >
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight font-display">
            {formatMonthYear(viewDate)}
          </h2>
        </motion.div>

        <button
          onClick={onNext}
          aria-label="Next month"
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center",
            "bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm",
            "border border-white/40 dark:border-slate-600/40",
            "text-slate-600 dark:text-slate-300",
            "hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-400",
            "transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right side: range badge + today + dark toggle */}
      <div className="flex items-center gap-2">
        {hasRange && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-700/50"
          >
            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
              {formatShortDate(range.start!)} → {formatShortDate(range.end!)}
            </span>
            <button
              onClick={onClearRange}
              aria-label="Clear date range"
              className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Jump to today — only shown when not on current month */}
        {!isCurrentMonth && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onToday}
            aria-label="Jump to today (T)"
            title="Jump to today (T)"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold",
              "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
              "border border-emerald-200 dark:border-emerald-700/50",
              "hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all duration-200 active:scale-95"
            )}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Today
          </motion.button>
        )}

        <button
          onClick={onToggleDark}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center",
            "bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm",
            "border border-white/40 dark:border-slate-600/40",
            "text-amber-500 dark:text-indigo-300",
            "hover:bg-amber-50 dark:hover:bg-indigo-900/40",
            "transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
          )}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
