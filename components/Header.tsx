"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, ChevronLeft, ChevronRight, X, CalendarCheck, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatMonthYear, formatShortDate } from "@/utils/dateHelpers";
import { isToday as dateFnsIsToday, isSameMonth, getDay } from "date-fns";
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
  
  // Week progress (1-7)
  const today = new Date();
  const dayOfWeek = getDay(today); // 0-6 (Sun-Sat)
  const weekProgress = ((dayOfWeek + 1) / 7) * 100;

  return (
    <div className="flex flex-col gap-6 px-4 py-4 mb-4">
      <div className="flex items-center justify-between">
        {/* Month navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPrev}
            aria-label="Previous month"
            className={cn(
              "w-11 h-11 rounded-2xl flex items-center justify-center",
              "bg-white/10 dark:bg-slate-800/20 backdrop-blur-xl",
              "border border-white/20 dark:border-white/5",
              "text-slate-600 dark:text-slate-300 shadow-xl",
              "hover:bg-accent-500 hover:text-white hover:border-transparent",
              "transition-all duration-500 active:scale-90"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <motion.div
            key={viewDate.toISOString()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center min-w-[200px]"
          >
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter font-display">
              {formatMonthYear(viewDate)}
            </h2>
          </motion.div>

          <button
            onClick={onNext}
            aria-label="Next month"
            className={cn(
              "w-11 h-11 rounded-2xl flex items-center justify-center",
              "bg-white/10 dark:bg-slate-800/20 backdrop-blur-xl",
              "border border-white/20 dark:border-white/5",
              "text-slate-600 dark:text-slate-300 shadow-xl",
              "hover:bg-accent-500 hover:text-white hover:border-transparent",
              "transition-all duration-500 active:scale-90"
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right side: range badge + today + dark toggle */}
        <div className="flex items-center gap-3">
          {hasRange && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-accent-500 text-white shadow-xl shadow-accent-500/20 border border-white/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-black uppercase tracking-widest">
                {formatShortDate(range.start!)} — {formatShortDate(range.end!)}
              </span>
              <button
                onClick={onClearRange}
                className="hover:rotate-90 transition-transform p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {!isCurrentMonth && (
            <button
              onClick={onToday}
              className="px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-white/40 dark:border-white/5 text-xs font-black uppercase tracking-widest text-accent-500 hover:bg-accent-500 hover:text-white transition-all duration-300"
            >
              Current
            </button>
          )}

          <button
            onClick={onToggleDark}
            className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/10 dark:bg-slate-800/20 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-xl transition-all hover:scale-110 active:scale-90"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
          </button>
        </div>
      </div>

      {/* Week Progress Indicator */}
      {isCurrentMonth && (
        <div className="relative h-1.5 w-full bg-slate-200/50 dark:bg-slate-800/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${weekProgress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-400 to-accent-600 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          />
          <span className="absolute right-0 top-[-20px] text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Week Progress: {Math.round(weekProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}
