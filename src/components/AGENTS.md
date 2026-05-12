<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-12 | Updated: 2026-05-12 -->

# components

## Purpose
React component root split between dashboard-specific components and reusable shadcn-style UI primitives.

## Key Files
| File | Description |
|------|-------------|
| _None_ | This directory currently contains only subdirectories. |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `component/` | Dashboard feature components for KOSPI market data, gauges, charts, header, and support UI (see `component/AGENTS.md`). |
| `ui/` | Reusable UI primitives and chart helpers following shadcn conventions (see `ui/AGENTS.md`). |

## For AI Agents

### Working In This Directory
- Put product/dashboard-specific components in `component/`.
- Put generic reusable primitives in `ui/` and keep them free of product-specific data fetching.
- Preserve existing import style with `@/components/...` and `@/lib/utils`.

### Testing Requirements
- Run lint/build after component changes.
- Manually verify responsive behavior because many components rely on Tailwind breakpoint classes.

### Common Patterns
- Feature components that fetch data or use hooks are client components.
- UI primitives use `React.forwardRef`, `cn()`, and variant utilities where appropriate.

## Dependencies

### Internal
- Uses `src/lib/utils.ts` for class composition in UI primitives.
- Feature components are composed by `src/app/page.tsx`.

### External
- React, Recharts, amCharts, Radix Slot, class-variance-authority, and Tailwind utility packages.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
