# Traditional Knowledge System

Traditional Knowledge is a web application for preserving, managing, and sharing Indigenous traditional knowledge while respecting cultural protocols and community sovereignty.

This file follows the format from https://agents.md/ for AI agent documentation.

**Documentation philosophy:** This file focuses on patterns, conventions, and architecture rather than documenting specific features or domain models. Examples illustrate patterns, not exhaustive feature documentation.
Less is more: prefer the smallest guidance, implementation, or abstraction that fully solves the problem. A thing is complete not when there is nothing left to add, but when there is nothing left to take away.
Do not remove durable reference material that is hard to rediscover later, such as known-good test inputs, sample payloads, or validated reference values.

Keep `AGENTS.md` focused on project-wide conventions and high-level concepts. When guidance becomes specific to a subsystem or directory, move it into the nearest `README.md` or `agents/` workflow document and link to it from here.

---

## Design Philosophy

**Perfection through removal, not addition:**

Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away. Focus on removing unnecessary complexity, verbosity, and redundancy rather than adding more features or content.

**Application:** Question whether new features are actually needed before implementing. Simpler is better when the feature doesn't add clear value.

---

## Technology Stack

- **Backend:** Node.js + Express + TypeScript, Sequelize 7 + Knex migrations → [`api/README.md`](api/README.md)
- **Frontend:** Vue 3 + Vuetify 3, TypeScript, Vite, Pinia → [`web/README.md`](web/README.md)
- **Database:** Microsoft SQL Server (MSSQL)
- **Testing:** Vitest, Fishery factories
- **Infrastructure:** Docker Compose
- **Auth:** Auth0 with JWT
- **Storage:** Azure Blob Storage
- **Cache:** Redis
- **Mail:** MailDev (dev) / Outlook365 (prod)

---

## Development Environment

### Commands

- `dev up` — start all services
- `dev down` — stop services
- `dev down -v` — stop and wipe database
- `dev test` / `dev test api` — run API tests
- `dev test web` — run web tests
- `dev migrate up` / `dev migrate latest` — run migrations
- `dev migrate down` — rollback last migration
- `dev migrate make <description>` — **always use this to create migrations** (generates correct timestamp)
- `dev seed make <name>` / `dev seed run` — seed management

### Database Queries

```bash
# Interactive console
dev sqlcmd

# Direct query (no special characters)
dev sqlcmd-query "SELECT COUNT(*) FROM users"

# Queries with single quotes or Unicode (Indigenous names)
cat << 'SQL' | ./bin/dev sqlcmd
SELECT id, name FROM external_organizations WHERE name = 'Tr''ondëk Hwëch''in';
SQL
```

Escape single quotes with `''`. Unicode characters (ë, ü) are preserved.

### Conventions

- `@/` import alias for `src/` (both API and web)
- No relative imports except barrel `index.ts` re-exports
- Database: snake_case — Models: camelCase (Sequelize maps automatically)
- Test files mirror source: `api/src/services/foo.ts` → `api/tests/services/foo.test.ts`
- Jira project: TK — https://yg-hpw.atlassian.net/jira/software/projects/TK/boards/27

---

## Security

- Auth0 for authentication (requires third-party cookies in dev)
- All routes authenticated by default — only explicitly allow public endpoints (e.g., `/health`)
- Use policy scoping for authorization; enforce cultural protocol access restrictions
- Never commit secrets — use environment variables
- Config variables: `NODE_ENV`, `API_PORT`, `FRONTEND_URL`, `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`, `DB_*`
- See `api/src/config.ts` for complete details

---

## Pull Requests & Commits

- See [`COMMITTING.md`](COMMITTING.md) for commit format, emoji guide, and multi-concern conventions.
- See [`agents/workflows/pull-request-management.md`](agents/workflows/pull-request-management.md) for PR structure.

**Pre-submission checklist:**

- Tests pass: `dev test api` and `dev test web`
- Linting passes: `dev api npm run lint` and `dev web npm run lint`
- No `@ts-ignore`, `@ts-expect-error`, or `any` types
- No abbreviations in names
- One commit per logical change

