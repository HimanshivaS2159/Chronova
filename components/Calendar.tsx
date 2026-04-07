"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { formatMonthYear, nextMonth, prevMonth } from "@/utils/dateHelpers";
import { useDateRange } from "@/hooks/useDateRange";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { useDynamicTheme } from "@/hooks/useDynamicTheme";
import Header from "./Header";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import HeroStats from "./HeroStats";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1200&q=80", // Jan
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&q=80", // Feb
  "https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=1200&q=80", // Mar
  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&q=80", // Apr
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=80", // May
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80", // Jun
  "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1200&q=80", // Jul
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80", // Aug
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80", // Sep
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=80", // Oct
  "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=1200&q=80", // Nov
  "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=1200&q=80", // Dec
];

export default function Calendar() {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [direction, setDirection] = useState(1);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const { range, hoverDate, setHoverDate, selectDate, clearRange } = useDateRange();
  const heroImage = HERO_IMAGES[viewDate.getMonth()];
  
  // Dynamic Theme Extraction
  useDynamicTheme(heroImage);

  // Range-linked notes key logic
  const notesKey = useMemo(() => {
    if (range.start && range.end) {
      const s = range.start.toISOString().split("T")[0];
      const e = range.end.toISOString().split("T")[0];
      return `chronova-notes-range-${s}-${e}`;
    }
    return `chronova-notes-month-${viewDate.getFullYear()}-${viewDate.getMonth()}`;
  }, [viewDate, range]);

  const [notes, setNotes] = useLocalStorage<string>(notesKey, "");

  // Mouse Parallax & 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
    
    // Set custom cursor glow coordinates
    document.documentElement.style.setProperty("--x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--y", `${e.clientY}px`);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Parallax for Hero
  const heroParallaxX = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const heroParallaxY = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);

  const heroScrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroScrollRef, offset: ["start start", "end start"] });
  const scrollYBaseY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

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
    }, 400);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIsLoading(true);
    setImgLoaded(false);
    setTimeout(() => {
      setViewDate((d) => prevMonth(d));
      setIsLoading(false);
    }, 400);
  }, []);

  const goToday = useCallback(() => {
    const today = new Date();
    const current = viewDate;
    if (today.getMonth() !== current.getMonth() || today.getFullYear() !== current.getFullYear()) {
      setDirection(today > current ? 1 : -1);
      setIsLoading(true);
      setImgLoaded(false);
      setTimeout(() => {
        setViewDate(today);
        setIsLoading(false);
      }, 400);
    }
  }, [viewDate]);

  useKeyboardNav({ onPrev: goPrev, onNext: goNext, onToday: goToday });

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "min-h-screen transition-colors duration-700 cursor-glow",
        "bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50",
        "dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
      )}
    >
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-accent-100 dark:bg-accent-900/10 blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-200/20 dark:bg-indigo-950/10 blur-[100px]" 
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 lg:p-12">
        {/* Main calendar card with 3D effect */}
        <motion.div
          style={{ rotateX, rotateY, perspective: 2000 }}
          className={cn(
            "w-full max-w-7xl rounded-[2.5rem] overflow-hidden glass-card",
            "transition-all duration-500 ease-out preserve-3d",
            "border border-white/60 dark:border-white/10"
          )}
        >
          {/* Spiral binding */}
          <SpiralBinding />

          {/* Layout: desktop = 3 cols, mobile = stacked */}
          <div className="flex flex-col lg:flex-row min-h-[700px]">
            {/* LEFT: Notes panel */}
            <div className="lg:w-80 xl:w-96 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-white/20 dark:border-white/5">
              <NotesPanel
                notes={notes}
                onNotesChange={setNotes}
                range={range}
                monthLabel={formatMonthYear(viewDate)}
              />
            </div>

            {/* CENTER + RIGHT */}
            <div className="flex-1 flex flex-col bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm">
              {/* Hero image with parallax */}
              <div
                ref={heroScrollRef}
                className="relative h-64 md:h-80 lg:h-96 overflow-hidden group"
              >
                <motion.div
                  style={{ x: heroParallaxX, y: heroParallaxY, translateY: scrollYBaseY }}
                  className="absolute inset-0 scale-125"
                >
                  {!imgLoaded && (
                    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-shimmer bg-[length:200%_100%]" />
                  )}
                  <Image
                    src={heroImage}
                    alt={`${formatMonthYear(viewDate)} hero`}
                    fill
                    className={cn(
                      "object-cover transition-opacity duration-1000 ease-in-out group-hover:scale-110",
                      imgLoaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => setImgLoaded(true)}
                    priority
                    sizes="(max-width: 1024px) 100vw, 75vw"
                  />
                </motion.div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/30" />

                {/* Tags */}
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className="glass-tag animate-float">Interactive</div>
                  <div className="glass-tag animate-float" style={{ animationDelay: "1s" }}>Customizable</div>
                </div>

                {/* Month label overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                  <motion.div
                    key={viewDate.toISOString()}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <p className="text-white/80 text-sm font-semibold uppercase tracking-[0.3em] mb-2">
                      {viewDate.getFullYear()}
                    </p>
                    <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold font-display drop-shadow-2xl">
                      {new Intl.DateTimeFormat("en", { month: "long" }).format(viewDate)}
                    </h1>
                  </motion.div>
                </div>

                {/* Hero stats overlay */}
                <HeroStats viewDate={viewDate} />
              </div>

              {/* Calendar section */}
              <div className="flex-1 p-6 lg:p-10 flex flex-col">
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

                <div className="flex-1 px-2 pb-6 mt-4">
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
        </motion.div>
      </div>
    </div>
  );
}

function SpiralBinding() {
  return (
    <div
      className="relative flex items-center justify-center gap-6 py-4 px-8 bg-gradient-to-r from-slate-200 via-slate-50 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 border-b border-white/20 dark:border-white/5"
      aria-hidden
    >
      {Array.from({ length: 22 }).map((_, i) => (
        <div key={i} className="relative flex flex-col items-center gap-0.5">
          <div className="w-5 h-4 rounded-t-full border-2 border-slate-400 dark:border-slate-500 border-b-0 bg-white/50 dark:bg-black/20" />
          <div className="w-5 h-4 rounded-b-full border-2 border-slate-400 dark:border-slate-500 border-t-0 bg-white/50 dark:bg-black/20" />
        </div>
      ))}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-6 px-4 py-4 border-t border-slate-200/40 dark:border-white/5 mt-auto">
      <LegendItem color="bg-accent-500 shadow-glow-indigo" label="Selected" />
      <LegendItem color="bg-accent-100 dark:bg-accent-900/40" label="In range" />
      <LegendItem
        color="ring-2 ring-accent-500 bg-transparent animate-pulse"
        label="Today"
      />
      <LegendItem color="bg-amber-400 shadow-glow-amber" label="Holiday" dot />
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
    <div className="flex items-center gap-2">
      {dot ? (
        <span className={cn("w-2.5 h-2.5 rounded-full", color)} />
      ) : text ? (
        <span className={cn("text-xs font-bold", color)}>Sa</span>
      ) : (
        <span className={cn("w-4 h-4 rounded-md", color)} />
      )}
      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}
