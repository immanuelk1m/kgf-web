<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-12 | Updated: 2026-05-12 -->

# component

## Purpose
Dashboard-specific client components for the KOSPI Fear & Greed Index experience, including market data, the gauge visualization, historical comparisons, a collapsible header/ad space, and a coffee support CTA.

## Key Files
| File | Description |
|------|-------------|
| `header.tsx` | Client header/ad container that shrinks from 320px as the user scrolls. |
| `markettab.tsx` | Client market summary panel fetching KOSPI, KOSDAQ, KRW/USD, and Fear & Greed data. |
| `gauge.tsx` | Client amCharts gauge rendering the current Fear & Greed score and sentiment bands. |
| `prev.tsx` | Client list of previous Fear & Greed index values and Korean status labels. |
| `kospivsindex.tsx` | Client Recharts line chart comparing recent KOSPI and Fear & Greed index data. |
| `buycoff.tsx` | Coffee support button that opens a popup with a KakaoPay-related image. |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| _None_ | This directory has no child directories. |

## For AI Agents

### Working In This Directory
- Keep `'use client';` on components that use hooks, `window`, timers, chart libraries, or browser-side fetches.
- Be careful with external URLs: several components depend on GitHub Pages/raw GitHub JSON and Yahoo Finance through a CORS proxy.
- Clean up timers, event listeners, and chart instances in `useEffect` cleanup functions.
- Avoid moving product-specific fetch logic into `src/components/ui/`.

### Testing Requirements
- Run `npm run lint` and `npm run build` after TypeScript/component changes.
- Smoke-test the dashboard in a browser when changing chart setup, fetch parsing, or responsive layout.
- Confirm client-only libraries such as amCharts are not imported into server-only files.

### Common Patterns
- Data fetching happens in `useEffect` and writes to React state.
- Korean market labels and sentiment labels are rendered directly in component UI.
- Charts use fixed domains and recent slices of externally fetched data.

## Dependencies

### Internal
- `markettab.tsx` imports `BuyCoffee` from this directory.
- `buycoff.tsx` imports `Button` from `src/components/ui/button.tsx`.
- `src/app/page.tsx` composes all dashboard components.

### External
- `@amcharts/amcharts4` for the gauge chart.
- `recharts` for the line chart.
- Browser `fetch`, `window.open`, scroll events, and timers.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
