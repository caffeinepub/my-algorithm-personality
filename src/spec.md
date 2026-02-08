# Specification

## Summary
**Goal:** Build an MVP that lets signed-in users submit online-activity text (and optional image attachments), detect multiple behavioral patterns with transparent heuristics, and generate a personalized 30-day habit program with daily check-ins and a patterns dashboard.

**Planned changes:**
- Add Internet Identity sign-in and per-user data scoping.
- Create an entry flow to paste activity text, choose a source label, add optional notes, attach one or more images, and persist entries with timestamps.
- Implement entry list + entry detail views, including attached images and stored analysis results.
- Implement on-device/app-side heuristic pattern detection for at least: shopping/spending triggers, emotional tone signals, time-of-day hints, screen-time/scrolling cues, and feedback-loop/addiction language; save patterns with confidence and supporting snippets.
- Add a structured, seeded “Atomic Habit Library” browsable by category (≥7 categories, ≥6 habits each, ≥30 total) with: tiny action, cue, duration, difficulty, and practical rationale.
- Generate a personalized 30-day program from detected patterns and the habit library (one daily micro-task + optional reflection prompt + “why this today” linking to patterns), and provide a program calendar/list with day details.
- Implement daily check-ins for the active program (done/not done, mood 1–5, optional note, reduced/avoided targeted behavior), editable same day, with persisted progress and simple metrics (streak, completion rate, mood trend).
- Create a Patterns Dashboard summarizing top patterns over a selectable window (last 7 vs last 30 entries), showing common snippets/keywords and cross-linking to related entries and program days/tasks.
- Apply a cohesive calm, presence-oriented UI theme (warm neutrals/earth tones; avoid blue/purple), minimal navigation for the 4 core actions (Add Entry, Patterns, Program, Today/Check-in), and a short first-use onboarding clarifying MVP limitations (text-based analysis; images stored only).
- Add minimal brand/static imagery (logo + subtle hero/background) as frontend static assets and use them in the app shell/onboarding/landing.

**User-visible outcome:** A user can sign in, paste their online-activity text (optionally attach screenshots), see automatically detected pattern insights, generate a personalized 30-day micro-habit plan, complete daily check-ins with progress tracking, and review a dashboard that ties recurring patterns to entries and program tasks.
