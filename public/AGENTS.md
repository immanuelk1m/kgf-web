<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-12 | Updated: 2026-05-12 -->

# public

## Purpose
Static public assets served directly by Next.js from the site root. Files here are available by URL path without being imported through the TypeScript module graph.

## Key Files
| File | Description |
|------|-------------|
| `next.svg` | Default Next.js logo SVG asset. |
| `vercel.svg` | Default Vercel logo SVG asset. |
| `placeholder.svg` | Generic placeholder SVG asset for UI/image fallback use. |
| `og-image.jpg` | 1200×675 JPEG likely intended for social sharing/Open Graph previews. |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| _None_ | This directory has no child directories. |

## For AI Agents

### Working In This Directory
- Use this directory for assets that need stable public URL paths.
- Keep filenames URL-safe and update metadata or references if renaming assets.
- Prefer optimized dimensions and compressed images because assets here are served as static files.

### Testing Requirements
- Verify referenced assets resolve in the browser or via a production build.
- For image replacements, confirm dimensions/aspect ratio still match the consuming UI or metadata.

### Common Patterns
- Public assets are referenced as `/filename.ext` instead of imported from source code.

## Dependencies

### Internal
- May be referenced by route metadata or components under `src/app/` and `src/components/`.

### External
- Served by Next.js static asset handling.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
