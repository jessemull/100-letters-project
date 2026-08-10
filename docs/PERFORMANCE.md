# Performance

> **AI agents — read this file when:** investigating slow UI, bundle size, or Lighthouse regressions.

---

## Targets

Lighthouse CI (`.lighthouserc.js`):

| Category       | Minimum score | CI assert                                             |
| -------------- | ------------- | ----------------------------------------------------- |
| Performance    | ≥ 0.5         | **error** (catastrophic floor; merge/deploy rollback) |
| Accessibility  | ≥ 0.9         | error                                                 |
| SEO            | ≥ 0.9         | error                                                 |
| Best practices | ≥ 0.9         | error                                                 |

Merge/deploy auto-rollback restores the pre-deploy S3 backup when **E2E or Lighthouse** fails after deploy. PR Lighthouse stays `continue-on-error`. Prefer measuring against a static `out/` build (or the proxy CDN) in an extension-free/incognito profile — `next dev` scores are not representative. Local target remains aiming well above the 0.5 CI floor (typically mid-80s+ on mobile).

---

## Practices

- Prefer static export–friendly patterns; avoid shipping unused client JS.
- Lazy-load heavy admin/media UI when practical.
- Defer Fuse/search index work until the user focuses search.
- Prefer `urlThumbnail` / medium assets for feed cards; keep `_large` for detail views.
- Investigate bundles with `ENABLE_ANALYZER=true`.
- Images stay unoptimized for export — size assets appropriately in `public/`.
- Watch list virtualization / pagination for large correspondence feeds.

---

## Commands

```bash
make build
make lighthouse
ENABLE_ANALYZER=true npm run build
```
