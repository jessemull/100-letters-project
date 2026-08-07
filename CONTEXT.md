# CONTEXT.md — 100 Letters Project Client

> **This is the PRIMARY entry point for ALL AI agents working in this repository.**
> Read this file first. Follow the mandatory reading order below before making any changes.

---

## Mandatory Reading Order

Every agent MUST read the following documents **in order** before making any change:

1. **`CONTEXT.md`** (this file) — loading order, source-of-truth precedence, non-negotiable constraints, quality gates
2. **`AGENTS.md`** — complete development rules, architecture constraints, coding standards, and forbidden patterns
3. **`docs/GOVERNANCE.md`** — contribution workflow, PR process, review policy, release process
4. **`docs/ARCHITECTURE.md`** — system design, folder structure, data flow
5. **`docs/TESTING.md`** — testing strategy, coverage requirements, a11y testing
6. **`docs/COMMENTS.md`** — comment policy and documentation standards
7. **`docs/SECURITY.md`** — security policy, secret management
8. **`docs/DEPENDENCIES.md`** — dependency management
9. **`docs/RELEASES.md`** — release and deploy process
10. **`docs/CI_CD.md`** — CI workflows and quality gates

Read items 5–10 on every task. Do not skip them because the work “seems unrelated”; agents cannot know upfront which rules will apply.

Domain docs to load when the task touches that area: `docs/NETWORKING.md`, `docs/ERROR_HANDLING.md`, `docs/PERFORMANCE.md`, `docs/ACCESSIBILITY.md`, `docs/ANALYTICS.md`, `docs/CONTRIBUTING.md`.

For PR or repo reviews, also read **`docs/REVIEW.md`**.

---

## Source-of-Truth Precedence

When instructions conflict, the **higher-ranked source wins**:

| Priority    | Source                                      | Scope                                         |
| ----------- | ------------------------------------------- | --------------------------------------------- |
| 1 (highest) | `CONTEXT.md`                                | Repository-wide constraints and quality gates |
| 2           | `docs/GOVERNANCE.md`                        | Contribution workflow and review policy       |
| 3           | `docs/ARCHITECTURE.md`                      | System design and module boundaries           |
| 4           | Feature/domain docs (`NETWORKING.md`, etc.) | Domain-specific rules                         |
| 5 (lowest)  | Inline code comments                        | Local implementation notes                    |

**Lower-precedence instructions MUST NOT contradict higher-precedence instructions.** If a conflict is detected, flag it for human review and follow the higher-precedence source.

---

## Non-Negotiable Constraints

These constraints apply to **every change**. No exceptions without explicit human approval.

### Platform & build

- **Static export only**: `output: 'export'` in Next.js config. No server-only Next.js APIs that break static export (no Route Handlers that must run at request time on this host, no `getServerSideProps`, no Node-only APIs in client bundles).
- **Images**: `images.unoptimized: true` — do not assume Next image optimization CDN.
- **Build-time data**: `scripts/prebuild.js` fetches API data into `public/data/` before build. Do not assume a Node server at runtime on S3/CloudFront.

### Type safety & quality

- **TypeScript `strict: true`** — do not weaken compiler options.
- **No blanket `any`** — prefer typed APIs and narrow, justified assertions.
- **≥ 80% Jest coverage** — do not lower the threshold; do not delete tests to greenwash coverage.
- **Conventional Commits** — enforced by commitlint + Husky.

### Secrets & boundaries

- **No hardcoded secrets** — env vars / CI secrets only (Cognito, CloudFront keys, AWS, Sentry tokens).
- **No new LLM SDKs or global state managers** (Redux/Zustand) without a product decision.
- Cognito client auth and CloudFront cookie signing stay in their established paths (`AuthProvider`, `proxy/`). Do not invent parallel secret channels.

### Product & UI

- Prefer existing shared chrome (`Header`, `Footer`, `Form`, `Protected`) over copy-pasted shells.
- Sibling repos (API, Lambda@Edge, Authorizer) are out of tree — do not import them as local packages without an explicit dependency decision.

---

## Quality Gates

Before considering work complete, agents MUST ensure:

| Gate                  | Command                                      |
| --------------------- | -------------------------------------------- |
| Lint (auto-fix)       | `make lint` or `npm run lint`                |
| Typecheck             | `make typecheck` or `npm run typecheck`      |
| Format                | `make format` or `npm run format`            |
| Unit tests + coverage | `make test` or `npm test`                    |
| Production build      | `make build` or `npm run build`              |
| Full preflight        | `make preflight` or `./scripts/preflight.sh` |

CI also runs Cypress e2e and Lighthouse on PRs/merges — see `docs/CI_CD.md`.

---

## Repository Identity

| Field             | Value                                                                         |
| ----------------- | ----------------------------------------------------------------------------- |
| **Project**       | 100 Letters Project — Next.js client                                          |
| **Stack**         | Next.js 16 App Router, React 19, TypeScript, Tailwind 4, SWR, Cognito, Sentry |
| **Hosting**       | Static export → S3 + CloudFront                                               |
| **Auth**          | Amazon Cognito (client) + Lambda@Edge / Authorizer (sibling repos)            |
| **Data**          | Build-time fetch into `public/data/`; runtime API via `NEXT_PUBLIC_API_URL`   |
| **Sibling repos** | API, Lambda@Edge, Authorizer (not in this tree)                               |

---

## Cursor / agent tooling

- Rules: `.cursor/rules/`
- Skills: `.cursor/skills/`
- Commands: `.cursor/commands/`
- Human ops detail remains in `README.md`; agent rules live in this governance chain.