---

## Agent Templates & Workflows

The `agents/` folder contains copy-paste templates and multi-step workflows. **Use these instead of writing from scratch.** See [`agents/README.md`](agents/README.md) for full documentation.

**Templates** (`agents/templates/`): backend model, controller, policy, services, serializers; frontend api-client, composables, components, pages, searchable-autocomplete. Each template is also linked from its nearest subsystem README (e.g., `api/src/services/README.md`, `web/src/components/README.md`).

**Workflows** (`agents/workflows/`): `create-admin-ui.md`, `pull-request-management.md`, `jira-issue-management.md`, `code-review.md`, `testing-instructions.md`.

**Plan file naming** (`agents/plans/`): `Type, Title, YYYY-MM-DD.md` — e.g., `Plan, TK-26 - Add Internal User, 2026-01-22.md`.

**Workflow frontmatter:** all workflow files must include a `description:` field in YAML frontmatter.

**Reference implementations:** cite `Reference: ModelName (commit: abc1234)` in workflow files so readers can `git show <hash>`.

**Agent discipline:**
- Search for the **method or pattern**, not the variable name — variable names differ per file.
  - BAD: `form\.value\.validate` — misses `formRef`, `headerActionsFormCard`, etc.
  - GOOD: `\.validate\(\)` — catches all call sites regardless of ref name.
- Do not ask for permission to edit or delete files already tracked by git.
- Keep GitHub templates minimal with just structure — move detailed guidance and examples to agent workflows. Template = what to fill out, Workflow = how to fill it out.

---

## Quick Reference

| HTTP Code | Meaning       | Used When             |
| --------- | ------------- | --------------------- |
| 200       | OK            | Successful GET, PATCH |
| 201       | Created       | Successful POST       |
| 204       | No Content    | Successful DELETE     |
| 400       | Bad Request   | General error         |
| 403       | Forbidden     | Policy check fails    |
| 404       | Not Found     | Record not found      |
| 422       | Unprocessable | Create/Update fails   |

**File naming:** database `snake_case`, JS/TS `camelCase`, Vue `PascalCase`, multi-word files `kebab-case`, controllers `*-controller.ts`, services `*-service.ts`, models singular (`user.ts`).

**Lodash:** `isNil()` — null/undefined; `isEmpty()` — empty strings/arrays/objects; `pick()`/`omit()` — select/remove keys; `debounce()` — 500ms for search.

---

## Cultural Protocols & Indigenous Considerations

**Core principles:**

- **Community Sovereignty:** Indigenous communities maintain full control over their traditional knowledge.
- **Cultural Protocol Respect:** All access must respect cultural protocols and restrictions.
- **Language Preservation:** UTF-8 support for all Indigenous character sets; language-specific search; audio/video support for oral traditions.
- **Provenance Tracking:** Complete audit trail of knowledge access and usage.

**Protocol model:**

- Protocols are inherited from community settings; multiple types (viewing, sharing, downloading, printing).
- Role-based access within communities (Knowledge Keeper, Elder, Community Member).
- Time-based restrictions (seasonal, ceremonial periods).
- Sensitive knowledge marked with protocol levels; export restrictions; watermarking for downloads; right to be forgotten.

**Access control pattern:**

```typescript
if (!(await culturalProtocolService.canView(knowledgeEntry, user, community))) {
  return response.status(403).json({ message: "Access restricted by cultural protocol" })
}
await auditLogService.create({ knowledgeEntryId: entry.id, userId: user.id, communityId: community.id, action: "view", timestamp: new Date() })
```

---

## Changelog Management

- Maintain a single canonical `CHANGELOG.md`. Use Keep a Changelog structure with `## [Unreleased]` at top.
- Track upstream releases with `vYYYY.MM.DD.x`.
- Write user-facing entries grouped by theme, not commit-log summaries.
- Add an `Unreleased` entry for PRs that change user-visible behavior or database schema.
- Use "Developer improvements to tests, migrations, and logging" for large batches of internal changes.
- Include short "Why?" explanations for major technical changes.
