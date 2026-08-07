# AGENTS.md — 100 Letters Project Client

> Complete development rules and constraints for AI agents and human contributors.
> This file is the authoritative reference for coding standards. Precedence: see `CONTEXT.md`.

---

## Repository Overview

| Field                 | Value                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Project**           | 100 Letters Project client                                                                                 |
| **Architecture**      | Next.js App Router static site + Cognito auth + SWR data layer                                             |
| **Platform**          | Web (static hosting on S3 / CloudFront)                                                                    |
| **Core Technologies** | Next.js 16, React 19, TypeScript 6, Tailwind 4, SWR, Framer Motion, Cognito, Sentry, Headless UI (Node 24) |
| **CI/CD**             | GitHub Actions → S3 / CloudFront                                                                           |
| **Git Hooks**         | Husky + lint-staged + Conventional Commits (commitlint); pre-push runs preflight                           |

### Layout

```
100-letters-project/
├── src/
│   ├── app/                 # Routes: /, /about, /admin, /category, /contact, /correspondence, /forbidden, /login
│   ├── components/          # UI feature folders (About, Admin, Feed, Form, Header, Login, …)
│   ├── constants/           # Shared constants
│   ├── contexts/            # Auth, Correspondence, DesktopMenu, Search
│   ├── factories/           # Fishery test factories
│   ├── hooks/               # SWR and UI hooks
│   ├── types/
│   └── util/
├── scripts/                 # prebuild, cognito-token, bastion, source-maps, preflight
├── proxy/                   # Local CloudFront signed-cookie proxy
├── cloudformation/
├── cypress/
├── docs/                    # Governance documentation
├── .cursor/                 # Rules, skills, commands
├── .github/                 # Workflows
├── CONTEXT.md
├── AGENTS.md                # This file
└── Makefile
```

### Path aliases

Use these instead of deep relative imports:

| Alias           | Path               |
| --------------- | ------------------ |
| `@components/*` | `src/components/*` |
| `@constants/*`  | `src/constants/*`  |
| `@contexts/*`   | `src/contexts/*`   |
| `@factories/*`  | `src/factories/*`  |
| `@hooks/*`      | `src/hooks/*`      |
| `@pages/*`      | `src/app/*`        |
| `@public/*`     | `public/*`         |
| `@ts-types/*`   | `src/types/*`      |
| `@util/*`       | `src/util/*`       |

---

## Development Commands

Prefer **`make`** targets (see `make help`). Equivalents use npm.

### Setup

| Command           | Description          |
| ----------------- | -------------------- |
| `npm install`     | Install dependencies |
| `npm run prepare` | Install Husky hooks  |

### Quality

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `make lint`       | ESLint / `next lint` with `--fix` |
| `make typecheck`  | `tsc --noEmit`                    |
| `make format`     | Prettier write                    |
| `make test`       | Jest with coverage                |
| `make build`      | Next.js static export build       |
| `make preflight`  | lint + typecheck + test + build   |
| `make security`   | `npm audit`                       |
| `make e2e`        | Cypress                           |
| `make lighthouse` | LHCI                              |

### Local

| Command                    | Description                                   |
| -------------------------- | --------------------------------------------- |
| `npm run dev` / `make dev` | Next.js dev server (runs `predev` → prebuild) |
| `npm run proxy`            | Signed-cookie proxy for test CDN (`:8080`)    |
| `npm run bastion`          | SSH to bastion                                |
| `npm run token`            | Cognito access token helper                   |

---

## Language & Framework Rules

### TypeScript

- Keep `strict: true` and existing `moduleResolution`.
- Prefer explicit types on exported APIs; avoid `any`.
- Use path aliases from `tsconfig.json`.

### React / Next.js

- Mark client components with `'use client'` only when needed (hooks, browser APIs, Framer Motion, Cognito).
- Pages under `src/app/` should stay thin — compose feature components under `src/components/`.
- Respect static export: no features that require a Node server at runtime on S3/CloudFront.

### Comments

Follow `docs/COMMENTS.md`. Prefer self-documenting names; comments explain **why**.

---

## Architecture Rules

### Layers

- **Routes** (`src/app`) → **feature components** → **hooks / contexts / util / constants**.
- Shared form/chrome: prefer `Form`, `Header`, `Footer`, `Protected`, `Skeleton`.
- Auth state: `AuthProvider` / Cognito — see `docs/ARCHITECTURE.md` and `docs/SECURITY.md`.

### Data

- Runtime API access via SWR hooks and `NEXT_PUBLIC_API_URL`.
- Build-time snapshots via `scripts/prebuild.js` → `public/data/`.
- Do not hardcode environment API hosts; use env / constants.

### State

- Shared app state via existing React contexts under `src/contexts/`.
- Local `useState` is fine for UI-only state.
- No Redux/Zustand/MobX without governance approval.

---

## Testing Rules

- Unit/component: Jest + Testing Library; accessibility: jest-axe where established.
- Coverage gate: **80%** (CI and local `npm test`).
- E2E: Cypress (`npm run e2e`).
- Prefer testing user-visible behavior and edge cases over implementation details.
- Do not remove tests solely to raise coverage percentage.

See `docs/TESTING.md`.

---

## Performance Rules

- Respect Lighthouse CI thresholds (perf ≥ 0.8; a11y/seo/best-practices ≥ 0.9).
- Watch bundle size (`ENABLE_ANALYZER=true` when investigating).
- Lighthouse regressions on merge can trigger rollback — see `docs/CI_CD.md` / `docs/PERFORMANCE.md`.

---

## Security Rules

- Secrets only in env / CI / local `.env*` (gitignored).
- Never commit CloudFront private keys, Cognito machine passwords, or AWS keys.
- Do not log tokens, passwords, or PII to third parties beyond existing Sentry/GA configuration without review.

See `docs/SECURITY.md`.

---

## Git & PR Rules

- Conventional Commits via commitlint; prefer `npm run commit` (Commitizen).
- Pre-commit: lint-staged. Commit-msg: commitlint. Pre-push: `./scripts/preflight.sh`.
- Review severity tiers: `docs/REVIEW.md` (MUST / SHOULD / NICE).

---

## Forbidden Patterns

- Adding server-only Next features incompatible with `output: 'export'`
- Hardcoded API keys, Cognito secrets, or cookie-signing material
- Lowering coverage thresholds or disabling Husky/commitlint to bypass gates
- Importing sibling API / Lambda / Authorizer repos as local packages without an explicit dependency decision
- Adding LLM SDKs or new global state libraries without product approval

---

## When stuck

1. Re-read `CONTEXT.md` precedence.
2. Check domain docs (`NETWORKING.md`, `SECURITY.md`, etc.).
3. Run `make preflight` and fix failures before expanding scope.
4. Flag product/architecture decisions for human review per `docs/GOVERNANCE.md`.
