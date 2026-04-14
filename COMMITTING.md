# Committing

## Format

`:emoji: Verb phrase.` — imperative mood, subject line ends with a period.

## Emoji guidance

- `:butterfly:` — database migrations and data backfills
- `:bug:` — bug fixes
- `:sparkles:` — new features
- `:recycle:` — structural cleanup or migration-safe refactors that preserve behavior
- `:art:` — theme, styling, or visual changes
- `:cherry_blossom:` — UI polish and cosmetic improvements
- `:wrench:` — config and settings changes
- `:memo:` — documentation and plan updates
- `:hammer:` — infrastructure and tooling changes (docker, scripts)
- `:arrow_up:` — dependency, runtime, and version bumps
- `:construction:` — intentionally incomplete migration slices that may leave the app broken between commits

## Multi-concern commits

When a commit addresses more than one concern, put the primary concern in the subject line and move secondary concerns into the body. Each sentence in the body ends with a period.

Example:

```
:bug: Fix primary thing.

Also fix secondary thing.
```

## Commit body guidance

Write in plain English for the next developer reading `git log`. Focus on:

- What changed (briefly, since the diff shows the how)
- Why it was needed — the problem being solved
- What the observable effect is for users or callers

Avoid: in-progress reasoning, implementation mechanics, and code symbols in prose.

## General rules

- **One commit per logical change** — don't bundle multiple fixes or changes into a single commit
- Never `git push --force` on main branch
- Use `Part of <issue-url>` in PR bodies for multi-PR work. Reserve `Fixes <issue-url>` for the PR that should actually close the issue.

---

## PR Description Guidelines

See also: [`agents/workflows/pull-request-management.md`](agents/workflows/pull-request-management.md) for full PR creation workflow.

- **Concise language:** use direct, active voice. Avoid redundant words like "entire", "proper", "fully".
- **Context section:** focus on the problem and solution. Use present tense ("implements" not "will implement").
- **Implementation section:** short, focused bullet points. Combine related items. Avoid qualifiers and unnecessary detail.
- **Example:** "Add group creation service" instead of "Add proper group creation service for the entire system".

---

## Testing Instructions Format

See also: [`agents/workflows/testing-instructions.md`](agents/workflows/testing-instructions.md) for comprehensive guidance.

Standard setup (always include):

1. Run test suite: `dev test`
2. Boot app: `dev up`
3. Log in at http://localhost:3000

Navigation/verification steps:

- Use exact UI element names: **Add Entry**, **Set Protocol**
- Reference menu locations: "top right dropdown nav", "left sidebar nav"
- Use navigation arrows: **Knowledge Base** → **Create Entry**
- Explicit verification: "Verify success message: 'Entry created!'"
- Format: Bold for **UI elements**, inline code for `exact values/URLs/errors`
- **Always verify UI element names against the actual Vue component source** before writing instructions — do not guess button labels or field names.

For complex scenarios, use `## Test Case N: Description` subheadings.
