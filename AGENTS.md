# Traditional Knowledge System

Traditional Knowledge is a web application for preserving, managing, and sharing Indigenous traditional knowledge while respecting cultural protocols and community sovereignty.

This file follows the format from https://agents.md/ for AI agent documentation.

**Documentation philosophy:** This file focuses on patterns, conventions, and architecture rather than documenting specific features or domain models. Examples illustrate patterns, not exhaustive feature documentation.

---

## Table of Contents

- [Technology Stack](#technology-stack)
- [Development Environment](#development-environment)
  - [Common Commands](#common-commands)
  - [Conventions](#conventions)
- [Backend Patterns & Conventions](#backend-patterns--conventions)
  - [Code Style](#code-style)
  - [Architecture Patterns](#architecture-patterns)
  - [Models](#models)
  - [Database](#database)
  - [Testing](#testing)
- [Frontend Patterns & Conventions](#frontend-patterns--conventions)
  - [Code Style](#code-style-1)
  - [Component Naming Convention](#component-naming-convention)
  - [Architecture Patterns](#architecture-patterns-1)
- [General Concerns](#general-concerns)
  - [Security](#security)
  - [Configuration](#configuration)
  - [Pull Request Guidelines](#pull-request-guidelines)
  - [Agent Workflow Patterns](#agent-workflow-patterns)
- [Cultural Protocols & Indigenous Considerations](#cultural-protocols--indigenous-considerations)

---

## Technology Stack

- **Backend:** Node.js + Express + TypeScript, Sequelize 7 + Knex migrations
- **Frontend:** Vue 3 + Vuetify 3, TypeScript, Vite, Pinia
- **Database:** Microsoft SQL Server (MSSQL)
- **Testing:** Vitest, Fishery factories
- **Infrastructure:** Docker Compose
- **Auth:** Auth0 with JWT
- **Storage:** Azure Blob Storage
- **Cache:** Redis
- **Mail:** MailDev (dev) / Outlook365 (prod)
- **Knowledge Management:** Cultural protocol enforcement, Indigenous language support

## Modern Architecture Patterns

**For implementation templates, see `agents/templates/`** - copy-paste-ready code for all patterns below.

### Vue 3 Composable Patterns
- **State Management**: Use `reactive()` + `toRefs()` for composables instead of individual refs
- **Form References**: Use `ref<InstanceType<VForm> | null>(null)` for newer patterns
- **Server-Side Tables**: Use `v-data-table-server` with `useRouteQuery` for URL state
- **Component Naming**: `{Model}{Purpose}{VuetifyComponent}.vue` pattern

### Function Naming Patterns
- **Effect-Based Naming**: Name functions by their complete effect, not trigger conditions
- **Pattern**: `[primaryEffect](Optionally[SecondaryEffect])` for conditional side effects
- **Avoid**: `handle*`, `update*With*`, business logic in names
- **Focus**: WHAT happens, not WHEN or WHY
- **Example**: `emitExpirationConditionAndOptionallyUpdateEndDate`

### Backend Service Architecture
- **Constructor Injection**: Use constructor pattern instead of static methods
- **Database Transactions**: All write operations wrapped in transactions
- **One Service Per File**: Separate CreateService, UpdateService, DestroyService with barrel exports
- **Error Handling**: Structured logging with context and proper HTTP status codes

### Model Scopes and Validation
- **Search Scopes**: Implement `addSearchScope()` for searchable fields
- **Exclusion Logic**: Use `arrayWrap()` utility with `Op.notIn` for current record exclusion
- **Unique Validation**: Combine excludeById with unique text field components
- **Security Scopes**: Default to restrictive, explicit permissions only

## Development Environment

### Common Commands

- `dev up` - Start all services (includes watch mode by default)
- `dev down` - Stop services
- `dev down -v` - Stop and wipe database
- `dev sqlcmd` - Access database CLI (MSSQL)
- `dev test` or `dev test api` - Run all API tests
- `dev test web` - Run all web tests
- `dev test_api` - Run all API tests (legacy)
- `dev test_web` - Run all web tests (legacy)
- `dev migrate up` or `dev migrate latest` - Run migrations
- `dev migrate down` - Rollback last migration
- `dev migrate make create-table-name` - **ALWAYS use this command to create migrations** - generates correct local timestamp automatically
- `dev seed make seed-name` - Create seed file
- `dev seed run` - Run seeds

### Conventions

- Use `@/` import alias for src directory (both API and web)
- Database: snake_case, Models: camelCase (Sequelize handles mapping)
- Test files mirror source structure: `api/src/services/example.ts` → `api/tests/services/example.test.ts`
- Jira project: TK (https://yg-hpw.atlassian.net/jira/software/projects/TK/boards/27)

---

## Backend Patterns & Conventions

### Code Style

- TypeScript only - no `any`, `@ts-expect-error`, `@ts-ignore`, or `!` (non-null assertion)
- Use optional chaining (`?.`) and nullish coalescing (`??`) for null handling
- 2 spaces, no semicolons, double quotes, 100 char line limit
- **No abbreviations:** Full descriptive names (`knowledgeEntry` not `ke`)
- **Number similar entities:** `user1`, `user2` for clarity (not `existingUser`, `newUser`)
- **Expanded code style:** One thing per line, avoid terse functional chains
- **Guard clauses:** Early returns with blank line after each guard
- **Named constants:** Hoist magic numbers to named `const`
- camelCase for variables/functions, PascalCase for classes/types

**Import ordering (PEP8-style):**

1. Node.js built-in modules
2. Blank line
3. External packages from node_modules
4. Blank line
5. Internal imports from `@/` (alphabetical preferred)

### Architecture Patterns

**Service Pattern:**

- Business logic in services extending `BaseService`
- Call via static method: `ServiceName.perform(args)` (never instantiate directly)
- Services call other services, not queries directly

**Controller Pattern:**

- RESTful controllers extending `BaseController`
- Standard CRUD: `index()`, `show()`, `create()`, `update()`, `destroy()`
- Routes: `GET /api/resources`, `GET /api/resources/:id`, `POST /api/resources`, etc.
- Authorization via `this.buildPolicy()` and `Policy.applyScope()`
- Serializers format output (IndexSerializer, ShowSerializer)
- Nested controllers in subfolders: `controllers/resource/action-controller.ts`

**Serializer Naming Convention:**

- Use `AsIndex` for index serializer types (not `TableView`)
- Use `AsShow` for show serializer types
- Follow pattern: `{Model}AsIndex`, `{Model}AsShow`

**Response Patterns:**

- Multi-line JSON responses with consistent formatting
- Return policy information in create/update responses: `{ record, policy }`
- Structured error logging: ``logger.error(`Failed to [action] [resource]: ${error}`, { error })``
- Consistent error message format: `"Failed to [action] [resource]: ${error}"`

**Policy Pattern:**

- **Modern Pattern:** Use `PolicyFactory` with `policyScope()` method for new/updated policies
- **Legacy Pattern:** Manual `applyScope()` method (being phased out)
- **Policy Composition:** Compose scopes by storing parent policy scope in variable and spreading
- **Admin Handling:** Use `ALL_RECORDS_SCOPE` constant for admin users with early returns
- **Method Naming:** Use `permittedAttributes()` instead of `permittedAttributesForUpdate()`
- **Role checks:** Use `user.isSystemAdmin` property directly
- **Policy Inheritance:** Extend `PolicyFactory(ModelClass)` instead of `BasePolicy`

**Models:**

- **Soft deletes:** All models support `deletedAt` timestamp (paranoid mode enabled globally)
- **Index Decorators:** When using `createIndexDecorator` on models:
  - First parameter (decorator identifier): Use kebab-case following JS/TS conventions
  - `name` property: Use snake_case to match the actual database index name from migrations
  - Always include both the decorator identifier AND the name property
  - Example:
  ```ts
  createIndexDecorator("user-groups-user-id-group-id-unique", {
    name: "user_groups_user_id_group_id_unique",
    unique: true,
    where: {
      deletedAt: null,
    },
    msg: "User group combination must be unique",
  })
  ```
- **Enum patterns:**
  - Place enums directly in relevant model files (not separate utilities)
  - Include model name in enum description: `UserYukonFirstNations` not generic `YukonFirstNations`
  - Add validation decorators with `@ValidateAttribute` and `isIn` for enum fields

**Database:**

- Knex for migrations, Sequelize for ORM
- Database: snake_case, Models: camelCase (Sequelize maps automatically)
- **Migration patterns:**
  - Keep migrations clean without extraneous comments
  - When adding foreign key fields that need to be non-null to existing tables, add them as nullable initially, backfill existing records, then make non-nullable
  - Use self-referencing foreign keys with proper constraint naming
  - Find system user by email (`system.user@yukon.ca`) not auth0Subject
  - Use proper TypeScript generics: `.returning<{ id: number }[]>(["id"])`
  - **CRITICAL: Never manually generate migration timestamps** - Always use `dev migrate make <description>` which generates correct local timestamps automatically
  - **Foreign key constraints**: Create column first, then add foreign key separately:
    ```ts
    table.integer("field_name").nullable()

    table
      .foreign("field_name")
      .references("users.id")
      // optionally depending on the use case
      // .onDelete("SET NULL")
    ```
  - **Down migration cleanup**: Always drop foreign key before dropping column

### Testing

**Running tests:**

- All API tests: `dev test` or `dev test api`
- All web tests: `dev test web`
- Specific API file: `dev test api -- tests/services/example.test.ts --run`
- Specific web file: `dev test web -- tests/components/example.test.ts --run`
- Watch mode: omit `--run`
- Pattern matching: `dev test api -- --grep "pattern"`
- Legacy commands: `dev test_api` and `dev test_web` still work

**Test structure:**

- Mirror source structure: `api/src/services/example.ts` → `api/tests/services/example.test.ts`
- Use `test` not `it`
- Nested describe blocks: file path → class name → method name
- AAA pattern with explicit comments: `// Arrange`, `// Act`, `// Assert`
- Test naming: `"when [condition], [expected behavior]"`
- Use Fishery factories for all test data

**Test patterns:**

- Numbered entities: `user1`, `user2` (not `existingUser`, `newUser`)
- Descriptive variable names: `knowledgeEntryAttributes` not `attributes`
- Assert database state via `findAll()` without where clauses (test isolation handles cleanup)
- Negative spy assertions: `expect(spy).not.toHaveBeenCalled()` (never use `not.toHaveBeenCalledWith`)
- Controller tests: `mockCurrentUser(user)` and `request().get("/api/path")` from `@/support`

---

## Frontend Patterns & Conventions

### Code Style

- TypeScript only - no `any`, `@ts-expect-error`, `@ts-ignore`
- Vue 3 + Vuetify 3
- 2 spaces, no semicolons, double quotes, 100 char line limit
- camelCase for variables/functions, PascalCase for components
- **Props definition:** Prefer TypeScript generic style `defineProps<{ prop: type }>()`
- **Loading states:** Use `isNil(data)` instead of boolean `isLoading` flags for more precise data presence checks
- **Reactivity:** Use `toRefs(props)` when passing props to composables to maintain ref types and reactivity

### Component Naming Convention

**Pattern:** `{Model}{Purpose}{VuetifyComponent}.vue`

1. **Model/Domain** - Primary data model (e.g., `KnowledgeEntry`, `CulturalProtocol`)
2. **Purpose** - Specific functionality (e.g., `Filters`, `Edit`, `Search`)
3. **Vuetify Component** - Wrapper component (e.g., `Card`, `Dialog`, `DataTable`)

**Directory structure:**

- Location: `/web/src/components/{model}/`
- Directories: kebab-case (e.g., `knowledge-entries`)
- Files: PascalCase (e.g., `KnowledgeEntryEditCard.vue`)

**Examples:**

- `KnowledgeEntryFiltersCard.vue` - Filters card for knowledge entries
- `CulturalProtocolEditDialog.vue` - Edit dialog for cultural protocols
- `IndigenousLanguageSelect.vue` - Select for Indigenous languages

### Architecture Patterns

**API Module Pattern:**
Type-safe API clients in `web/src/api/*-api.ts`

- Export types matching backend models/serializers
- Export `WhereOptions`, `FiltersOptions`, `QueryOptions` for query parameters
- Export API object with methods: `list()`, `get()`, `create()`, `update()`, `delete()`
- Methods return typed promises
- Example: `knowledgeEntriesApi.list(params)` → `Promise<{ knowledgeEntries: KnowledgeEntryAsIndex[], totalCount: number }>`

**Composable Pattern:**
Reactive data fetching in `web/src/use/use-*.ts`

_Plural form (`useResources`) for collections:_

- Accept `options` ref with query parameters, optional `skipWatchIf` function
- Return: `resources`, `totalCount`, `isLoading`, `isErrored`
- Provide: `fetch()` and `refresh()` methods
- Watch options with `deep: true, immediate: true`

_Singular form (`useResource`) for single items:_

- Accept `id` ref (can be `number | null | undefined`)
- Return: `resource`, `policy`, `isLoading`, `isErrored`
- Provide: `fetch()`, `refresh()`, optionally `save()`
- Watch id with `immediate: true`, skip if nil

---

## General Concerns

### Security

- Auth0 for authentication (requires third-party cookies in dev)
- All routes authenticated by default
- Use policy scoping for authorization
- **Cultural protocols:** Enforce access restrictions based on community permissions
- Never commit secrets - use environment variables
- Parameterized queries prevent SQL injection

### Configuration

Environment files (not committed): `.env.development`, `.env.production`, `.env.test`

**Key variables:**

- `NODE_ENV`, `API_PORT`, `FRONTEND_URL`
- `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`
- Database: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_PORT`
- Cultural Protocols: `CULTURAL_PROTOCOL_KEY`, `INDIGENOUS_LANGUAGE_API`

See `/api/src/config.ts` for complete details.

### Pull Request Guidelines

**Pre-submission:**

- All tests pass:
  - API: `npm test` from `/api`
  - Web: `npm test` from `/web`
- Type checking passes:
  - API: `npm run check-types` from `/api`
  - Web: `npm run check-types` from `/web`
- Linting passes:
  - API: `npm run lint` from `/api`
  - Web: `npm run lint` from `/web`
- No `@ts-ignore`, `@ts-expect-error`, or `any` types
- Follow naming conventions (no abbreviations)
- Write tests for new functionality (AAA pattern)
- Never `git push --force` on main branch

**Testing Instructions Format:**

Standard setup (always include):

1. Run test suite: `npm run test`
2. Boot app: `npm run dev`
3. Log in at http://localhost:3000

Navigation/verification steps:

- Use exact UI element names: **Add Entry**, **Set Protocol**
- Reference menu locations: "top right dropdown nav", "left sidebar nav"
- Use navigation arrows: **Knowledge Base** → **Create Entry**
- Explicit verification: "Verify success message: 'Entry created!'"
- Format: Bold for **UI elements**, inline code for `exact values/URLs/errors`

For complex scenarios, use `## Test Case N: Description` subheadings.

### Agent Templates and Workflows

The `agents/` folder contains reusable templates and workflows. **Use these instead of writing from scratch.**

#### Templates (`agents/templates/`)

Copy-paste-ready code for specific file types. Use when you know exactly what you need.

**Backend:**
- `backend/model.md` - Sequelize model with scopes
- `backend/controller.md` - CRUD controller with error handling
- `backend/policy.md` - Authorization with PolicyFactory
- `backend/services.md` - Create, Update, Destroy services
- `backend/serializers.md` - Index, Show, Reference serializers

**Frontend:**
- `frontend/api-client.md` - Type-safe HTTP client
- `frontend/composables.md` - Reactive data fetching (list/single)
- `frontend/components.md` - DataTable, Forms, UniqueTextField
- `frontend/pages.md` - List, New, Edit pages
- `frontend/searchable-autocomplete.md` - Debounced search component

#### Workflows (`agents/workflows/`)

Multi-step guides that orchestrate templates. Use for complete features.

- `create-admin-ui.md` - Full CRUD admin interface (references templates)
- `pull-request-management.md` - Creating and editing PRs
- `jira-issue-creation.md` - Creating Jira issues in TK project

#### Usage Examples

```
# Complete feature (workflow)
Follow agents/workflows/create-admin-ui.md to create admin UI for Categories.

# Specific component (template)
Follow agents/templates/frontend/searchable-autocomplete.md for CategorySearchableAutocomplete.

# Backend only (templates)
Follow agents/templates/backend/ to create the API for Categories.
```

See `agents/README.md` for full documentation.

#### Plan File Naming Convention

When creating new plan files in `/agents/plans/`, use the format:
- File name: `Plan, <Ticket-ID> - <Descriptive Title>, <YYYY-MM-DD>.md`
- Example: `Plan, TK-26 - Add Internal User from the Active Directory, 2026-01-22.md`

---

## Quick Reference

### HTTP Status Codes

| Code | Meaning | Used When |
|------|---------|-----------|
| 200 | OK | Successful GET, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | General error |
| 403 | Forbidden | Policy check fails |
| 404 | Not Found | Record not found |
| 422 | Unprocessable | Create/Update fails |

### Lodash Utilities

- `isNil()` - Check null or undefined
- `isEmpty()` - Check empty strings, arrays, objects
- `pick()` / `omit()` - Select/remove object properties
- `debounce()` - Debounce functions (500ms for search)

### File Naming Conventions

- Database: snake_case (tables, columns)
- JavaScript/TypeScript: camelCase (variables, properties)
- Vue Components: PascalCase
- Files: kebab-case for multi-word files
- Controllers: `*-controller.ts`
- Services: `*-service.ts`
- Models: singular (e.g., `user.ts`)
- Migrations: timestamp prefix + descriptive name

---

## Cultural Protocols & Indigenous Considerations

### Core Principles

1. **Community Sovereignty:** Indigenous communities maintain full control over their traditional knowledge
2. **Cultural Protocol Respect:** All access must respect cultural protocols and restrictions
3. **Language Preservation:** Support for Indigenous languages throughout the system
4. **Provenance Tracking:** Complete audit trail of knowledge access and usage

### Implementation Patterns

**Cultural Protocol Model:**
- Protocols are inherited from community settings
- Multiple protocol types: viewing, sharing, downloading, printing
- Role-based access within communities (Knowledge Keeper, Elder, Community Member)
- Time-based restrictions (seasonal, ceremonial periods)

**Indigenous Language Support:**
- UTF-8 support for all Indigenous character sets
- Language-specific search capabilities
- Translation interface for community-provided translations
- Audio/video support for oral traditions

**Access Control Patterns:**
```typescript
// Check cultural protocol before access
if (!await culturalProtocolService.canView(knowledgeEntry, user, community)) {
  return response.status(403).json({ message: "Access restricted by cultural protocol" })
}

// Log all access for audit trail
await auditLogService.create({
  knowledgeEntryId: entry.id,
  userId: user.id,
  communityId: community.id,
  action: "view",
  timestamp: new Date()
})
```

**Data Handling Considerations:**
- Sensitive knowledge marked with protocol levels
- Export restrictions based on cultural protocols
- Watermarking for downloaded content
- Right to be forgotten for community members

---

**Version:** 1.1
**Last Updated:** 2026-01-27
**Project:** Traditional Knowledge (TK)
