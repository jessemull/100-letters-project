# Networking

> **AI agents — read this file when:** changing API calls, env URLs, proxy, or build-time data fetch.

---

## Runtime API

- Base URL: `NEXT_PUBLIC_API_URL` (required for client SWR hooks).
- Prefer existing `useSWRQuery` / `useSWRMutation` patterns in `src/hooks/`.
- Do not hardcode `onehundredletters.com` API hosts in components.

---

## Build-time data

- `scripts/prebuild.js` authenticates with the Cognito machine user and writes `public/data/*`.
- `predev` / `prebuild` npm scripts orchestrate this — keep them working for local and CI builds.

---

## Environments

| Env        | Site                                | Notes                          |
| ---------- | ----------------------------------- | ------------------------------ |
| Test       | `https://dev.onehundredletters.com` | Signed-cookie gated CDN        |
| Production | `https://onehundredletters.com`     | Public static + auth for admin |

---

## Local proxy

- `npm run proxy` — Express proxy with CloudFront signed cookies for test CDN (`CLOUDFRONT_*` env).
- Default local proxy port: **8080** (used by Cypress/LH against test).
- Do not commit private keys; support `CLOUDFRONT_PRIVATE_KEY` or `CLOUDFRONT_PRIVATE_KEY_PATH`.

---

## Auth headers

- Authenticated API calls use Cognito session tokens from `AuthProvider`.
- Never log Authorization headers.
