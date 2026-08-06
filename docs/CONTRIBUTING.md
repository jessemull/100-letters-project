# Contributing

> **AI agents — read this file when:** opening PRs, setting up a worktree, or explaining the contributor flow.

---

## Setup

```bash
npm install
# Configure .env.test / .env.production per README (Cognito, API, CloudFront, etc.)
make dev
```

Hooks install via `npm prepare` (Husky). Use `npm run commit` for Commitizen prompts.

Human ops (bastion, proxy cookies, Cognito token helper, source maps) are documented in `README.md`.

---

## Branching & commits

- Branch from `main`.
- Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`).
- Pre-commit runs lint-staged; commit-msg runs commitlint; pre-push runs `./scripts/preflight.sh`.

---

## Pull requests

1. Keep the change focused; describe What / Why / Testing.
2. Pre-push runs preflight; keep it green before opening the PR.
3. Link issues if any.
4. Expect review per `docs/REVIEW.md`.

Governance-only PRs: prefix title with `[governance]`.

---

## Code style

- ESLint + Prettier (`make lint` / `make format`).
- Prefer shared Form/Header/Footer/Protected components.
- Tests for behavior changes (`docs/TESTING.md`).

---

## Where to read next

Start at `CONTEXT.md` → `AGENTS.md` → relevant `docs/*`.
