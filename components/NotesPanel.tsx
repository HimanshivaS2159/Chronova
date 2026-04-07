"use client";

import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { StickyNote, Trash2, CalendarRange } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatShortDate } from "@/utils/dateHelpers";
import type { DateRange } from "@/hooks/useDateRange";

interface NotesPanelProps {
  notes: string;
  onNotesChange: (v: string) => void;
  range: DateRange;
  monthLabel: string;
}

const LINE_COUNT = 12;

export default function NotesPanel({
  notes,
  onNotesChange,
  range,
  monthLabel,
}: NotesPanelProps) {
  const rangeLabel =
    range.start && range.end
      ? `${formatShortDate(range.start)} → ${formatShortDate(range.end)}`
      : range.start
      ? `From ${formatShortDate(range.start)}`
      : null;

  const handleClear = useCallback(() => onNotesChange(""), [onNotesChange]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col h-full rounded-2xl overflow-hidden",
        "bg-amber-50/90 dark:bg-slate-800/90",
        "border border-amber-200/60 dark:border-slate-700/60",
        "shadow-[4px_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[4px_4px_20px_rgba(0,0,0,0.3)]"
      )}
    >
      {/* Diagonal color overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-200/30 to-purple-200/20 dark:from-indigo-900/20 dark:to-purple-900/10 rotate-12 rounded-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-amber-200/40 to-orange-100/20 dark:from-amber-900/20 dark:to-orange-900/10 -rotate-12 rounded-3xl" />
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
            <StickyNote className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Notes
            </p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
              {monthLabel}
            </p>
          </div>
        </div>
        {notes && (
          <button
            onClick={handleClear}
            aria-label="Clear notes"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Range badge */}
      {rangeLabel && (
        <div className="relative mx-5 mb-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-100/80 dark:bg-indigo-900/40 border border-indigo-200/60 dark:border-indigo-700/40">
          <CalendarRange className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
          <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300 truncate">
            {rangeLabel}
          </span>
        </div>
      )}

      {/* Paper lines + textarea */}
      <div className="relative flex-1 mx-5 mb-5 overflow-hidden rounded-xl">
        {/* Ruled lines */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {Array.from({ length: LINE_COUNT }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full border-b border-amber-200/70 dark:border-slate-600/40"
              style={{ top: `${(i + 1) * (100 / (LINE_COUNT + 1))}%` }}
            />
          ))}
          {/* Left margin line */}
          <div className="absolute top-0 bottom-0 left-7 border-l-2 border-rose-200/60 dark:border-rose-800/30" />
        </div>

        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Jot down your thoughts, plans, or reminders for this month..."
          aria-label="Monthly notes"
          className={cn(
            "relative w-full h-full min-h-[200px] resize-none bg-transparent",
            "pl-10 pr-3 py-2 text-sm leading-[calc(100%/13*1.5)]",
            "text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600",
            "focus:outline-none font-sans"
          )}
          style={{ lineHeight: `${100 / (LINE_COUNT + 1)}%` }}
        />
      </div>

      {/* Spiral holes decoration on left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col justify-around items-center py-6 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-amber-200/80 dark:bg-slate-600/60 border border-amber-300/60 dark:border-slate-500/40"
          />
        ))}
      </div>
    </motion.div>
  );
}
