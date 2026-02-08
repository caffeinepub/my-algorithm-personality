# Specification

## Summary
**Goal:** Enhance the Patterns Dashboard with additional explainable insights, auto-adapt the personalized 30‑day program based on those insights, and refresh the UI to a more polished, high-impact feel while keeping the existing navigation and warm-neutral palette.

**Planned changes:**
- Add three new visual analytics sections to the existing Patterns Dashboard: Emotional trends over time, Spending/Shopping triggers over time, and Morning vs Night pattern distribution, all driven by the existing 7/30 day selector and including section-level empty states when data is insufficient.
- Implement deterministic, transparent dashboard-side insight calculations based on existing stored Patterns (and where needed, recent Activity Entries), exposed in a reusable way for the dashboard UI while keeping the current top-level dashboard summary unchanged.
- Regenerate the user’s personalized 30‑day program automatically when new/updated patterns materially change insight signals, while preserving already-recorded daily check-ins and doing nothing if there is no active program.
- Update layout/design for more editorial hierarchy (typography, spacing, section headers) and add subtle CSS/Tailwind motion (hover/transition/reveal/tab transitions) while staying mobile-friendly, English-only, warm-neutral (no blue/purple), and without changing core navigation/features.
- Update existing generated hero/background and logo imagery to better match the new high-impact design direction while keeping the same asset paths/filenames referenced by the app.

**User-visible outcome:** The dashboard shows new insight sections that respond to the Last 7/Last 30 toggle, the 30‑day program updates itself when patterns meaningfully change (without losing past check-ins), and the app feels more premium and dynamic while retaining the same navigation and warm-neutral look.
