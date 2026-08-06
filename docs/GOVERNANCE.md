# Governance

> **Precedence:** CONTEXT.md > **GOVERNANCE.md** > ARCHITECTURE.md > feature docs > inline comments.
>
> **AI agents — read this file when:** making structural decisions, resolving conflicting guidance, determining what requires human review, or changing governance docs.

---

## Source-of-truth precedence

| Rank | Document          | Scope                         |
| ---- | ----------------- | ----------------------------- |
| 1    | `CONTEXT.md`      | Constraints and quality gates |
| 2    | `GOVERNANCE.md`   | Process and authority         |
| 3    | `ARCHITECTURE.md` | Structure and boundaries      |
| 4    | Domain docs       | Networking, a11y, etc.        |
| 5    | Inline comments   | Local intent                  |

Resolve conflicts upward, never downward.

---

## Non-negotiable constraints

- Static export (`output: 'export'`) must keep working.
- TypeScript strict mode; ≥ 80% Jest coverage.
- Conventional Commits + Husky hooks must remain enabled.
- No hardcoded secrets; no LLM SDKs or new global state managers without product approval.
- Cognito / CloudFront / API env contracts stay the single source of truth for auth and networking.

---

## Decision authority

### Autonomous (no extra human gate beyond normal PR)

- Bug fixes that do not change auth/deploy topology or public API contracts
- Tests and documentation within existing patterns
- Lint/format fixes
- Internal refactors that preserve APIs and static-export behavior
- Copy and styling within existing surfaces

### Requires human review

- New routes or major information architecture
- Changes to governance docs (`CONTEXT.md`, `AGENTS.md`, `docs/*`)
- New third-party dependencies (especially auth, analytics, payments, LLM)
- CI/CD or CloudFormation changes
- Security-sensitive code (proxy cookie signing, Cognito, env handling)
- Removing tests or lowering coverage thresholds
- Adding server-side Next features that conflict with static export

### Requires explicit product decision

- New product surfaces not already in the app or README roadmap
- Privacy / analytics policy changes
- Embedding new AI/LLM capabilities in this client
- Changing multi-repo boundaries (API, Lambda@Edge, Authorizer)

---

## Governance doc change process

1. Open a PR with `[governance]` in the title.
2. Explain why, prior guidance, and impact.
3. One human reviewer with write access (two if changing this file).
4. Cascade updates to lower-ranked docs in the same or linked PR.

---

## Review policy

- Use severity tiers in `docs/REVIEW.md` (MUST / SHOULD / NICE).
- MUST items block merge.
- Agents using `.cursor/skills/pr-review` or `repo-review` must follow that output shape.
