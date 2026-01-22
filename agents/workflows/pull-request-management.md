---
description: Create and edit well-structured pull requests following Traditional Knowledge project patterns and conventions
auto_execution_mode: 1
---

# Pull Request Management Workflow

## Intent

**WHY this workflow exists:** Pull requests communicate intent to reviewers and future maintainers. A well-structured PR explains the problem, the solution approach, and how to verify correctness. This reduces review friction and creates valuable documentation.

**WHAT this workflow produces:** A draft PR with:
- Clear title following naming conventions
- Context explaining WHY the change is needed
- Implementation summarizing WHAT was changed (purpose, not files)
- Testing instructions that verify correctness

**Decision Rules:**
- **Title format:** Use `Issue-<number>: Description` for GitHub issues, `TICKET-ID: Description` for Jira tickets, `Fix: Description` for bug fixes, or `Action Verb + Noun` for features. Always use AP style title case.
- **Implementation section:** Focus on purpose and intent, not specific files. A reviewer can see file changes in the diff - the Implementation section explains the reasoning behind those changes.
- **Screenshots:** Required for UI changes, "N/A - backend changes only" for non-UI
- **Draft mode:** Always create PRs as drafts first

This workflow covers the process of creating and editing well-structured pull requests that follow the established patterns in the Traditional Knowledge project.

## Quick Reference

```bash
# Create draft PR via gh api (preferred)
cat <<'EOF' | gh api repos/{owner}/{repo}/pulls -X POST \
  -F title="Title here" \
  -F head="branch-name" \
  -F base="main" \
  -F draft=true \
  -F body=@-
Fixes <url>

Relates to:

- <related-pr-or-issue-url>

# Context

<context>

# Implementation

1. <change>

# Screenshots

N/A

# Testing Instructions

1. Run the test suite via `dev test`.
2. Boot the app via `dev up`.
3. Log in to the app at http://localhost:3000.
4. <specific step>
EOF
)"
```

## Process Steps

### 1. Gather Context

Before creating a PR, gather all the information you need:

```bash
# Check current branch status
git status

# View commits on this branch
git log main..HEAD --oneline

# View full diff from main
git diff main...HEAD

# Check if branch is pushed
git branch -vv
```

### 2. Determine PR Title

Use one of these patterns:

| Pattern | When to Use | Example |
|---------|-------------|---------|
| `Issue-<number>: Description` | Linked to GitHub issue | `Issue-314: Normalize Knowledge Entry Components to Modern Patterns` |
| `TICKET-ID: Description` | Linked to Jira ticket | `TK-123: Add Traditional Knowledge Export Feature` |
| `Fix: Description` | Bug fixes without ticket | `Fix: Knowledge Record Search Not Returning Results` |
| `Action Verb + Noun` | Features/improvements | `Add Knowledge Category Management` |

