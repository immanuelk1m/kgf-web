<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-12 | Updated: 2026-05-12 -->

# images

## Purpose
Source-controlled image assets that can be imported by application code or referenced during future UI work.

## Key Files
| File | Description |
|------|-------------|
| `coffee.jpg` | 750×749 JPEG coffee/support image asset. |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| _None_ | This directory has no child directories. |

## For AI Agents

### Working In This Directory
- Use this directory for images that should be imported through the source module graph.
- If an asset must be available by stable URL without import, place it in `public/` instead.
- Keep image sizes reasonable and update consuming imports when renaming files.

### Testing Requirements
- Verify image imports or references compile with `npm run build`.
- For visual replacements, check layout dimensions and aspect ratio in the consuming UI.

### Common Patterns
- Static images in `src/` are typically imported by React/Next.js modules rather than referenced by root-relative URLs.

## Dependencies

### Internal
- May be consumed by components under `src/components/` or routes under `src/app/`.

### External
- Next.js image/static asset handling when imported.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
