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

| Package               | Held at | Latest blocked | Why                                                             |
| --------------------- | ------- | -------------- | --------------------------------------------------------------- |
| _(filled in Phase 2)_ | —       | —              | Re-validate peers after upgrades; do not cargo-cult other repos |

Do **not** run `npm audit fix --force` — it may downgrade tooling (e.g. `@lhci/cli`) to ancient versions.

---

## Discouraged without product approval

- LLM provider SDKs in this client
- New global state managers (Redux, Zustand, MobX)
- Heavy UI kits that duplicate Tailwind + Headless UI + lucide

---

## Automation

Review Dependabot / manual bumps carefully for breaking Next/ESLint/Tailwind majors.
