---
name: security-review
description: >-
  Security review for secrets, Cognito, proxy, and client bundle risks.
---

# Security Review

Read `docs/SECURITY.md` + `docs/REVIEW.md` security items.

Check: hardcoded secrets, unsafe logging of tokens/PII, cookie signing error handling, dependency risk, public bundle leakage.

Output MUST/SHOULD/NICE bullets like `pr-review`.
