# Releases

> **AI agents — read this file when:** shipping, deploying, or rolling back.

---

## Model

This client ships as a **static export** to S3 behind CloudFront.

1. Merge to `main` triggers the merge workflow (test/dev deploy path).
2. Manual `deploy.yml` promotes to **test** or **production** as selected.
3. `rollback.yml` restores a named S3 backup when needed.

Environments:

- Test: `https://dev.onehundredletters.com`
- Production: `https://onehundredletters.com`

---

## Versioning

- App `package.json` version is informational; deploys are artifact/sync based.
- Prefer Conventional Commit history as the changelog signal unless a human asks for a formal CHANGELOG entry.

---

## Pre-release checklist

- [ ] `make preflight` green
- [ ] Env / Cognito / API contracts unchanged or documented
- [ ] No secrets in the bundle
- [ ] Lighthouse/e2e considered for UI-heavy changes

---

## Hotfix / rollback

Use GitHub Actions `rollback` workflow rather than hand-editing S3 when possible. Coordinate with humans for production. Human ops detail (bastion, secrets naming) lives in `README.md`.
