# Security

> **AI agents — read this file when:** handling env vars, Cognito, proxy/cookies, analytics, or dependencies.

---

## Secrets

- Never commit `.env*`, PEM keys, CloudFront key pairs, Cognito machine passwords, or AWS access keys.
- Local proxy signing uses `CLOUDFRONT_*` env vars — fail closed on misconfig.
- CI secrets live in GitHub Actions; do not echo them in logs.
- Machine-user credentials (`COGNITO_USER_POOL_USERNAME` / `COGNITO_USER_POOL_PASSWORD`) are for build/scripts only — never ship them in the client bundle.

---

## Client surface

- Public config only via `NEXT_PUBLIC_*` (`NEXT_PUBLIC_API_URL`, Cognito pool/client IDs, GA, captcha site key, Sentry environment, Stripe URL).
- Do not embed private keys, refresh tokens, or admin passwords in source.
- Avoid logging tokens, passwords, or full PII to the console in production paths.

---

## Auth & CDN

- Client auth uses Cognito user pool IDs from env (`AuthProvider`).
- Test CDN is cookie-gated; production static assets are world-readable — assume HTML/JS are public.
- Edge authorizer / Lambda@Edge live in sibling repos; do not reimplement signing secrets in this client.

---

## Dependencies

- Run `make security` / `npm audit` when adding deps.
- Prefer well-maintained packages; justify new network/auth/analytics SDKs in the PR.
- Do **not** run `npm audit fix --force`.

---

## Sentry & analytics

- Sentry is configured via `@sentry/nextjs` — do not attach secrets to events.
- Google Analytics loads via `layout.tsx` (`NEXT_PUBLIC_GA_TRACKING_ID`) — treat measurement IDs as environment-specific, not secret.
- reCAPTCHA site key is public by design; keep the secret server-side (API sibling).
