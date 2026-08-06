# Accessibility

> **AI agents — read this file when:** changing interactive UI, forms, menus, or a11y tests.

---

## Standards

- Follow `eslint-plugin-jsx-a11y` recommended rules (enforced in ESLint).
- Extend **jest-axe** where interactive UI is tested.
- Lighthouse accessibility score must stay ≥ **0.9** in CI assertions.

---

## Practices

- Every interactive control needs an accessible name (label, `aria-label`, or labelledby).
- Keyboard: menus, dialogs, and date pickers must be operable without a pointer.
- Do not “fix” a11y by adding visible chrome the product never had (extra selects, banners) without asking.
- Preserve focus management on route/modal open/close; suppress ugly default rings carefully without removing focus visibility entirely.

---

## Commands

```bash
make test
make lighthouse
make e2e
```
