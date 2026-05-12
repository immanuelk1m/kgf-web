<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-12 | Updated: 2026-05-12 -->

# app

## Purpose
Next.js App Router directory for the root route, document layout, global styles, and favicon. The root page assembles the dashboard from client components under `src/components/component/`.

## Key Files
| File | Description |
|------|-------------|
| `layout.tsx` | Root HTML/body layout, Inter font setup, and default metadata. |
| `page.tsx` | Root dashboard page composing header, market data, gauge, history, and comparison chart components. |
| `globals.css` | Tailwind base/components/utilities plus CSS variable tokens for shadcn-style themes. |
| `favicon.ico` | Browser favicon for the application. |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| _None_ | This directory has no child directories. |

## For AI Agents

### Working In This Directory
- Keep route-level structure here and move reusable visual pieces to `src/components/`.
- `layout.tsx` is a server component by default; avoid adding browser APIs there unless converting deliberately.
- `page.tsx` currently imports client components and acts as the top-level dashboard composition.
- Coordinate Tailwind token changes in `globals.css` with `tailwind.config.ts` color definitions.

### Testing Requirements
- Run `npm run build` after route, metadata, or global CSS changes.
- Run `npm run lint` for TypeScript/React changes.
- Visually check the root route after layout or responsive class changes.

### Common Patterns
- Global theme values are CSS custom properties declared in `@layer base`.
- Page layout uses Tailwind responsive classes for mobile/desktop dashboard sections.

## Dependencies

### Internal
- Imports dashboard components from `src/components/component/`.
- Uses global Tailwind configuration from `tailwind.config.ts`.

### External
- Next.js metadata/layout APIs and `next/font/google`.
- React for page composition.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
