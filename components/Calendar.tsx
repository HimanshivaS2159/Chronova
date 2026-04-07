"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { formatMonthYear, nextMonth, prevMonth } from "@/utils/dateHelpers";
import { useDateRange } from "@/hooks/useDateRange";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import Header from "./Header";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import HeroStats from "./HeroStats";

// Hero images per month (Unsplash)
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=900&q=80", // Jan - winter
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=900&q=80", // Feb - hearts
  "https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=900&q=80", // Mar - spring
  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&q=80", // Apr - flowers
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=900&q=80", // May - green
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80", // Jun - beach
  "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=900&q=80", // Jul - summer
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=80", // Aug - sunset
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80", // Sep - autumn
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=900&q=80", // Oct - fall
  "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=900&q=80", // Nov - fog
  "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=900&q=80", // Dec - snow
];

export default function Calendar() {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [direction, setDirection] = useState(1);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const { range, hoverDate, setHoverDate, selectDate, clearRange } = useDateRange();

  const monthKey = `chronova-notes-${viewDate.getFullYear()}-${viewDate.getMonth()}`;
  const [notes, setNotes] = useLocalStorage<string>(monthKey, "");

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const heroImage = HERO_IMAGES[viewDate.getMonth()];

  // Dark mode
  useEffect(() => {
    const stored = localStorage.getItem("chronova-dark");
    if (stored === "true") setIsDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("chronova-dark", String(isDark));
  }, [isDark]);

  const goNext = useCallback(() => {
    setDirection(1);
    setIsLoading(true);
    setImgLoaded(false);
    setTimeout(() => {
      setViewDate((d) => nextMonth(d));
      setIsLoading(false);
    }, 300);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIsLoading(true);
    setImgLoaded(false);
    setTimeout(() => {
      setViewDate((d) => prevMonth(d));
      setIsLoading(false);
    }, 300);
  }, []);

  const goToday = useCallback(() => {
    const today = new Date();
    const current = viewDate;
    if (
      today.getMonth() !== current.getMonth() ||
      today.getFullYear() !== current.getFullYear()
    ) {
      setDirection(today > current ? 1 : -1);
      setIsLoading(true);
      setImgLoaded(false);
      setTimeout(() => {
        setViewDate(today);
        setIsLoading(false);
      }, 300);
    }
  }, [viewDate]);

  useKeyboardNav({ onPrev: goPrev, onNext: goNext, onToday: goToday });

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-500",
        "bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100",
        "dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950"
      )}
    >
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-200/30 dark:bg-indigo-900/20 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-8">
        {/* Main calendar card */}
        <div
          className={cn(
            "w-full max-w-6xl rounded-3xl overflow-hidden",
            "shadow-calendar dark:shadow-calendar-dark",
            "bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl",
            "border border-white/50 dark:border-slate-700/50"
          )}
        >
          {/* Spiral binding */}
          <SpiralBinding />

          {/* Layout: desktop = 3 cols, mobile = stacked */}
          <div className="flex flex-col lg:flex-row">
            {/* LEFT: Notes panel */}
            <div className="lg:w-64 xl:w-72 p-4 lg:p-5 border-b lg:border-b-0 lg:border-r border-white/30 dark:border-slate-700/30">
              <NotesPanel
                notes={notes}
                onNotesChange={setNotes}
                range={range}
                monthLabel={formatMonthYear(viewDate)}
              />
            </div>

            {/* CENTER + RIGHT */}
            <div className="flex-1 flex flex-col">
              {/* Hero image */}
              <div
                ref={heroRef}
                className="relative h-52 md:h-64 lg:h-72 overflow-hidden"
              >
                <motion.div
                  style={{ y: heroY }}
                  className="absolute inset-0 scale-110"
                >
                  {/* Skeleton while loading */}
                  {!imgLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer bg-[length:200%_100%]" />
                  )}
                  <Image
                    src={heroImage}
                    alt={`${formatMonthYear(viewDate)} hero`}
                    fill
                    className={cn(
                      "object-cover transition-opacity duration-700",
                      imgLoaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => setImgLoaded(true)}
                    priority
                    sizes="(max-width: 1024px) 100vw, 75vw"
                  />
                </motion.div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

                {/* Month label overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <motion.div
                    key={viewDate.toISOString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-white/70 text-xs font-semibold uppercase tracking-[0.2em] mb-0.5">
                      {viewDate.getFullYear()}
                    </p>
                    <h1 className="text-white text-3xl md:text-4xl font-bold font-display drop-shadow-lg">
                      {new Intl.DateTimeFormat("en", { month: "long" }).format(viewDate)}
                    </h1>
                  </motion.div>
                </div>

                {/* Diagonal modern overlay */}
                <div className="absolute top-0 right-0 w-32 h-full overflow-hidden pointer-events-none">
                  <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-white/10 to-transparent -skew-x-12 origin-top-right" />
                </div>

                {/* Hero stats overlay */}
                <HeroStats viewDate={viewDate} />
              </div>

              {/* Calendar section */}
              <div className="flex-1 p-4 md:p-6">
                <Header
                  viewDate={viewDate}
                  isDark={isDark}
                  onToggleDark={() => setIsDark((d) => !d)}
                  onPrev={goPrev}
                  onNext={goNext}
                  onToday={goToday}
                  range={range}
                  onClearRange={clearRange}
                />

                <div className="px-2 pb-4">
                  <CalendarGrid
                    viewDate={viewDate}
                    range={range}
                    hoverDate={hoverDate}
                    onSelect={selectDate}
                    onHover={setHoverDate}
                    direction={direction}
                    isLoading={isLoading}
                  />
                </div>

                {/* Legend */}
                <Legend />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpiralBinding() {
  return (
    <div
      className="relative flex items-center justify-center gap-6 py-3 px-8 bg-gradient-to-r from-slate-200/80 via-slate-100/80 to-slate-200/80 dark:from-slate-800/80 dark:via-slate-700/80 dark:to-slate-800/80 border-b border-slate-200/60 dark:border-slate-700/60"
      aria-hidden
    >
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="relative flex flex-col items-center gap-0.5">
          {/* Top loop */}
          <div className="w-5 h-3 rounded-t-full border-2 border-slate-400/70 dark:border-slate-500/70 border-b-0 bg-gradient-to-b from-slate-300/50 to-transparent dark:from-slate-600/50" />
          {/* Bottom loop */}
          <div className="w-5 h-3 rounded-b-full border-2 border-slate-400/70 dark:border-slate-500/70 border-t-0 bg-gradient-to-t from-slate-300/50 to-transparent dark:from-slate-600/50" />
        </div>
      ))}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4 px-2 pt-2 border-t border-slate-100 dark:border-slate-800">
      <LegendItem color="bg-indigo-600" label="Selected" />
      <LegendItem color="bg-indigo-100 dark:bg-indigo-900/40" label="In range" />
      <LegendItem
        color="ring-2 ring-indigo-400 bg-transparent"
        label="Today"
      />
      <LegendItem color="bg-amber-400" label="Holiday" dot />
      <LegendItem color="text-rose-500" label="Weekend" text />
    </div>
  );
}

function LegendItem({
  color,
  label,
  dot,
  text,
}: {
  color: string;
  label: string;
  dot?: boolean;
  text?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {dot ? (
        <span className={cn("w-2 h-2 rounded-full", color)} />
      ) : text ? (
        <span className={cn("text-xs font-bold", color)}>Sa</span>
      ) : (
        <span className={cn("w-4 h-4 rounded-full", color)} />
      )}
      <span className="text-xs text-slate-400 dark:text-slate-500">{label}</span>
    </div>
  );
}
