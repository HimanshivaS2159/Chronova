"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { getDayOfYear, getDaysInYear, getWeek, getDaysInMonth } from "date-fns";

interface HeroStatsProps {
  viewDate: Date;
}

/**
 * Displays a compact stats bar over the hero image:
 * - Day of year progress bar
 * - Week number
 * - Days in month
 */
export default function HeroStats({ viewDate }: HeroStatsProps) {
  const stats = useMemo(() => {
    const today = new Date();
    const dayOfYear = getDayOfYear(today);
    const daysInYear = getDaysInYear(today);
    const progress = Math.round((dayOfYear / daysInYear) * 100);
    const weekNum = getWeek(viewDate, { weekStartsOn: 1 });
    const daysInMonth = getDaysInMonth(viewDate);
    return { dayOfYear, daysInYear, progress, weekNum, daysInMonth };
  }, [viewDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="absolute top-4 right-4 flex flex-col gap-2 items-end"
    >
      {/* Week badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/20">
        <span className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">
          Wk
        </span>
        <span className="text-white text-xs font-bold">{stats.weekNum}</span>
      </div>

      {/* Day of year progress */}
      <div className="flex flex-col items-end gap-1 px-2.5 py-1.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/20 min-w-[100px]">
        <div className="flex items-center justify-between w-full">
          <span className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">
            Year
          </span>
          <span className="text-white text-[10px] font-bold">
            {stats.dayOfYear}/{stats.daysInYear}
          </span>
        </div>
        <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
            initial={{ width: 0 }}
            animate={{ width: `${stats.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </div>

      {/* Days in month */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/20">
        <span className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">
          Days
        </span>
        <span className="text-white text-xs font-bold">{stats.daysInMonth}</span>
      </div>
    </motion.div>
  );
}