**Title Guidelines:**
- Use **AP style title case** (validate at https://titlecaseconverter.com/?style=AP)
- Be specific but concise
- Start with action verb when no ticket ID

### 3. Write PR Body

Follow this template structure:

```markdown
Fixes <issue-tracker-url>

Relates to:

- <related-pr-or-issue-url>

# Context

<Problem explanation, user reports, motivation>

# Implementation

1. <Implementation detail>
2. <Additional change>

# Screenshots

<Screenshots or "N/A">

# Testing Instructions

1. Run the test suite via `dev test`.
2. Boot the app via `dev up`.
3. Log in to the app at http://localhost:3000.
4. <Specific testing step>
```

**PR Template Usage:**

The GitHub PR template provides the basic structure. Fill in each section following these guidelines:

- **Fixes:** Add issue URL or "N/A" if no specific issue
- **Relates to:** Add related PRs/issues or remove this section entirely
- **Context:** Explain the problem, user reports, or motivation for the change
- **Implementation:** List all changes made in numbered format
- **Screenshots:** Add screenshots for UI changes or "N/A - backend changes only"
- **Testing Instructions:** Always start with the standard 3 steps, then add specific steps

### 4. Section Guidelines

#### Context Section

- Explain **why** the change is needed
- Include user reports using blockquotes (`>`)
- For bugs, describe root cause if known
- Include "Steps to Reproduce" for bugs

**Example:**
```markdown
# Context

User Report
> Traditional knowledge records are not displaying properly in the search results.

Investigation revealed that the search indexing was not considering Indigenous language metadata.
```

#### Implementation Section

- Use numbered list
- Focus on **purpose and intent**, not specific file changes
- Extract meaning from commits - what was the goal of each change?
- A reviewer can see file diffs - tell them WHY, not WHERE
- Keep it concise: 5-10 items maximum

**Good Example (purpose-focused):**
```markdown
# Implementation

1. Replace dialog-based editing with dedicated page routes
2. Convert JavaScript API and composables to TypeScript
3. Split monolithic table into modular Card and DataTable components
4. Standardize component naming to match Vuetify patterns
```

**Bad Example (file-focused - avoid this):**
```markdown
# Implementation

1. Delete KnowledgeEntryCreateDialog.vue
2. Delete KnowledgeEntryEditDialog.vue
3. Add KnowledgeEntryNewPage.vue
4. Add KnowledgeEntryEditPage.vue
5. Update KnowledgeEntriesEditCard.vue
6. Update router.ts
```

#### Screenshots Section

- Required for UI changes
- Use `<img>` tags with width/height
- Include before/after comparisons
- Write "N/A - backend changes only" for non-UI changes

**Example:**
```markdown
# Screenshots

<img width="726" height="604" alt="Updated search results with proper display" src="https://github.com/user-attachments/assets/..." />
```

#### Testing Instructions Section

**Always start with these three steps:**
```markdown
1. Run the test suite via `dev test`.
2. Boot the app via `dev up`.
3. Log in to the app at http://localhost:3000.
```

**Then add specific steps:**
- Use **bold** for UI elements: **Create Entry**, **Save**
- Use arrows for navigation: **Knowledge Base** → **Create New**
- Include verification: "Verify that..." or "Check that..."
- Number steps sequentially

**QA Testing Principles:**

Write testing instructions for someone with zero project knowledge:

- **User-focused**: Focus on UI interactions ("Click on", "Verify", "Fill out")
- **Sequential steps**: Clear, numbered steps with specific verification points
- **Complete workflows**: Test creation, editing, saving, and navigation
- **Browser behavior**: Include back button, refresh, and direct URL testing
- **Simple language**: Avoid technical jargon, minimal bolding

**Example:**
```markdown
4. Navigate to **Knowledge Base** → **Create New**.
5. Fill out the knowledge entry form with test data.
6. Submit the entry.
7. Verify the entry appears in the search results with correct display.
```

### 5. Create the PR

**All PRs should be created in draft mode** to allow for review and iteration before marking ready.

```bash
# Ensure branch is pushed
git push -u origin HEAD

# Create draft PR via gh api
cat <<'EOF' | gh api repos/{owner}/{repo}/pulls -X POST \
  -F title="Title" \
  -F head="$(git branch --show-current)" \
  -F base="main" \
  -F draft=true \
  -F body=@-
[Body content]
EOF
```

To mark a draft PR as ready for review:
```bash
gh api repos/{owner}/{repo}/pulls/NUMBER -X PATCH -F draft=false
```

### 6. Edit Existing Pull Requests

When you need to update an existing PR (add context, fix title, update testing instructions):

```bash
# View current PR details
gh pr view NUMBER

# Edit PR title
gh pr edit NUMBER --title "New Title"

# Edit PR body
gh pr edit NUMBER --body "$(cat <<'EOF'
Updated PR body content
EOF
)"

# Or edit interactively
gh pr edit NUMBER
```

**Common Scenarios for Editing:**

| Scenario | What to Update |
|----------|----------------|
| **Missing context** | Add detailed problem explanation to Context section |
| **Unclear implementation** | Expand Implementation section with numbered list |
| **Missing screenshots** | Add Screenshots section with images or "N/A - backend changes only" |
| **Incomplete testing** | Add specific testing steps after the standard 3 steps |
| **Wrong title format** | Update title to follow naming patterns |
| **Add related issues** | Add "Relates to:" section with links |

**Editing Workflow:**

1. **Assess what's missing** - Compare current PR against the quality checklist
2. **Gather missing information** - Get screenshots, testing steps, or context
3. **Update systematically** - Edit one section at a time if needed
4. **Verify completeness** - Run through the quality checklist again

**Example Edit:**
```bash
# Add missing testing instructions to PR #123
gh pr edit 123 --body "$(cat <<'EOF'
Fixes https://github.com/icefoganalytics/traditional-knowledge/issues/123

# Context

User Report
> Traditional knowledge records are not displaying properly in the search results.

Investigation revealed that the search indexing was not considering Indigenous language metadata.

# Implementation

1. Update search indexing logic in KnowledgeEntry model.
2. Add Indigenous language handling to search service.
3. Fix search results display in knowledge base component.

# Screenshots

<img width="1024" height="768" alt="Search results with proper display" src="https://github.com/user-attachments/assets/..." />

# Testing Instructions

1. Run the test suite via `dev test`.
2. Boot the app via `dev up`.
3. Log in to the app at http://localhost:3000.
4. Navigate to **Knowledge Base**.
5. Search for a traditional knowledge entry using Indigenous language terms.
6. Verify the search results display correctly with proper metadata.
EOF
)"
```

### 7. Quality Checklist

Before submitting:

- [ ] PR created as draft
- [ ] Title follows naming pattern
- [ ] Context explains the "why"
- [ ] Implementation lists all changes
- [ ] Screenshots included for UI changes
- [ ] Testing instructions start with standard steps
- [ ] All tests pass locally
- [ ] Type checking passes: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] No `@ts-ignore`, `@ts-expect-error`, or `any` types

