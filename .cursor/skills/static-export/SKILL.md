---
name: static-export
description: >-
  Respect Next.js static export constraints for S3/CloudFront hosting.
---

# Static Export

Read `docs/ARCHITECTURE.md`.

- `output: 'export'` must keep working
- No request-time server features on the static host
- `images.unoptimized: true`
- Validate with `make build`
