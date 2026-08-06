---
name: repo-review
description: >-
  Full-repo audit for 100 Letters Project using REVIEW.md severity tiers. Use for release readiness or compliance sweeps.
---

# Repository Review

Same severity and bullet format as `pr-review`, but **repo-wide** (not PR-diff-only).

Read full mandatory docs from `CONTEXT.md`. Enumerate `src/`, `scripts/`, `proxy/`, workflows.

## Extra sections

- **Coverage** — Jest threshold posture; obvious gaps
- **Verdict** — Ready / Needs work

Priorities: correctness → architecture → static-export safety → a11y → security → maintainability.

Output sections:

1. Scope
2. Architecture
3. Reviewed areas
4. **[MUST]** / **[SHOULD]** / **[NICE TO HAVE]** / **[OUT OF SCOPE]** / **[VERIFY]**
5. Strengths
6. Coverage
7. Test plan
8. Verification
9. Verdict (Ready / Needs work)

Bullet format: `` `path:line` — imperative task ``
