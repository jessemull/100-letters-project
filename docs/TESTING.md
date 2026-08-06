# Testing

> **AI agents — read this file when:** adding tests, changing coverage, or choosing what to test.

---

## Goals

Tests build **confidence** and catch regressions. Prefer behavior over implementation details.

---

## Stack

| Layer             | Tool                            |
| ----------------- | ------------------------------- |
| Unit / component  | Jest + Testing Library          |
| A11y              | jest-axe (established patterns) |
| E2E               | Cypress (`cypress/`)            |
| Perf / a11y smoke | Lighthouse CI                   |

Coverage: **`npm test`** (Jest `--coverage`) must meet **≥ 80%** branches/functions/lines/statements as enforced in `jest.config.js` and CI.

---

## What to test

- Auth / protected-route behavior (with Cognito mocked)
- Forms (validation, submit success/error) and contact/admin flows
- Feed / correspondence / category rendering from fixtures or factories
- Hooks (`useSWRQuery`, mutations) with mocked fetch
- Shared components (Header, Footer, Form controls, skeletons)
- Utils and factories

## What not to overtest

- Third-party library internals (Sentry, Cognito SDK, Framer Motion timelines)
- Pure Tailwind class strings unless they encode behavior
- Pixel-perfect animation frames

---

## Conventions

- Colocate `*.test.tsx` / `*.test.ts` next to sources (existing pattern).
- Use Fishery factories under `src/factories/` for domain objects.
- Polyfills and Testing Library setup belong in `jest.setup.ts`.
- Prefer `userEvent` for interactions; assert accessible names where possible.
- Extend jest-axe where UI a11y matters.

---

## Commands

```bash
make test          # or npm test
npm run test:watch
make e2e           # or npm run e2e
make lighthouse
```

Do **not** delete tests solely to raise coverage percentage. Do **not** lower the 80% threshold.
