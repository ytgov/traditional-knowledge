# Committing

## Format

`:emoji: Verb phrase.` — imperative mood, subject line ends with a period.

**Subject line describes the outcome or "why", not what was added.** The diff already shows what changed — the subject should tell the reader why it matters or what the user-visible effect is.

- ❌ `:sparkles: Add signed documents card for ISA admin view.` — describes what was built
- ✅ `:sparkles: Show signed documents with download actions on ISA admin card.` — describes the outcome

**Simple commits:** Single line when the change is self-explanatory.
**Complex commits:** Title line followed by one or two plain sentences explaining the non-obvious context — things the diff doesn't make immediately clear. Each sentence ends with a period.

## When to use bullet points

Use bullet points for:
- Multi-part changes with distinct items
- Complex changes needing detailed explanation
- When multiple files or concepts are affected

Example:
```
:recycle: Rename and reorganize user management components.

- Rename UsersController to UsersTableController
- Move user group logic to separate controller
- Update all route references
```

## When NOT to use bullet points

For simple single-purpose changes, use a second line instead for "why" explanation (conversational, not bullet list):
- Adding one migration file
- Straightforward single-file changes
- When title is self-explanatory

Example:
```
:butterfly: Add backfill migration for attachment association name rename.

Prepares for renaming signedAcknowledgement to signedConfidentialityAcknowledgement in information-sharing-agreement model.
```

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
- `:arrow_down:` — dependency downgrades
- `:construction:` — intentionally incomplete migration slices that may leave the app broken between commits
- `:fire:` — deletion/removal of code or features
- `:lock:` — security restrictions
- `:unlock:` — security relaxations
- `:ok_hand:` — fixes/adjustments
- `:japanese_castle:` — defensive programming or edge case handling
- `:truck:` — renames/moves
- `:white_check_mark:` / `:heavy_check_mark:` — tests
- `:heavy_plus_sign:` — additions
- `:heavy_minus_sign:` — removals
- `:label:` — typing fixes
- `:beetle:` — fixes

## Multi-concern commits

When a commit addresses more than one concern, put the primary concern in the subject line and move secondary concerns into the body. Each sentence in the body ends with a period.

Example:

```
:bug: Fix primary thing.

Also fix secondary thing.
```

## Commit body guidance

Write in plain English for the next developer reading `git log`. Use conversational style and focus on "why" and "what" rather than implementation mechanics.

**Common markers to structure information:**
- `Why?` - Explains the reason for the change
- `What?` - Explains what was changed or the problem being solved
- `How?` - Technical implementation details
- `NOTE:` - Additional context, warnings, or caveats
- `TODO:` - Future work that needs to be done
- `See` - References to issues, PRs, external links, or other commits
- `Undoes` - References to previous commits being reverted
- `Also` - Additional related changes

**Examples:**
```
Why? Simplify non-reusable queries into services to reduce complexity at caller location.

What? Previously if you modified the group name, then changed it back to the original value, it would show as invalid.

NOTE: you can only have a single cascade path between tables in mssql so the creator_id relationship uses default "restrict" action.

See https://github.com/icefoganalytics/travel-authorization/issues/309
```

Focus on:
- What changed (briefly, since the diff shows the how)
- Why it was needed — the problem being solved
- What the observable effect is for users or callers

Avoid: in-progress reasoning, implementation mechanics, and code symbols in prose.

## Rewording past commits

The global git editor is `windsurf --wait`, which hangs when invoked non-interactively. Use these patterns instead.

**Reword HEAD:**
```bash
git commit --amend -m "new message"
```

**Reword an older commit:**
```bash
# 1. Detach HEAD at the target commit
git checkout <hash>
# 2. Amend directly (-m bypasses the editor)
git commit --amend -m "new message"
# 3. Rebase the branch tip back on top
git rebase --onto HEAD <branch-tip>~ <branch-tip>
# 4. Move the branch pointer back
git branch -f <branch> HEAD && git checkout <branch>
```

**Interactive rebase without editor hang:**
```bash
GIT_EDITOR="true" git rebase -i <base>
```
`GIT_EDITOR="true"` makes git use the `true` no-op command for commit message editing, so the sequence editor step works normally but individual message editing is skipped. Combine with `--amend -m` for rewording specific commits mid-rebase.

NOTE: Multi-line `--exec` strings in `git rebase --onto` are not supported.

---

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
