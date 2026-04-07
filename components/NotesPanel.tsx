"use client";

import React, { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, Trash2, CalendarRange, Download, Check, Save, Tag, Smile } from "lucide-react";
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

const TAGS = [
  { id: "work", label: "Work", color: "bg-blue-500", text: "text-blue-500" },
  { id: "personal", label: "Personal", color: "bg-purple-500", text: "text-purple-500" },
  { id: "important", label: "Important", color: "bg-rose-500", text: "text-rose-500" },
];

const EMOJIS = ["📅", "📌", "💡", "🎯", "🚀", "✅", "🔥", "✨"];

export default function NotesPanel({
  notes,
  onNotesChange,
  range,
  monthLabel,
}: NotesPanelProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Sync local state when external notes change
  useEffect(() => {
    setLocalNotes(notes);
    // Parse tag from notes if exists (simple heuristic: #[tag])
    const foundTag = TAGS.find(t => notes.includes(`#${t.label}`));
    if (foundTag) setActiveTag(foundTag.id);
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
    setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setTimeout(() => setIsSaved(false), 2000);
  }, [localNotes, onNotesChange]);

  const handleClear = useCallback(() => {
    setLocalNotes("");
    onNotesChange("");
    setActiveTag(null);
  }, [onNotesChange]);

  const addEmoji = (emoji: string) => {
    setLocalNotes(prev => prev + emoji);
  };

  const toggleTag = (tagId: string) => {
    const tag = TAGS.find(t => t.id === tagId);
    if (!tag) return;
    
    if (activeTag === tagId) {
      setLocalNotes(prev => prev.replace(`#${tag.label}`, "").trim());
      setActiveTag(null);
    } else {
      // Remove old tag if exists
      let newNotes = localNotes;
      TAGS.forEach(t => { newNotes = newNotes.replace(`#${t.label}`, ""); });
      setLocalNotes(`${newNotes.trim()} #${tag.label}`.trim());
      setActiveTag(tagId);
    }
  };

  const handleExport = useCallback(() => {
    const content = [
      `Chronova Notes — ${monthLabel}`,
      rangeLabel ? `Range: ${rangeLabel}` : "",
      activeTag ? `Tag: ${activeTag.toUpperCase()}` : "",
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
  }, [localNotes, monthLabel, rangeLabel, activeTag]);

  const charCount = localNotes.length;
  const isAtLimit = charCount >= MAX_CHARS;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative flex flex-col h-full rounded-[3rem] overflow-hidden",
        "bg-amber-50/90 dark:bg-slate-900/40 backdrop-blur-xl",
        "border border-white/20 dark:border-white/5",
        "shadow-2xl shadow-indigo-900/10 dark:shadow-black/60 pt-2"
      )}
    >
      {/* Decorative gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[3rem]">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent-500/10 blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/10 blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between px-8 pt-10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center border border-amber-200/50 dark:border-slate-700/50">
            <StickyNote className="w-6 h-6 text-accent-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-500/60 dark:text-accent-400/60 mb-0.5">
              Chronicles
            </p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
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
                className="w-10 h-10 rounded-xl bg-accent-500 text-white shadow-lg shadow-accent-500/30 flex items-center justify-center hover:bg-accent-600 transition-all active:scale-90"
              >
                <Save className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
          
          <button
            onClick={handleExport}
            className="w-10 h-10 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-500 hover:text-accent-500 transition-all flex items-center justify-center"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tags & Emojis */}
      <div className="px-8 mb-6 flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-3">
          {TAGS.map(tag => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                activeTag === tag.id 
                  ? `${tag.color} text-white border-transparent shadow-lg shadow-${tag.id}/20 scale-105` 
                  : "bg-white/40 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-accent-500/50"
              )}
            >
              <Tag className="w-3 h-3" />
              {tag.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white/30 dark:bg-slate-800/30 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-white/5">
          <Smile className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex gap-2">
            {EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => addEmoji(e)}
                className="hover:scale-125 transition-transform active:scale-95 text-lg leading-none"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Range Status */}
      <div className="px-8 mb-4">
        <div className={cn(
          "flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-500",
          rangeLabel 
            ? "bg-accent-500/10 border border-accent-500/20 shadow-inner" 
            : "bg-slate-200/20 dark:bg-slate-800/20 border border-transparent"
        )}>
          <CalendarRange className={cn("w-5 h-5", rangeLabel ? "text-accent-500" : "text-slate-400")} />
          <span className={cn(
            "text-xs font-black tracking-tight",
            rangeLabel ? "text-accent-600 dark:text-accent-300" : "text-slate-400 opacity-50"
          )}>
            {rangeLabel || "SELECT A DURATION"}
          </span>
        </div>
      </div>

      {/* Paper Surface */}
      <div className="relative flex-1 mx-8 mb-10 bg-white/80 dark:bg-slate-950/40 rounded-[2rem] shadow-2xl overflow-hidden border border-white/40 dark:border-white/5">
        {/* Ruled lines */}
        <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden>
          {Array.from({ length: LINE_COUNT }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full border-b border-accent-200 dark:border-slate-800"
              style={{ top: `${(i + 1) * (100 / (LINE_COUNT + 1))}%` }}
            />
          ))}
          <div className="absolute top-0 bottom-0 left-12 border-l border-rose-400/30" />
        </div>

        <textarea
          value={localNotes}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) setLocalNotes(e.target.value);
          }}
          placeholder="Reflect on your journey..."
          className={cn(
            "relative w-full h-full min-h-[400px] resize-none bg-transparent",
            "pl-16 pr-8 py-6 text-sm font-bold leading-[2.4rem] tracking-tight",
            "text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-800",
            "focus:outline-none transition-colors"
          )}
          style={{ lineHeight: `${100 / (LINE_COUNT + 1)}%` }}
        />

        {/* Status Bar */}
        <div className="absolute bottom-6 right-8 left-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {isSaved && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20"
                >
                  <Check className="w-3 h-3" />
                  SAVED
                </motion.div>
              )}
            </AnimatePresence>
            {lastSaved && !isSaved && (
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Last saved {lastSaved}
              </span>
            )}
          </div>
          
          <span className={cn(
            "text-[9px] font-black tabular-nums tracking-widest",
            isAtLimit ? "text-rose-500" : "text-slate-400"
          )}>
            {charCount} / {MAX_CHARS}
          </span>
        </div>
      </div>

      {/* Spiral Holes */}
      <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-around items-center py-20 pointer-events-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="w-3.5 h-3.5 rounded-full bg-slate-100 dark:bg-slate-900 shadow-inner border border-white/20 dark:border-white/5"
          />
        ))}
      </div>
    </motion.div>
  );
}
