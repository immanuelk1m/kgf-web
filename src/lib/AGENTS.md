<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-12 | Updated: 2026-05-12 -->

# lib

## Purpose
Shared utility module directory for small cross-cutting helpers used by components and UI primitives.

## Key Files
| File | Description |
|------|-------------|
| `utils.ts` | Exports `cn()`, a class-name helper combining `clsx` with `tailwind-merge`. |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| _None_ | This directory has no child directories. |

## For AI Agents

### Working In This Directory
- Keep helpers small, framework-compatible, and free of browser-only side effects unless clearly named and isolated.
- Avoid adding broad utility layers unless multiple call sites need them.
- Preserve the `@/lib/utils` import path expected by shadcn-style components.

### Testing Requirements
- Run `npm run lint` and `npm run build` after utility changes.
- Add targeted tests if behavior becomes more complex than simple class-name composition.

### Common Patterns
- `cn(...inputs)` accepts `ClassValue[]`, passes them through `clsx`, then resolves Tailwind conflicts with `twMerge`.

## Dependencies

### Internal
- Used by `src/components/ui/` primitives.

### External
- `clsx` for conditional class values.
- `tailwind-merge` for resolving conflicting Tailwind classes.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
