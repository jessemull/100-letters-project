# PR Review Framework

> **Precedence:** CONTEXT.md > GOVERNANCE.md > ARCHITECTURE.md > **REVIEW.md**.
>
> **AI agents — read this file when:** reviewing a PR, writing review comments, or deciding merge blockers.

---

## Severity tiers

### MUST (blocking)

- Breaks static export or introduces server-only Next APIs incompatible with hosting
- Security issues (secrets, unsafe cookie handling, XSS sinks, token leakage)
- Crash bugs / unhandled null on critical paths (auth, feed, forms)
- Coverage threshold regressions or deleted tests without replacement
- Architecture violations (wrong layering, sibling-repo imports without decision)
- Type-safety abuse (`any` sprawl without justification)

### SHOULD (significant)

- Missing tests for behavior changes
- A11y gaps (labels, keyboard, contrast)
- Performance footguns (huge re-renders, unbounded lists without virtualization where needed)
- Duplicated shared UI patterns
- Poor error/empty/loading states

### NICE TO HAVE (non-blocking)

- Naming polish
- Optional refactors of equivalent approaches
- Extra docs polish

### OUT OF SCOPE

- Unrelated refactors, dependency churn not in the PR, sibling-repo changes

### VERIFY

- Claims that need runtime confirmation (auth flows, proxy cookies, LH scores)

---

## PR hygiene

- [ ] Focused change; Conventional Commits
- [ ] What / Why / Testing described
- [ ] `make preflight` contemplated / CI green
- [ ] No unrelated drive-by edits

---

## Domain checklists (internal — do not paste wholesale into review output)

### TypeScript / Next

- Strict types respected; client boundaries correct
- No static-export regressions

### Auth / networking

- Cognito and API URLs from env; no hardcoded secrets
- Proxy / cookie changes reviewed carefully

### Accessibility

- Interactive controls labeled; axe tests updated when UI changes

### Security

- No secrets in bundle; errors do not leak stack traces or tokens to users unnecessarily

### CI / craftsmanship fail signals

- Files/components ballooning without structure
- Silent `catch` that swallows errors
- Disabled lint/hooks to “make it pass”

---

## Agent review output

Skills `pr-review` and `repo-review` define the fixed section output shape. Use this file for severity definitions only; do not dump checklist tables into the user-facing review.
