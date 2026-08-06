---
name: push-validation
description: >-
  Validate branch before push using preflight and git checks.
---

# Push Validation

Husky `.husky/pre-push` runs `./scripts/preflight.sh` automatically on push. You can still run it early:

```bash
make preflight
git status
```

Ensure hooks would pass; no secrets staged. Do not push unless user asks. Do not use `--no-verify` / `HUSKY=0` unless the user explicitly requests it.
