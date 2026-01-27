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

### [create-admin-ui.md](create-admin-ui.md)

Complete workflow for adding full CRUD admin UI for any model.

**Uses templates from:** [`agents/templates/`](../templates/)

**Produces:**
- Backend: Model, Controller, Policy, Services, Serializers, Routes
- Frontend: API Client, Composables, Components, Pages

**Key Features:**
- References reusable templates from `agents/templates/`
- Includes implementation order, checklists, common pitfalls
- Matches actual implementation from External Organizations

**Reference:** External Organizations (`d4a9366`, `1f1dac8`)

---

### [jira-issue-creation.md](jira-issue-creation.md)

Complete workflow for creating well-structured Jira issues in the Traditional Knowledge (TK) project.

**Includes:**
- Step-by-step guidance for bugs, stories, tasks, and epics
- Proper issue type selection and formatting
- Acceptance criteria and definition of done
- Priority and component assignment
- Quality checklists and best practices

**Project URL:** https://yg-hpw.atlassian.net/jira/software/projects/TK/boards/27

---

### [pull-request-management.md](pull-request-management.md)

Complete workflow for creating and editing well-structured pull requests following Traditional Knowledge project patterns and conventions.

**Includes:**
- PR title patterns (TICKET-ID, Fix:, Action Verb + Noun)
- Comprehensive PR body template with Context, Implementation, Screenshots, Testing Instructions
- Traditional Knowledge-specific testing commands and navigation patterns
- Quality checklist and common pitfalls
- Examples from actual Traditional Knowledge pull requests
- Complete guide for editing existing pull requests

**Key Features:**
- Draft PR creation process
- Standardized testing instructions
- UI navigation patterns for Traditional Knowledge
- Code quality standards integration
- Common editing scenarios and workflows
- Step-by-step examples for updating PR content

---

## Using Workflows

Workflows are designed to be used with AI coding assistants like Claude or Windsurf.

**Example - Full Admin UI:**
```
Follow the workflow in agents/workflows/create-admin-ui.md
to create admin UI for the KnowledgeCategory model.
```

**Example - Specific Template:**
```
Follow the template in agents/templates/frontend/components.md
to create the KnowledgeCategoriesDataTable component.
```

**Example - Backend Only:**
```
Follow the backend templates in agents/templates/backend/
to create the API for KnowledgeCategory.
```

See parent [agents/README.md](../README.md) for setup instructions.

---

**Last Updated:** 2026-01-27
