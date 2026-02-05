---
description: Workflow for creating well-structured Jira issues in the Traditional Knowledge (TK) project
auto_execution_mode: 1
---

# Jira Issue Creation Workflow

## Intent

**WHY this workflow exists:** Creating effective Jira issues requires consistent structure, clear problem descriptions, and actionable requirements. Poorly written issues lead to confusion, scope creep, and implementation delays.

**WHAT this workflow produces:** Well-structured Jira issues that include:
- Clear problem descriptions or feature requests
- Specific reproduction steps or requirements
- Proper issue type, priority, and component assignment
- Acceptance criteria and testing requirements

**Decision Rules:**
- **Use Issue Types:** Always select appropriate issue type (Bug, Story, Task, Epic)
- **Stories:** Use user story format "As a [role] I can [action] so that [benefit]"
- **Bugs:** Include reproduction steps and expected behavior
- **Acceptance Criteria:** Always include clear, testable acceptance criteria
- **Components:** Assign to appropriate component (Backend, Frontend, API, etc.)

## Jira Project Details

- **Project URL:** https://yg-hpw.atlassian.net/jira/software/projects/TK/boards/27
- **Project Key:** TK
- **Board:** Traditional Knowledge Board

---

## Step 1: Choose Issue Type

| Issue Type | When to Use | Example |
|------------|-------------|---------|
| **Bug** | Defects, errors, broken functionality | Search not returning results |
| **Story** | User-facing features with business value | User can export knowledge entries |
| **Task** | Technical work without direct user value | Update database schema |
| **Epic** | Large features that span multiple stories | Implement cultural protocols system |

---

## Step 2: Fill Out Issue Fields

### Summary (Title)
- Use clear, concise titles
- For Stories: "As a [role] I can [action]"
- For Bugs: "Area: Brief description of problem"
- For Tasks: "Verb + Noun" format

### Description Template

**For Bugs:**
```
h2. Problem Description
[Clear description of what's wrong]

h2. Steps to Reproduce
# [Step 1]
# [Step 2]
# [Step 3]

h2. Expected Behavior
[What should happen]

h2. Actual Behavior
[What actually happens]

h2. Environment
* Browser: [e.g., Chrome 120.0]
* OS: [e.g., macOS 14.0]
* User: [Test account if applicable]

h2. Additional Information
[Error logs, screenshots, related issues]
```

**For Stories:**
```
h2. User Story
As a [user role] I can [perform action] so that [benefit/value]

h2. Business Value
[Why this matters to users/stakeholders]

h2. Acceptance Criteria
# Given [context] when [action] then [outcome]
# Given [context] when [action] then [outcome]
# Given [context] when [action] then [outcome]

h2. Technical Notes
[Implementation considerations, constraints]

h2. Dependencies
[Prerequisites, blocking issues]

h2. Definition of Done
- [ ] Code reviewed and approved
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] User acceptance testing complete
```

**For Tasks:**
```
h2. Objective
[What needs to be accomplished]

h2. Requirements
# [Requirement 1]
# [Requirement 2]
# [Requirement 3]

h2. Technical Approach
[How to implement]

h2. Definition of Done
- [ ] Task completed
- [ ] Code reviewed
- [ ] Tests pass
```

---

## Step 3: Set Priority and Components

### Priority Levels
- **Highest** - Production down, critical security issue
- **High** - Major feature blocked, significant impact
- **Medium** - Important but not blocking
- **Low** - Nice to have, can be deferred

### Components
- **Backend** - API, database, server-side logic
- **Frontend** - UI components, user interface
- **API** - External integrations, data exchange
- **Infrastructure** - Deployment, CI/CD, monitoring
- **Documentation** - User guides, technical docs

---

## Step 4: Add Labels and Links

### Common Labels
- `cultural-protocols` - Issues related to Indigenous cultural protocols
- `indigenous-language` - Language support and translation
- `access-control` - Permissions and access management
- `data-migration` - Data import/export/migration tasks
- `performance` - Optimization and performance issues
- `security` - Security-related issues
- `ui/ux` - User interface and experience

### Linking Issues
- **Blocks/Blocked By** - Dependencies between issues
- **Relates To** - Related but not dependent issues
- **Clones** - Duplicate issues in different contexts

---

## Complete Examples

### Bug Example

**Issue Type:** Bug
**Priority:** High
**Component:** Frontend
**Labels:** `ui/ux`, `search`

