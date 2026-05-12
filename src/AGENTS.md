<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-12 | Updated: 2026-05-12 -->

# src

## Purpose
Source root for the Next.js application. It contains App Router route files, dashboard components, source-controlled images, and shared utilities addressed through the `@/*` TypeScript path alias.

## Key Files
| File | Description |
|------|-------------|
| _None_ | This directory currently contains only subdirectories. |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `app/` | App Router layout, page, favicon, and global CSS (see `app/AGENTS.md`). |
| `components/` | Feature-specific dashboard components and reusable UI primitives (see `components/AGENTS.md`). |
| `images/` | Source-controlled image assets imported or reserved for application use (see `images/AGENTS.md`). |
| `lib/` | Shared utility functions (see `lib/AGENTS.md`). |

## For AI Agents

### Working In This Directory
- Respect the `@/*` alias: `@/components/...` maps to `src/components/...`.
- Keep route composition in `app/`, reusable UI in `components/`, and shared helpers in `lib/`.
- Add `'use client';` only to files that need browser APIs, hooks, or client-side interactivity.

### Testing Requirements
- Run `npm run lint` and `npm run build` after TypeScript, component, or styling changes when feasible.
- For browser-only behavior, verify hydration/client execution in a local Next.js run or production build.

### Common Patterns
- TypeScript React components use `.tsx`.
- Tailwind classes are the default styling mechanism.
- External market data is fetched in client components, not through server routes.

## Dependencies

### Internal
- Root config files define TypeScript, Tailwind, shadcn aliases, and build behavior.

### External
- Next.js App Router, React, Tailwind CSS, Recharts, amCharts, and shadcn-style utility packages.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
