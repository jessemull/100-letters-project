---
name: testing
description: >-
  Add or fix Jest/Testing Library/Cypress tests for the 100 Letters Project client.
---

# Testing

Read `docs/TESTING.md`.

- Prefer behavior tests; use Fishery factories
- Keep ≥80% coverage
- Use jest-axe for a11y-sensitive UI
- Polyfills in `jest.setup.ts`
- Commands: `make test`, `npm run test:watch`, `make e2e`
