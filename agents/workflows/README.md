# Workflows

This directory contains reusable AI workflows for the Traditional Knowledge system.

## Intent

These workflows exist to ensure consistent, high-quality output from AI agents. Each workflow:
- Defines a specific transformation or task with clear inputs and outputs
- Provides exact patterns to follow (not guidelines to interpret)
- Includes decision rules for edge cases

**For AI Agents:** Follow steps literally. When unsure, prefer the explicit example over inference.

**Related:** Workflows reference reusable templates in [`agents/templates/`](../templates/).

## Available Workflows

| Workflow | Description |
|----------|-------------|
| [jira-issue-management.md](./jira-issue-management.md) | Create well-structured Jira issues following project patterns |
| [code-review.md](./code-review.md) | Code review quality control for TypeScript code |
| [pull-request-management.md](./pull-request-management.md) | Create and edit well-structured pull requests following project patterns |
| [testing-instructions.md](./testing-instructions.md) | Generate comprehensive testing instructions for pull requests |
| [create-admin-ui.md](./create-admin-ui.md) | Complete workflow for adding full CRUD admin UI for any model |

### Complete PR Creation Sequence

For a full PR workflow, follow these steps in order:

1. **[jira-issue-management.md](./jira-issue-management.md)** — Create/update the Jira issue
2. **[code-review.md](./code-review.md)** — Review code quality before PR
3. **[pull-request-management.md](./pull-request-management.md)** — Create the draft PR
4. **[testing-instructions.md](./testing-instructions.md)** — Add comprehensive testing instructions

---

## Using Workflows

Workflows are designed to be used with AI coding assistants like Claude or Windsurf.

**Example - Full Admin UI:**
```
Follow the workflow in agents/workflows/create-admin-ui.md
to create admin UI for the KnowledgeCategory model.
```

**Example - Create PR:**
```
Follow the workflow in agents/workflows/pull-request-management.md
to create a PR for my changes.
```

**Example - Testing Instructions:**
```
Follow the workflow in agents/workflows/testing-instructions.md
to create testing instructions for this PR.
```

**Example - Code Review:**
```
Follow the workflow in agents/workflows/code-review.md
to review the code changes on this branch.
```

**Example - Specific Template:**
```
Follow the template in agents/templates/frontend/components.md
to create the KnowledgeCategoriesDataTable component.
```

See parent [agents/README.md](../README.md) for setup instructions.

---

**Last Updated:** 2026-03-12
