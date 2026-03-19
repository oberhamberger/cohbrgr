---
name: commit
description: Stage and commit changes using conventional commits format
disable-model-invocation: true
---

# Commit Changes

1. Run `git status` and `git diff` (staged + unstaged) to understand all changes.
2. Summarize the changes to the user before doing anything else. Wait for confirmation if anything looks unexpected.
3. Stage the relevant files by name (never use `git add -A` or `git add .`).
4. Write a conventional commit message:
    - Format: `type(scope): description`
    - Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`, `style`
    - Scope is optional — use package/app names like `shell`, `content`, `api`, `build`, `server`, `env`, etc.
    - Subject line max 72 characters, lowercase, no period
    - Add a body (separated by blank line) when the "why" isn't obvious from the subject
5. Never push. Never run `git push`.
