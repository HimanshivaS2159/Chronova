import React, { useMemo } from "react";
import { motion, AnimatePresence, MotionValue } from "framer-motion";
import DayCell from "./DayCell";
import { buildCalendarWeeks } from "@/utils/dateHelpers";
import type { DateRange } from "@/hooks/useDateRange";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
  viewDate: Date;
  range: DateRange;
  hoverDate: Date | null;
  onSelect: (date: Date) => void;
  onHover: (date: Date | null) => void;
  direction: number;
  isLoading?: boolean;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const SkeletonCell = () => (
  <div className="flex items-center justify-center h-14 w-full">
    <div className="w-12 h-12 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 animate-shimmer bg-[length:200%_100%]" />
  </div>
);

export default function CalendarGrid({
  viewDate,
  range,
  hoverDate,
  onSelect,
  onHover,
  direction,
  isLoading,
  mouseX,
  mouseY,
}: CalendarGridProps) {
  const weeks = useMemo(() => buildCalendarWeeks(viewDate), [viewDate]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      rotateY: dir > 0 ? 25 : -25,
      filter: "blur(10px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: "none",
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
      rotateY: dir > 0 ? -25 : 25,
      filter: "blur(10px)",
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <div className="w-full relative min-h-[400px]">
      {/* Weekday headers */}
      <div className="grid grid-cols-[3rem_repeat(7,1fr)] mb-4 lg:mb-6">
        <div /> 
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500 py-3"
          >
            {d}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={viewDate.toISOString()}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="perspective-1000"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, wi) => (
                <div key={wi} className="grid grid-cols-[3rem_repeat(7,1fr)] mb-1">
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-4 rounded bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
                  </div>
                  {Array.from({ length: 7 }).map((_, di) => (
                    <SkeletonCell key={di} />
                  ))}
                </div>
              ))
            : weeks.map((week) => (
                <div key={week.weekNumber} className="grid grid-cols-[3rem_repeat(7,1fr)] mb-1">
                  <div className="flex items-center justify-center opacity-40">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 tabular-nums">
                      {week.weekNumber}
                    </span>
                  </div>
                  
                  {week.days.map((day) => (
                    <DayCell
                      key={day.date.toISOString()}
                      day={day}
                      range={range}
                      hoverDate={hoverDate}
                      onSelect={onSelect}
                      onHover={onHover}
                      mouseX={mouseX}
                      mouseY={mouseY}
                    />
                  ))}
                </div>
              ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
