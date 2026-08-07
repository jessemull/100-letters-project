# Dependencies

> **AI agents — read this file when:** adding, removing, or upgrading npm packages.

---

## Principles

- Prefer packages already in the tree (Next, React, SWR, Cognito, Sentry, Testing Library, Tailwind).
- New runtime dependencies need a clear problem statement in the PR.
- Prefer official / widely used libraries for AWS, auth, and a11y.
- Stay on the latest major/minor that the toolchain supports; document intentional holds below.

---

## Process

1. Check whether an existing dependency already solves the need.
2. Add with an exact or caret range consistent with the repo.
3. Run `make preflight` (lint + typecheck + test + build).
4. Run `make security` / `npm audit` and note residual risk.
5. Document notable upgrades in the PR body / this holds table.

---

## Intentional version holds

| Package               | Held at   | Latest blocked | Why                                                                                                  |
| --------------------- | --------- | -------------- | ---------------------------------------------------------------------------------------------------- |
| `eslint`              | `^9.39.5` | 10.x           | `eslint-config-next` / `eslint-plugin-jsx-a11y` / `eslint-plugin-react` peer ranges stop at ESLint 9 |
| `typescript`          | `^5.9.3`  | 6.x / 7.x      | `typescript-eslint` (via `eslint-config-next`) peers `>=4.8.4 <6.1.0`                                |
| `lighthouse` (direct) | `^12.8.2` | 13.x           | `@lhci/cli@0.15` pins `lighthouse@12.x`; keep major aligned with LHCI                                |
| `express`             | `^4.21.2` | 5.x            | Local CloudFront cookie proxy; Express 5 is a breaking migration deferred intentionally              |
| `@faker-js/faker`     | `^9.9.0`  | 10.x           | Faker 10 ships ESM-only; Jest factories would need broader transformIgnorePatterns                   |

Do **not** run `npm audit fix --force` — it may downgrade tooling (e.g. `@lhci/cli`) to ancient versions.

Residual audit findings are mostly transitive (often via `@lhci/cli` / nested tooling). Prefer upgrading LHCI when a compatible release lands; do not force-resolve via `npm audit fix --force`.

---

## Discouraged without product approval

- LLM provider SDKs in this client
- New global state managers (Redux, Zustand, MobX)
- Heavy UI kits that duplicate Tailwind + Headless UI + lucide

---

## Notes from latest upgrade

- Next **16** + Tailwind **4** + ESLint **9** flat config + Jest **30** + Husky **9**.
- `eslint-plugin-react-hooks` v7 Compiler rules (`set-state-in-effect`, `refs`, etc.) are temporarily **off** in `eslint.config.mjs` so established patterns do not block the toolchain; enable gradually via review fixes.
- Jest transforms `uuid` (ESM) via `transformIgnorePatterns` in `jest.config.js`.

---

## Automation

Review Dependabot / manual bumps carefully for breaking Next/ESLint/Tailwind majors.
