# ADU Pulse UI/UX Overhaul — Integration Guide

## What's in this zip

### New components (add these):
- `src/components/NavBar.tsx` — Persistent horizontal nav (desktop) + hamburger slide-out (mobile)
- `src/components/Footer.tsx` — Consistent 4-column footer with proper sections

### Replaced pages (overwrite these):
- `src/app/page.tsx` — Homepage restructured as conversion funnel
- `src/app/builders/page.tsx` — Rewritten as sales page with pain-point hero, demand data, pricing math
- `src/app/club/page.tsx` — Updated with NavBar/Footer, clearer hero, savings breakdown

## How to integrate

1. Extract the zip at your project root (files are already in correct paths)
2. The old `TownNav` component is NOT deleted — other pages still import it. You can migrate them gradually:
   - Any page using `<TownNav current="X" />` in its own header can switch to `<NavBar current="X" />` and remove its manual `<header>` and `<footer>` blocks
   - Replace with: `<NavBar current="PageName" />` at top + `<Footer />` at bottom

## Pages still using old TownNav (need manual update):
- `/quiz` page
- `/estimate` page
- `/compare` page
- `/scorecards` page
- `/leaderboard` page
- `/blog` pages
- `/methodology` page
- `/towns/[slug]` town detail pages

For each: replace the `<header>...<TownNav>...</header>` block with just `<NavBar current="X" />` and replace the `<footer>` block with `<Footer />`.

## Key changes from the UI/UX analysis:
1. ✅ Persistent navigation (was: everything behind one dropdown)
2. ✅ Persona routing on homepage (Homeowner / Builder / Lender)
3. ✅ Builders page rewritten as sales page with demand data
4. ✅ Homepage restructured as funnel (not dashboard)
5. ✅ Search-first town finding
6. ✅ Footer aligned with header nav
7. ✅ Club page with clearer value prop and savings breakdown
