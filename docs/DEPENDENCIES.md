# Dependencies

> **AI agents — read this file when:** adding, removing, or upgrading npm packages.

---

## Principles

- Prefer packages already in the tree (Next, React, SWR, Cognito, Sentry, Testing Library, Tailwind).
- New runtime dependencies need a clear problem statement in the PR.
- Prefer official / widely used libraries for AWS, auth, and a11y.
- Stay on the latest major/minor that the toolchain supports; document intentional holds below.
- Prefer upgrading the **blocking constraint** (CI Node pin, CloudFormation runtime, peers) over freezing a package at an old major.

---

## Process

1. Check whether an existing dependency already solves the need.
2. Add with an exact or caret range consistent with the repo.
3. Run `make preflight` (lint + typecheck + test + build).
4. Run `make security` / `npm audit` and note residual risk.
5. Document notable upgrades in the PR body / this holds table.

---

## Runtime / CI pins

| Pin            | Value            | Notes                                                                                |
| -------------- | ---------------- | ------------------------------------------------------------------------------------ |
| Node           | **26** (Current) | `.nvmrc`, `engines.node`, GitHub Actions `setup-node`                                |
| GitHub Actions | latest majors    | `actions/checkout@v7`, `setup-node@v7`, `upload-artifact@v7`, `download-artifact@v8` |

This repo’s CloudFormation stack is S3/CloudFront/Route 53 only (no Lambda `nodejs*` runtime).

---

## Intentional version holds

| Package               | Held at   | Latest blocked | Why                                                                                              |
| --------------------- | --------- | -------------- | ------------------------------------------------------------------------------------------------ |
| `eslint`              | `^9.39.5` | 10.x           | `eslint-plugin-jsx-a11y` / `eslint-plugin-react` (via `eslint-config-next`) peer-cap at ESLint 9 |
| `typescript`          | `^6.0.3`  | 7.x            | `typescript-eslint` (via `eslint-config-next`) peers `>=4.8.4 <6.1.0`                            |
| `lighthouse` (direct) | `^12.8.2` | 13.x           | `@lhci/cli@0.15` pins `lighthouse@12.6.1`; keep major aligned with LHCI                          |

Do **not** run `npm audit fix --force` — it may downgrade tooling (e.g. `@lhci/cli`) to ancient versions.

Residual audit findings are mostly transitive via `@lhci/cli` (e.g. nested `uuid`, high-severity `tmp`). Prefer upgrading LHCI when a compatible release lands.

---

## Discouraged without product approval

- LLM provider SDKs in this client
- New global state managers (Redux, Zustand, MobX)
- Heavy UI kits that duplicate Tailwind + Headless UI + lucide

---

## Notes

- Next **16** + Tailwind **4** + React **19** + Jest **30** + Husky **9**.
- Factories use `crypto.randomUUID()` (no direct `uuid` dependency).
- `@faker-js/faker` v10 is ESM; Jest transforms it via `transformIgnorePatterns`.
- Some `eslint-plugin-react-hooks` v7 Compiler rules remain off in `eslint.config.mjs` pending gradual enablement.

---

## Automation

Review Dependabot / manual bumps carefully for breaking Next/ESLint/Tailwind majors.