## Traditional Knowledge-Specific Patterns

### Testing Commands

Always use these exact commands in testing instructions:

- **Tests:** `npm run test`
- **Type checking:** `npm run type-check`
- **App startup:** `npm run dev`
- **Login URL:** http://localhost:3000

### Code Quality Standards

- TypeScript only - no `any`, `@ts-expect-error`, `@ts-ignore`, or `!`
- Use full descriptive names (no abbreviations)
- Follow expanded code style with guard clauses
- Use `@/` import alias for src directory

### Common UI Navigation Patterns

- **Knowledge Base** → **Create New**
- **Administration** → **Users** → **Add User**
- **Reports** → **Knowledge Reports** → **Generate Report**

## Pattern Examples from Traditional Knowledge

### Bug Fix Example

```markdown
# Fix: Knowledge Entry Search Results Display

Fixes https://github.com/icefoganalytics/traditional-knowledge/issues/123

# Context

User Report
> Traditional knowledge records are not displaying properly in the search results.

Investigation revealed that the search indexing was not considering Indigenous language metadata, causing entries to not appear in relevant searches.

# Implementation

1. Update search indexing to include Indigenous language metadata
2. Modify search results display to show language information
3. Add test coverage for Indigenous language search scenarios

# Screenshots

<img width="1024" height="768" alt="Search results with proper display" src="https://github.com/user-attachments/assets/..." />

# Testing Instructions

1. Run the test suite via `dev test`.
2. Boot the app via `dev up`.
3. Log in to the app at http://localhost:3000.
4. Navigate to **Knowledge Base**.
5. Search for a traditional knowledge entry using Indigenous language terms.
6. Verify the search results display correctly with proper metadata.
```

### Feature Example

```markdown
# TK-456: Add Traditional Knowledge Export to PDF

Fixes https://yukon-government.atlassian.net/browse/TK-456

# Context

Business Requirement
> Knowledge keepers need the ability to export traditional knowledge entries to PDF for cultural preservation and external sharing.

The current system only supports screen viewing and printing, making it difficult to share official traditional knowledge documents while maintaining cultural protocols.

# Implementation

1. Implement PDF generation service for traditional knowledge entries
2. Add export action to knowledge entry detail view
3. Restrict PDF export to authorized users with proper permissions
4. Include cultural protocol headers in generated PDFs

# Screenshots

<img width="726" height="604" alt="Export button in knowledge entry" src="https://github.com/user-attachments/assets/..." />
<img width="726" height="604" alt="Generated PDF with cultural protocols" src="https://github.com/user-attachments/assets/..." />

# Testing Instructions

1. Run the test suite via `dev test`.
2. Boot the app via `dev up`.
3. Log in to the app at http://localhost:3000.
4. Navigate to an existing traditional knowledge entry.
5. Click the **Export to PDF** button.
6. Verify the PDF downloads correctly with all knowledge details and cultural protocols.
```

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| PR not in draft mode | Always create PRs as drafts using `draft=true` |
| Vague context | Be specific about the problem and user impact |
| Missing testing steps | Start with standard 3 steps for Traditional Knowledge |
| No screenshots for UI | Always include for visual changes |
| Unclear scope | Separate core changes from side fixes |
| Missing links | Include Fixes/Relates to URLs |
| Wrong test commands | Use `dev test` not generic test commands |
| Type checking ignored | Always run `npm run type-check` |

---

**Last Updated:** 2026-01-22

*Update this workflow when you discover better patterns or Traditional Knowledge project conventions evolve.*
