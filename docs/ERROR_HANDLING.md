# Error Handling

> **AI agents — read this file when:** changing fetch/SWR paths, form submit errors, or global error UI.

---

## Principles

- Fail visibly for users on actionable errors; fail safely for auth/token mistakes.
- Prefer existing toast / form error patterns (`react-hot-toast`, Form components) over ad-hoc alerts.
- Report unexpected exceptions to Sentry without attaching secrets.

---

## Layers

| Layer         | Pattern                                             |
| ------------- | --------------------------------------------------- |
| Global        | `src/app/global-error.tsx` + Sentry instrumentation |
| Data fetching | SWR error states in hooks/components                |
| Forms         | Field-level + submit errors via Form components     |
| Auth          | Cognito error mapping in Login / AuthProvider       |

---

## Rules

- Do not swallow errors in empty `catch` blocks.
- Do not expose stack traces, Cognito tokens, or internal API payloads in UI copy.
- Loading and empty states should be explicit for feed/correspondence/admin lists.
