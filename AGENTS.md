<!-- Generated: 2026-05-12 | Updated: 2026-05-12 -->

# kgf-web

## Purpose
This repository is a Next.js 14 App Router web application for a KOSPI Fear & Greed Index dashboard. It combines static layout, Tailwind/shadcn-style UI primitives, client-side charting, and browser-side fetches to external market/index JSON APIs.

## Key Files
| File | Description |
|------|-------------|
| `README.md` | Minimal project title for the KGF/KOSPI Fear & Greed web app. |
| `package.json` | npm scripts and dependencies for Next.js, React, Tailwind, Recharts, amCharts, and shadcn UI utilities. |
| `package-lock.json` | Locked npm dependency graph; update with npm when dependency versions change. |
| `next.config.mjs` | Next.js configuration, currently using defaults. |
| `tailwind.config.ts` | Tailwind theme, content globs, CSS variable color tokens, and animation plugin setup. |
| `postcss.config.mjs` | PostCSS configuration enabling Tailwind processing. |
| `components.json` | shadcn/ui configuration and path aliases for components and utilities. |
| `tsconfig.json` | TypeScript configuration with strict mode and `@/*` mapped to `src/*`. |
| `.eslintrc.json` | Next.js core web vitals ESLint preset. |
| `.gitignore` | Ignores dependencies, build output, local env files, and generated Next.js artifacts. |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `public/` | Public static assets served from the site root (see `public/AGENTS.md`). |
| `src/` | Application source code, UI components, assets, and utilities (see `src/AGENTS.md`). |

## For AI Agents

### Working In This Directory
- Treat this as a Next.js App Router project; route-level code lives under `src/app/`.
- Prefer existing Tailwind utility patterns and the shadcn-style primitives in `src/components/ui/`.
- Keep dependency changes rare and deliberate; if `package.json` changes, update `package-lock.json` using npm.
- Use the `@/*` alias for source imports when following existing project style.
- Do not commit generated runtime directories such as `.next/`, `node_modules/`, or local `.omx/` state.

### Testing Requirements
- For source or config changes, run `npm run lint` and `npm run build` when feasible.
- There is no active unit-test setup for the Next.js app; `npm test` points to `react-scripts test` and should be treated as legacy until replaced.
- For UI/data-fetching changes, also smoke-check the relevant route in a browser or with a local Next.js build.

### Common Patterns
- Client-side interactive components begin with `'use client';`.
- Styling is primarily Tailwind classes plus CSS variables from `src/app/globals.css`.
- `cn()` from `src/lib/utils.ts` merges conditional classes for shared UI primitives.
- Dashboard data is currently fetched directly from browser-side external URLs.

## Dependencies

### Internal
- `src/app/` composes the page and global styles.
- `src/components/component/` contains dashboard-specific React components.
- `src/components/ui/` contains reusable shadcn-style primitives.
- `src/lib/` provides shared helpers.

### External
- Next.js 14 and React 18 for the application framework.
- Tailwind CSS and `tailwindcss-animate` for styling.
- Recharts and amCharts 4 for chart visualizations.
- Radix Slot, class-variance-authority, clsx, and tailwind-merge for UI primitives and class composition.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
