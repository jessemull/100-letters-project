---
name: pr-summary
description: >-
  Draft PR title and summary for 100 Letters Project from branch diff.
---

# PR Summary

```bash
git fetch origin main
git log --oneline origin/main..HEAD
git diff origin/main...HEAD --stat
```

Produce:

- Title (Conventional Commit style)
- Summary bullets (why)
- Test plan (`make preflight`, etc.)
- Risk notes (static export, auth, networking, a11y)
