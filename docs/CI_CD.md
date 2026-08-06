# CI / CD

> **AI agents — read this file when:** changing workflows, interpreting CI failures, or documenting deploy gates.

---

## Workflows

| Workflow                             | Trigger                               | Role                                                                        |
| ------------------------------------ | ------------------------------------- | --------------------------------------------------------------------------- |
| `.github/workflows/pull-request.yml` | PR → `main`                           | Build, lint, unit tests (≥80%), Cypress + Lighthouse on local `dev`         |
| `.github/workflows/merge.yml`        | Push → `main`                         | Build → tests → S3 backup → deploy → E2E → Lighthouse → rollback on LH fail |
| `.github/workflows/deploy.yml`       | `workflow_dispatch` (test/production) | Manual deploy with same post-deploy e2e/LH rollback pattern                 |
| `.github/workflows/rollback.yml`     | `workflow_dispatch`                   | Restore named S3 backup + CloudFront invalidate                             |

Do **not** rewrite these lightly. Document changes in the PR and treat as human-review required (`docs/GOVERNANCE.md`).

### Quality jobs (PR)

| Job              | Blocking? | Notes                                              |
| ---------------- | --------- | -------------------------------------------------- |
| Build            | Yes       | Static export + optional Sentry source maps        |
| Lint             | Yes       | `npm run lint`                                     |
| Unit tests       | Yes       | Jest + ≥80% coverage gate                          |
| E2E & Lighthouse | Soft LH   | Cypress blocking; LH may `continue-on-error` on PR |

### Merge / deploy

| Job          | Notes                                             |
| ------------ | ------------------------------------------------- |
| Build + unit | Required before deploy                            |
| S3 backup    | Pre-deploy backup for rollback                    |
| Deploy       | `aws s3 sync` of `out/` + CloudFront invalidation |
| E2E          | Via proxy against deployed/test URL as configured |
| Lighthouse   | Failure triggers S3 rollback on merge/deploy      |
| Revert       | Restores backup + re-invalidates CloudFront       |

Node **20** (`actions/setup-node`). Prefer documenting Node pins in `.nvmrc` / `engines` when changed.

---

## Local parity

Husky runs `./scripts/preflight.sh` (lint + typecheck + test + build) on **every `git push`** via `.husky/pre-push`. Agents should run:

```bash
make preflight   # lint + typecheck + test + build
make typecheck
make security    # npm audit (advisory locally; CI may treat audit as non-blocking)
```

Note: CI historically gates on build + lint + Jest + Cypress/LH; local preflight also requires **typecheck**. Keep both green.

---

## Fail signals

- Skipping hooks with `--no-verify` / `HUSKY=0` without explicit human request
- Weakening coverage or LH assertions to “make CI green”
- Deploying without backup / invalidation steps
