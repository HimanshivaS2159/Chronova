# Chronova — Premium Wall Calendar

A highly polished, interactive wall calendar built with Next.js 14, TypeScript, and Tailwind CSS. Designed to look and feel like a real physical hanging calendar with depth, shadows, and premium typography.

---

## Features

- **Wall calendar aesthetic** — spiral binding, hero image per month, paper-lined notes panel
- **Date range selection** — click start → click end, with hover preview and smooth highlight
- **Monthly notes** — tied to each month, persisted in `localStorage`, auto-loaded on refresh
- **Animated month transitions** — page-flip style animation with framer-motion
- **Parallax hero image** — subtle scroll parallax on the monthly photo
- **Holiday markers** — mock US holiday data with amber dot indicators
- **Today highlight** — ring indicator on the current date
- **Dark / Light mode** — toggle with smooth transition, preference saved to `localStorage`
- **Skeleton loading** — shimmer placeholders while the calendar transitions
- **Click ripple effect** — material-style ripple on date selection
- **Responsive layout** — desktop (3-col), tablet (compressed), mobile (stacked)
- **Glassmorphism UI** — backdrop blur, soft shadows, subtle gradients throughout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Date logic | date-fns |
| Icons | Lucide React |
| Fonts | Inter + Playfair Display (Google Fonts) |
| State | React hooks only (no Redux) |
| Persistence | localStorage |

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

### Production build

```bash
npm run build
npm start
```

---

## Project Structure

```
/app
  layout.tsx        # Root layout with font setup + metadata
  page.tsx          # Entry point
  globals.css       # Tailwind base + custom keyframes

/components
  Calendar.tsx      # Main orchestrator — layout, hero image, spiral binding
  CalendarGrid.tsx  # Animated grid with page-flip transition + skeleton
  DayCell.tsx       # Individual day button — range logic, ripple, holiday dot
  NotesPanel.tsx    # Paper-lined notes with localStorage persistence
  Header.tsx        # Month nav, dark toggle, range badge

/hooks
  useDateRange.ts   # Date range selection state + hover preview
  useLocalStorage.ts # SSR-safe localStorage hook with hydration guard

/utils
  dateHelpers.ts    # date-fns wrappers — calendar grid, range checks, holidays
  cn.ts             # clsx + tailwind-merge utility
```

---

## Screenshots

> _Add screenshots here after running the app_

| Light Mode | Dark Mode |
|---|---|
| ![Light]() | ![Dark]() |

---

## License

MIT