```
h2. Problem Description
Users are unable to search for traditional knowledge entries using Indigenous language terms. The search returns no results even when entries exist.

h2. Steps to Reproduce
# Navigate to Knowledge Base
# Enter Indigenous language search term
# Click search
# Observe empty results

h2. Expected Behavior
Search should return knowledge entries matching the Indigenous language terms.

h2. Actual Behavior
Search returns no results for Indigenous language terms.

h2. Environment
* Browser: Chrome 120.0
* OS: Windows 11
* User: test.knowledge.keeper@yg.gov.yk.ca

h2. Additional Information
Error in console: "Search index does not include language metadata"
```

### Story Example

**Issue Type:** Story
**Priority:** Medium
**Component:** Frontend, Backend
**Labels:** `cultural-protocols`, `access-control`

```
h2. User Story
As a Knowledge Keeper I can set cultural protocols on my entries so that sensitive information is only accessible to authorized community members.

h2. Business Value
Protects culturally sensitive information while enabling appropriate sharing within the community. Meets legal and ethical obligations for Indigenous knowledge protection.

h2. Acceptance Criteria
# Given I am a Knowledge Keeper when I create a new entry then I can set cultural protocol restrictions
# Given I set cultural protocols when unauthorized users search then they cannot access restricted content
# Given I am an authorized community member when I search restricted content then I can view it with proper attribution
# Given cultural protocols are set when the entry is exported then protocols are preserved and respected

h2. Technical Notes
- Need to implement role-based access control
- Cultural protocols must be inherited from community settings
- Audit log required for all access to restricted content

h2. Dependencies
- TK-123: Implement community management system
- TK-124: Create role-based permission system

h2. Definition of Done
- [ ] Code reviewed and approved
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] User acceptance testing complete with Knowledge Keepers
```

### Epic Example

**Issue Type:** Epic
**Priority:** High
**Component:** Multiple
**Labels:** `cultural-protocols`, `indigenous-language`

```
h2. Epic Summary
Implement comprehensive cultural protocols and Indigenous language support throughout the Traditional Knowledge system.

h2. Business Goal
Ensure the system respects and protects Indigenous cultural protocols while supporting knowledge preservation and sharing in Indigenous languages.

h2. Stories in this Epic
- TK-201: Cultural protocol management for knowledge entries
- TK-202: Indigenous language search capabilities
- TK-203: Community-based access control
- TK-204: Cultural protocol audit logging
- TK-205: Indigenous language UI localization

h2. Definition of Done
- All stories completed and accepted
- End-to-end testing with Knowledge Keepers
- Documentation and training materials created
- Cultural approval received from Indigenous partners
```

---

## Step 5: Create the Issue

### Option 1: Create via Jira Web UI
1. Go to https://yg-hpw.atlassian.net/jira/software/projects/TK/boards/27
2. Click "Create" in top navigation
3. Select Issue Type (Bug, Story, Task, Epic)
4. Fill in fields following templates above
5. Set Priority and Components
6. Add Labels
7. Click "Create"

### Option 2: Create via Jira CLI (if configured)

```bash
# Create a new story
jira issue create -p TK -t Story \
  --summary "As a Knowledge Keeper I can export entries to PDF" \
  --description "User Story: As a Knowledge Keeper I can export entries to PDF so that I can share knowledge with community members who need offline access."

# Create a new bug
jira issue create -p TK -t Bug \
  --summary "Search: Indigenous language terms not returning results" \
  --description "Problem: Search functionality doesn't index Indigenous language metadata"
```

---

## Quality Checklist

**Before Creating:**
- [ ] Issue type selected correctly
- [ ] Title is clear and follows conventions
- [ ] Description includes all required sections
- [ ] Acceptance criteria are testable (for stories)
- [ ] Reproduction steps are clear (for bugs)
- [ ] Priority set appropriately
- [ ] Components assigned
- [ ] Relevant labels added

**After Creating:**
- [ ] Issue appears in correct sprint/backlog
- [ ] Links to related issues added
- [ ] Assignee notified (if assigned)
- [ ] Watchers added as needed

---

## Best Practices

1. **One Issue, One Problem** - Don't combine multiple unrelated issues
2. **Clear Acceptance Criteria** - Make them specific and measurable
3. **User-Centric Stories** - Focus on user value, not technical implementation
4. **Proper Context** - Include enough information for anyone to understand
5. **Link Dependencies** - Always link related or blocking issues
6. **Regular Updates** - Keep issue status and comments current

---

**Workflow Version:** 1.0
**Last Updated:** 2026-01-22
**Project:** Traditional Knowledge (TK) - https://yg-hpw.atlassian.net/jira/software/projects/TK/boards/27
