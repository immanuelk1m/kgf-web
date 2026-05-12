<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-12 | Updated: 2026-05-12 -->

# ui

## Purpose
Reusable UI primitives and chart helper components, following shadcn/ui conventions with Tailwind classes, `React.forwardRef`, and shared class-name merging.

## Key Files
| File | Description |
|------|-------------|
| `button.tsx` | Button primitive with class-variance-authority variants and optional Radix `Slot` rendering via `asChild`. |
| `card.tsx` | Card, header, title, description, content, and footer primitives. |
| `chart.tsx` | Recharts wrapper utilities for chart containers, generated CSS variables, tooltips, and legends. |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| _None_ | This directory has no child directories. |

## For AI Agents

### Working In This Directory
- Keep primitives generic; do not add dashboard-specific data fetching or business text here.
- Preserve `forwardRef` display names and exported component names because consumers may rely on them.
- Use `cn()` from `src/lib/utils.ts` for class-name composition.
- When adding shadcn components, align with `components.json` aliases and Tailwind CSS variable theme tokens.

### Testing Requirements
- Run `npm run lint` and `npm run build` after modifying primitives or exported types.
- Check any consuming dashboard components for visual regressions after style/variant changes.

### Common Patterns
- Variant styling uses `class-variance-authority`.
- Recharts helpers use React context to map payload keys to display configuration.
- Theme-aware chart colors are injected through generated CSS under `[data-chart=...]` selectors.

## Dependencies

### Internal
- Depends on `src/lib/utils.ts` for `cn()`.
- Consumed by dashboard components under `src/components/component/`.

### External
- React, Radix Slot, class-variance-authority, Recharts, clsx, and tailwind-merge.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
