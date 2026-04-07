"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { getDayOfYear, getDaysInYear, getWeek, getDaysInMonth } from "date-fns";
import { cn } from "@/utils/cn";

interface HeroStatsProps {
  viewDate: Date;
}

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
    <div className="absolute top-6 right-6 flex flex-col gap-3 items-end">
      {/* Week badge */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-tag animate-float flex items-center gap-2"
      >
        <span className="opacity-60 text-[8px]">WEEK</span>
        <span>{stats.weekNum}</span>
      </motion.div>

      {/* Year Progress card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card !bg-black/20 backdrop-blur-xl border-white/10 p-4 min-w-[140px] animate-float"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest">
            Year Progress
          </span>
          <span className="text-white text-[10px] font-bold tabular-nums">
            {stats.progress}%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent-400 to-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${stats.progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
          />
        </div>
        <div className="mt-2 text-[8px] text-white/40 font-medium text-right uppercase tracking-tighter">
          Day {stats.dayOfYear} of {stats.daysInYear}
        </div>
      </motion.div>

      {/* Days Count */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-tag animate-float flex items-center gap-2"
        style={{ animationDelay: "1s" }}
      >
        <span className="opacity-60 text-[8px]">DAYS</span>
        <span>{stats.daysInMonth}</span>
      </motion.div>
    </div>
  );
}
