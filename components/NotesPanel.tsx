"use client";

import React, { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, Trash2, CalendarRange, Download, Check, Save } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatShortDate } from "@/utils/dateHelpers";
import type { DateRange } from "@/hooks/useDateRange";

interface NotesPanelProps {
  notes: string;
  onNotesChange: (v: string) => void;
  range: DateRange;
  monthLabel: string;
}

const LINE_COUNT = 15;
const MAX_CHARS = 1000;

export default function NotesPanel({
  notes,
  onNotesChange,
  range,
  monthLabel,
}: NotesPanelProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);

  // Sync local state when external notes change (e.g., month/range switch)
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const rangeLabel =
    range.start && range.end
      ? `${formatShortDate(range.start)} — ${formatShortDate(range.end)}`
      : range.start
      ? `Starting ${formatShortDate(range.start)}`
      : null;

  const handleSave = useCallback(() => {
    onNotesChange(localNotes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  }, [localNotes, onNotesChange]);

  const handleClear = useCallback(() => {
    setLocalNotes("");
    onNotesChange("");
  }, [onNotesChange]);

  const handleExport = useCallback(() => {
    const content = [
      `Chronova Notes — ${monthLabel}`,
      rangeLabel ? `Range: ${rangeLabel}` : "",
      "",
      localNotes,
    ]
      .filter(Boolean)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chronova-notes-${monthLabel.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [localNotes, monthLabel, rangeLabel]);

  const charCount = localNotes.length;
  const isNearLimit = charCount > MAX_CHARS * 0.8;
  const isAtLimit = charCount >= MAX_CHARS;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col h-full rounded-[2rem] overflow-hidden",
        "bg-amber-50/95 dark:bg-slate-900/90",
        "border border-amber-200/50 dark:border-white/10",
        "shadow-2xl shadow-amber-900/5 dark:shadow-black/40"
      )}
    >
      {/* Decorative gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/5 blur-[80px]" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/10 blur-[80px]" />
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between px-6 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-200/50 dark:bg-amber-900/30 flex items-center justify-center shadow-inner">
            <StickyNote className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700/50 dark:text-amber-400/50">
              Journal
            </p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {monthLabel}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {localNotes !== notes && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleSave}
                className="p-2 rounded-xl bg-accent-500 text-white shadow-lg shadow-accent-500/30 hover:bg-accent-600 transition-all active:scale-95"
                title="Save Changes"
              >
                <Save className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
          
          <button
            onClick={handleExport}
            className="p-2 rounded-xl text-slate-400 hover:text-accent-500 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all"
            title="Export"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleClear}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Range Status */}
      <div className="px-6 mb-4">
        <div className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-500",
          rangeLabel 
            ? "bg-accent-500/10 border border-accent-500/20 shadow-sm" 
            : "bg-slate-100/50 dark:bg-slate-800/30 border border-transparent"
        )}>
          <CalendarRange className={cn("w-4 h-4", rangeLabel ? "text-accent-500" : "text-slate-400")} />
          <span className={cn(
            "text-xs font-semibold tracking-wide",
            rangeLabel ? "text-accent-700 dark:text-accent-300" : "text-slate-400"
          )}>
            {rangeLabel || "Full Month Context"}
          </span>
        </div>
      </div>

      {/* Paper Surface */}
      <div className="relative flex-1 mx-6 mb-8 bg-white dark:bg-slate-950/40 rounded-[1.5rem] shadow-inner overflow-hidden border border-amber-200/30 dark:border-white/5">
        {/* Ruled lines */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {Array.from({ length: LINE_COUNT }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full border-b border-amber-100 dark:border-slate-800/60"
              style={{ top: `${(i + 1) * (100 / (LINE_COUNT + 1))}%` }}
            />
          ))}
          {/* Vertical Red Line */}
          <div className="absolute top-0 bottom-0 left-10 border-l border-rose-300/40 dark:border-rose-900/30" />
        </div>

        <textarea
          value={localNotes}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) setLocalNotes(e.target.value);
          }}
          placeholder="Start writing your plans..."
          className={cn(
            "relative w-full h-full min-h-[300px] resize-none bg-transparent",
            "pl-14 pr-6 py-4 text-sm font-medium leading-[2.2rem]",
            "text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700",
            "focus:outline-none transition-colors"
          )}
          style={{ lineHeight: `${100 / (LINE_COUNT + 1)}%` }}
        />

        {/* Character Count & Save Status */}
        <div className="absolute bottom-4 right-6 flex items-center gap-3">
          <AnimatePresence>
            {isSaved && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full border border-emerald-500/20"
              >
                <Check className="w-3 h-3" />
                SAVED
              </motion.div>
            )}
          </AnimatePresence>
          <span className={cn(
            "text-[10px] font-bold tabular-nums tracking-widest",
            isAtLimit ? "text-rose-500" : "text-slate-300 dark:text-slate-700"
          )}>
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      </div>

      {/* Spiral Hole Decoration */}
      <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-around items-center py-12 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-900 border border-amber-300/20 dark:border-white/5 shadow-inner"
          />
        ))}
      </div>
    </motion.div>
  );
}
