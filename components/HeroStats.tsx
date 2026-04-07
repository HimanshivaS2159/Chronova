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
    <div className="absolute top-8 right-8 flex flex-col gap-4 items-end z-20">
      {/* Week badge */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
        className="glass-tag animate-float flex items-center gap-3 !px-4 !py-2"
      >
        <span className="opacity-40 text-[9px] font-black uppercase tracking-[0.2em]">Week</span>
        <span className="text-sm font-black text-white">{stats.weekNum}</span>
      </motion.div>

      {/* Year Progress card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
        className="glass-card !bg-black/40 backdrop-blur-3xl border-white/20 p-6 min-w-[200px] animate-float relative overflow-hidden group"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
            Year Journey
          </span>
          <span className="text-white text-xs font-black tabular-nums">
            {stats.progress}%
          </span>
        </div>
        
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative z-10 p-0.5 border border-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent-400 via-indigo-500 to-accent-300 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
            initial={{ width: 0 }}
            animate={{ width: `${stats.progress}%` }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 1 }}
          />
        </div>
        
        <div className="mt-3 text-[9px] text-white/30 font-black text-right uppercase tracking-[0.2em] relative z-10">
          Day {stats.dayOfYear} <span className="mx-1 opacity-20">/</span> {stats.daysInYear}
        </div>
      </motion.div>

      {/* Days Count */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
        className="glass-tag animate-float flex items-center gap-3 !px-4 !py-2"
        style={{ animationDelay: "1s" }}
      >
        <span className="opacity-40 text-[9px] font-black uppercase tracking-[0.2em]">Cycle</span>
        <span className="text-sm font-black text-white">{stats.daysInMonth} Days</span>
      </motion.div>
    </div>
  );
}
