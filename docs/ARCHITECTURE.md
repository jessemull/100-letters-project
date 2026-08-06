# Architecture

> **Precedence:** CONTEXT.md > GOVERNANCE.md > **ARCHITECTURE.md** > feature docs.
>
> **AI agents — read this file when:** adding modules, changing data flow, or placing new files.

---

## System shape

This repository is the **Next.js static client** for the 100 Letters Project.

```
Cognito (machine user) ──prebuild──► public/data/*.json
                                           │
                                    next build (export)
                                           ▼
                                      out/ → S3
                                           │
                                      CloudFront
                                           │
                    Browser ── Cognito / cookies ──► protected HTML
                    Browser ── SWR ──► NEXT_PUBLIC_API_URL (API sibling)
```

Companion systems (separate repos): **API**, **Lambda@Edge**, **Authorizer**.

Static HTML/JS/CSS is exported by Next.js and hosted on **S3 + CloudFront**.

---

## Folder responsibilities

| Path              | Responsibility                                                    |
| ----------------- | ----------------------------------------------------------------- |
| `src/app/`        | Route entrypoints, root layout (metadata, GA, providers), globals |
| `src/components/` | Feature UI (Feed, Correspondence, Admin, Form, Header, Login, …)  |
| `src/contexts/`   | Auth, Correspondence, DesktopMenu, Search providers               |
| `src/hooks/`      | SWR helpers and UI hooks                                          |
| `src/constants/`  | Shared constants                                                  |
| `src/factories/`  | Fishery factories for tests                                       |
| `src/types/`      | Shared TypeScript types                                           |
| `src/util/`       | Pure helpers                                                      |
| `scripts/`        | prebuild, cognito-token, bastion, source-maps, preflight          |
| `proxy/`          | Local signed-cookie CDN proxy for test environment                |
| `cloudformation/` | S3 / CloudFront / Route 53 stack                                  |
| `cypress/`        | E2E specs                                                         |

---

## Dependency direction

```
app routes → feature components → hooks / contexts / util / constants / types
```

- Feature components may import shared Form/Header/Footer/Protected pieces, hooks, contexts, constants.
- Contexts must not import heavy page UI.
- Constants and util must not import React components.

---

## Client vs static constraints

- Prefer `'use client'` only where hooks, browser APIs, Cognito, or animation require it.
- Do not introduce Route Handlers or server actions that the static host cannot run.
- Images remain unoptimized for export compatibility (`images.unoptimized: true`).
- Runtime secrets must not appear in the client bundle; use `NEXT_PUBLIC_*` only for intentionally public config.

---

## Auth & protection

- Client Cognito session: `AuthProvider` + `amazon-cognito-identity-js`.
- Admin / protected routes use client guards (`Protected`) plus edge authorizer behavior from sibling repos.
- Test CDN access uses CloudFront signed cookies; local verification via `npm run proxy`.

---

## Fail signals

- New files that bypass path aliases with deep `../../../` imports
- Fetch URLs hardcoding prod/test hosts instead of env
- Server-only Next APIs that break `output: 'export'`
- Duplicating Header/Footer/Form shells instead of shared components
