# Analytics

> **AI agents — read this file when:** changing measurement, GA, or layout third-party scripts.

---

## Current state

- Google Analytics (gtag) loads from `src/app/layout.tsx` using `NEXT_PUBLIC_GA_TRACKING_ID`.
- Sentry handles error/performance telemetry via `@sentry/nextjs`.

---

## Rules

- Do not add new analytics vendors without a product/privacy decision.
- Keep measurement IDs in env — do not hardcode production IDs in source.
- Do not send PII (names, emails, letter bodies, tokens) as event parameters.
