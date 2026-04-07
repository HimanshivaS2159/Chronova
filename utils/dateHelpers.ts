import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
  addMonths,
  subMonths,
  isWithinInterval,
  isBefore,
  isAfter,
} from "date-fns";

export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  holiday?: string;
};

// Mock holiday data — keyed as "MM-DD"
const HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "02-14": "Valentine's Day",
  "03-17": "St. Patrick's Day",
  "04-22": "Earth Day",
  "05-27": "Memorial Day",
  "06-19": "Juneteenth",
  "07-04": "Independence Day",
  "09-02": "Labor Day",
  "10-31": "Halloween",
  "11-11": "Veterans Day",
  "11-28": "Thanksgiving",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve",
};

export function getHoliday(date: Date): string | undefined {
  const key = format(date, "MM-dd");
  return HOLIDAYS[key];
}

export function buildCalendarDays(viewDate: Date): CalendarDay[] {
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  // Week starts Monday
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: calStart, end: calEnd }).map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, viewDate),
    isToday: isToday(date),
    isWeekend: [0, 6].includes(date.getDay()),
    holiday: getHoliday(date),
  }));
}

export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy");
}

export function formatShortDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export function nextMonth(date: Date): Date {
  return addMonths(date, 1);
}

export function prevMonth(date: Date): Date {
  return subMonths(date, 1);
}

export function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const [s, e] = isBefore(start, end) ? [start, end] : [end, start];
  return isWithinInterval(date, { start: s, end: e });
}

export function isRangeStart(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start) return false;
  if (!end) return isSameDay(date, start);
  return isSameDay(date, isBefore(start, end) ? start : end);
}

export function isRangeEnd(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  return isSameDay(date, isBefore(start, end) ? end : start);
}

export { isSameDay, isBefore, isAfter, format };
