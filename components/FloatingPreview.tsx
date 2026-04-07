"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, Tag as TagIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface FloatingPreviewProps {
  isVisible: boolean;
  notes: string;
  monthLabel: string;
}

export default function FloatingPreview({ isVisible, notes, monthLabel }: FloatingPreviewProps) {
  if (!notes) return null;

  // Extract first line or summary
  const previewText = notes.split("\n")[0].substring(0, 60) + (notes.length > 60 ? "..." : "");
  const hasTag = notes.includes("#");
  const tagName = hasTag ? notes.split("#")[1].split(" ")[0] : null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className={cn(
            "absolute bottom-24 right-12 z-50 w-64 p-5 rounded-3xl",
            "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl",
            "border border-white/40 dark:border-white/10 shadow-2xl",
            "pointer-events-none select-none"
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-accent-500/10 flex items-center justify-center">
              <StickyNote className="w-4 h-4 text-accent-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Insight Preview
            </p>
          </div>

          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed italic">
            "{previewText}"
          </p>

          {tagName && (
            <div className="mt-4 flex items-center gap-2">
              <TagIcon className="w-3 h-3 text-accent-500" />
              <span className="text-[9px] font-black uppercase tracking-tighter text-accent-600 dark:text-accent-400">
                Labled as #{tagName}
              </span>
            </div>
          )}

          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white/80 dark:bg-slate-900/80 border-r border-b border-white/40 dark:border-white/10 rotate-45" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
