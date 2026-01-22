# Workflows

This directory contains reusable AI workflows for the Traditional Knowledge system.

## Intent

These workflows exist to ensure consistent, high-quality output from AI agents. Each workflow:
- Defines a specific transformation or task with clear inputs and outputs
- Provides exact patterns to follow (not guidelines to interpret)
- Includes decision rules for edge cases

**For AI Agents:** Follow steps literally. When unsure, prefer the explicit example over inference.

## Available Workflows

### [create-admin-ui.md](create-admin-ui.md)

Complete workflow for adding full CRUD admin UI for any model.

**Includes:**
- Backend: Model, Controller, Policy, Services, Serializers, Routes
- Frontend: API Client, Composables, Components, Pages, Integration
- Testing checklist
- Common pitfalls

**Reference:** Traditional Knowledge implementation

---

### [github-issue-creation.md](github-issue-creation.md)

Complete workflow for creating well-structured GitHub issues using the project's issue templates.

**Includes:**
- Step-by-step guidance for bug reports and feature requests
- Proper template field completion
- Label and assignment best practices
- Quality checklists for different issue types
- Examples from actual project issues

**Reference Files:**
- `.github/ISSUE_TEMPLATE/bug_report.md` (Bug report template)
- `.github/ISSUE_TEMPLATE/feature_request.md` (Feature request template)

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

**Example:**
```
Follow the workflow in agents/workflows/create-admin-ui.md
to create admin UI for the KnowledgeCategory model.
```

```
Follow the workflow in agents/workflows/github-issue-creation.md
to create a bug report for the authentication issue.
```

See parent [agents/README.md](../README.md) for setup instructions.

---

**Last Updated:** 2026-01-22
