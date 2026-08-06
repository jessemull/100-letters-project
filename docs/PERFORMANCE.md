# Performance

> **AI agents — read this file when:** investigating slow UI, bundle size, or Lighthouse regressions.

---

## Targets

Lighthouse CI (`.lighthouserc.js`):

| Category       | Minimum score |
| -------------- | ------------- |
| Performance    | ≥ 0.8         |
| Accessibility  | ≥ 0.9         |
| SEO            | ≥ 0.9         |
| Best practices | ≥ 0.9         |

Merge/deploy workflows may **rollback** on Lighthouse failure after deploy.

---

## Practices

- Prefer static export–friendly patterns; avoid shipping unused client JS.
- Lazy-load heavy admin/media UI when practical.
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
