---
name: dependency-upgrade
description: >-
  Upgrade or add npm dependencies safely for the 100 Letters Project client.
---

# Dependency Upgrade

Read `docs/DEPENDENCIES.md`.

1. Justify the change
2. Install / bump (coherent groups: framework → plugins → lint/test → misc)
3. `make preflight` (lint + typecheck + test + build)
4. `make security`
5. Update intentional holds table; note breaking changes
6. Do **not** run `npm audit fix --force`
