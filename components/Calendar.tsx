"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
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
import FloatingPreview from "./FloatingPreview";

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

  // Mouse Interaction Logic (Orchestration)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 100, damping: 20 });
  const springY = useSpring(my, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(springY, [-500, 500], [7, -7]);
  const rotateY = useTransform(springX, [-500, 500], [-7, 7]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Set relative coordinates for magnet/parallax
    mx.set(e.clientX - centerX);
    my.set(e.clientY - centerY);
    
    // Set custom cursor glow coordinates
    document.documentElement.style.setProperty("--x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--y", `${e.clientY}px`);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  // Parallax for Hero
  const heroParallaxX = useTransform(springX, [-500, 500], [-30, 30]);
  const heroParallaxY = useTransform(springY, [-500, 500], [-30, 30]);

  const heroScrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroScrollRef, offset: ["start start", "end start"] });
  const scrollYBaseY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

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
        "min-h-screen transition-colors duration-700 cursor-glow overflow-x-hidden",
        "bg-slate-50 dark:bg-slate-950"
      )}
    >
      <Particles count={25} />

      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-accent-500/5 dark:bg-accent-500/10 blur-[150px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px]" 
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 lg:p-12">
        {/* Main calendar card with 3D effect */}
        <motion.div
          style={{ rotateX, rotateY, perspective: 2000 }}
          className={cn(
            "w-full max-w-7xl rounded-[3rem] overflow-hidden relative preserve-3d",
            "transition-all duration-500 ease-out",
            "border border-white/20 dark:border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]",
            "antialiased subpixel-antialiased"
          )}
        >
          {/* High-fidelity glass background layer (Separated from content to avoid 3D blur bug) */}
          <div className="absolute inset-0 glass-card backdrop-blur-3xl pointer-events-none z-0" />
          
          <div className="relative z-10 w-full h-full flex flex-col">
            {/* Spiral binding */}
            <SpiralBinding />

            {/* Layout: desktop = 3 cols, mobile = stacked */}
            <div className="flex flex-col lg:flex-row min-h-[800px]">
              {/* LEFT: Notes panel */}
              <div className="lg:w-80 xl:w-[400px] p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/10 dark:border-white/5">
                <NotesPanel
                  notes={notes}
                  onNotesChange={setNotes}
                  range={range}
                  monthLabel={formatMonthYear(viewDate)}
                />
              </div>

              {/* CENTER + RIGHT */}
              <div className="flex-1 flex flex-col bg-white/5 dark:bg-slate-900/10">
                {/* Hero image with cinematic zoom */}
                <div
                  ref={heroScrollRef}
                  className="relative h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-slate-900" />
                  <motion.div
                    style={{ x: heroParallaxX, y: heroParallaxY, translateY: scrollYBaseY }}
                    className="absolute inset-0 scale-125 animate-cinematic-zoom"
                  >
                    {!imgLoaded && (
                      <div className="absolute inset-0 bg-slate-800 animate-shimmer" />
                    )}
                    <Image
                      src={heroImage}
                      alt={`${formatMonthYear(viewDate)} hero`}
                      fill
                      className={cn(
                        "object-cover transition-opacity duration-1000 will-change-transform",
                        imgLoaded ? "opacity-70" : "opacity-0"
                      )}
                      onLoad={() => setImgLoaded(true)}
                      priority
                      sizes="(max-width: 1024px) 100vw, 75vw"
                    />
                  </motion.div>

                  {/* Dark bottom fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Tags */}
                  <div className="absolute top-8 left-8 flex gap-3">
                    <div className="glass-tag animate-float">Atmospheric</div>
                    <div className="glass-tag animate-float" style={{ animationDelay: "1.5s" }}>Living UI</div>
                  </div>

                  {/* Month label overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                    <motion.div
                      key={viewDate.toISOString()}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="text-white/50 text-xs font-bold uppercase tracking-[0.4em] mb-3">
                        {viewDate.getFullYear()} Selection
                      </p>
                      <h1 className="text-white text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                        {new Intl.DateTimeFormat("en", { month: "long" }).format(viewDate)}
                      </h1>
                    </motion.div>
                  </div>

                  {/* Hero stats overlay */}
                  <HeroStats viewDate={viewDate} />
                </div>

                {/* Calendar section */}
                <div className="flex-1 p-6 lg:p-12 flex flex-col relative">
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

                  <div className="flex-1 px-4 pb-8 mt-8">
                    <CalendarGrid
                      viewDate={viewDate}
                      range={range}
                      hoverDate={hoverDate}
                      onSelect={selectDate}
                      onHover={setHoverDate}
                      direction={direction}
                      isLoading={isLoading}
                      mouseX={mx}
                      mouseY={my}
                    />
                  </div>

                  {/* Floating Context Preview */}
                  <FloatingPreview 
                    isVisible={!!(range.start && range.end && notes)} 
                    notes={notes} 
                    monthLabel={formatMonthYear(viewDate)} 
                  />

                  {/* Legend */}
                  <Legend />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Particles({ count = 20 }: { count?: number }) {
  const particles = useMemo(() => 
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    })), [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function SpiralBinding() {
  return (
    <div
      className="relative flex items-center justify-center gap-6 py-5 px-10 bg-slate-100/10 dark:bg-slate-900/20 border-b border-white/10"
      aria-hidden
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1 group">
          <div className="w-4 h-6 rounded-full border-2 border-slate-400/30 dark:border-slate-600/30 bg-white/5" />
          <div className="absolute top-4 w-1 h-8 bg-gradient-to-b from-slate-400/20 to-transparent dark:from-slate-600/20" />
        </div>
      ))}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-8 px-6 py-6 border-t border-white/10 mt-auto">
      <LegendItem color="bg-accent-500 shadow-glow-indigo" label="Selected" />
      <LegendItem color="bg-accent-500/20 border border-accent-500/40" label="Range Area" />
      <LegendItem
        color="ring-2 ring-accent-500 animate-pulse-ring"
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
    <div className="flex items-center gap-3 group">
      {dot ? (
        <span className={cn("w-3 h-3 rounded-full shadow-lg", color)} />
      ) : text ? (
        <span className={cn("text-xs font-black tracking-tighter", color)}>7th</span>
      ) : (
        <span className={cn("w-5 h-5 rounded-lg shadow-inner", color)} />
      )}
      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] group-hover:text-accent-500 transition-colors">{label}</span>
    </div>
  );
}
