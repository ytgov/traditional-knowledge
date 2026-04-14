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
- [Changelog Management](#changelog-management)

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
- `dev sqlcmd` - Access interactive database console (MSSQL)
  - For interactive database access: `dev sqlcmd`
  - For direct queries: `dev sqlcmd-query "SELECT COUNT(*) FROM users"`
  - For queries with special characters (single quotes, Unicode), use here documents:
    ```bash
    cat << 'SQL' | ./bin/dev sqlcmd
    SELECT id, name FROM external_organizations WHERE name = 'Tr''ondëk Hwëch''in';
    SQL
    ```
  - This handles single quotes (escape with `''`), Unicode characters (ë, ü), and complex queries
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
- No relative imports anywhere except barrel `index.ts` re-exports
- Database: snake_case, Models: camelCase (Sequelize handles mapping)
- Test files mirror source structure: `api/src/services/example.ts` → `api/tests/services/example.test.ts`
- Jira project: TK (https://yg-hpw.atlassian.net/jira/software/projects/TK/boards/27)

### Database Queries

**For interactive database access:**

```bash
dev sqlcmd
```

**For direct queries without special characters:**

```bash
dev sqlcmd-query "SELECT COUNT(*) FROM users"
dev sqlcmd-query "SELECT id, name FROM external_organizations WHERE id = 12"
```

**For queries with special characters (single quotes, Unicode, Indigenous names):**

```bash
cat << 'SQL' | ./bin/dev sqlcmd
SELECT id, name FROM external_organizations WHERE name = 'Tr''ondëk Hwëch''in';
SQL
```

**Key points:**

- Use `dev sqlcmd` for interactive database console access
- Use `dev sqlcmd-query` for direct queries without special characters
- Use here documents (`cat << 'SQL' | ./bin/dev sqlcmd`) for queries with special characters
- Escape single quotes with double single quotes: `'` → `''`
- Unicode characters (ë, ü, etc.) are preserved properly
- Works for complex multi-line queries
- Prefer here documents over `sqlcmd-query` for problematic queries

---

## Backend Patterns & Conventions

### Code Style

- TypeScript only - no `any`, `as` type assertions, `@ts-expect-error`, `@ts-ignore`, or `!` (non-null assertion). Use `instanceof` narrowing with fallbacks instead of `as` casts.
- **Use `type` instead of `interface`:** Prefer `type Foo = { ... }` over `interface Foo { ... }` — `interface` has unexpected side-effects (declaration merging, etc.)
- Use optional chaining (`?.`) and nullish coalescing (`??`) for null handling
- 2 spaces, no semicolons, double quotes, 100 char line limit
- **No abbreviations:** Full descriptive names (`knowledgeEntry` not `ke`)
- **Number similar entities:** `user1`, `user2` for clarity (not `existingUser`, `newUser`)
- **Expanded code style:** One thing per line, avoid terse functional chains
- **Guard clauses:** Early returns with blank line after each guard
- **Named constants:** Hoist magic numbers to named `const`
- camelCase for variables/functions, PascalCase for classes/types
- **Import formatting:** Use multi-line expanded imports for 4+ named items
- **Extract and rename pattern:** When building data objects, extract and rename variables on separate lines before constructing the object rather than inline:
  ```typescript
  // Good
  const { order: knowledgeEntryOrder } = this.knowledgeEntry
  const data = { knowledgeEntryOrder, ...otherProps }

  // Bad
  const data = { knowledgeEntryOrder: this.knowledgeEntry.order, ...otherProps }
  ```
- **Prefer orchestration up front, pure helpers below:** Load required associations or context near the top-level `perform()`/service method, then pass simple values into small helper methods instead of hiding extra async lookups inside helpers.

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
- **Per-action class scaling:** For complex domains, use per-action classes in a subdirectory with barrel exports:
  - `services/estimates/bulk-generate.ts` exports `BulkGenerate extends BaseService`
  - `services/estimates/index.ts` re-exports with `export * from "./bulk-generate"`
  - Import as `import { BulkGenerate } from "@/services/estimates"` or namespace-imported

**Controller Pattern:**

Request lifecycle: `Route → Controller → Policy → Service → Model → Serializer → Response`

- RESTful controllers extending `BaseController`
- Standard CRUD: `index()`, `show()`, `create()`, `update()`, `destroy()`
- Routes: `GET /api/resources`, `GET /api/resources/:id`, `POST /api/resources`, etc.
- Authorization via `this.buildPolicy()` and `Policy.applyScope()`
- Serializers format output (IndexSerializer, ShowSerializer)
- Nested controllers in subfolders: `controllers/resource/action-controller.ts`
- **Namespacing rule:** Prefer `Forms.Estimates.GenerateController.create` over `FormsController#generateEstimates` — non-CRUD actions on large controllers reduce readability

**Serializer Naming Convention:**

- Use `AsIndex` for index serializer types (not `TableView`)
- Use `AsShow` for show serializer types
- Follow pattern: `{Model}AsIndex`, `{Model}AsShow`

**Response Patterns:**

- Multi-line JSON responses with consistent formatting
- Return policy information in create/update responses: `{ record, policy }`
- When create/update/show responses need association data beyond the base model, reload with the required includes and serialize the response instead of returning the raw Sequelize model
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

- One model per database table
- Keep model concerns focused on persistence, associations, scopes, and model-adjacent helpers
- Put business logic in services rather than growing models into service objects
- **Soft deletes:** All models support `deletedAt` timestamp (paranoid mode enabled globally)
- **Section order:** Prefer `Fields → Helpers → Associations → Static methods` ordering within model files
- **Scope naming:** Name scopes for the relationship or business rule, not the parameter type (e.g., `byFundingPeriod`, `byCentre`)
- **Anti-match scopes:** When excluding rows that already have a related record, prefer correlated `NOT EXISTS` predicates over client-built exclusion lists and over `NOT IN`
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

**Ledger vs Template Model Pattern:**

- **Template models** hold current configuration and rates. Can be updated over time. Changes only affect new ledger records.
- **Ledger models** record period-specific facts. Store values "as of" a specific period. Rate and other period-anchored fields are **copied at creation** and not re-templated later. User edits to transaction fields (such as `estimatedCost`, `notes`) are allowed for corrections.
- Do not re-template or automatically recompute frozen, period-anchored fields on ledger models.
- When designing new models, be explicit about which fields are copied "as of" a given period.

**Queries Directory:**

Use `api/src/queries/` for reusable raw SQL query builders when:
- The SQL is substantial enough that keeping it inline obscures the surrounding code
- The SQL is reused in multiple places or is likely to be
- The SQL should be tested directly as its own unit

Rules:
- Return a single SQL fragment or subquery — keep queries focused
- Prefer dedicated query files over overly generic helpers
- Models consume query builders from scopes; services consume them when composing larger expressions
- Test mirror: `api/src/queries/example/build-thing-query.ts` → `api/tests/queries/example/build-thing-query.test.ts`
- If a fragment is only used once and reads clearly inline, it does not need its own file

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

    table.foreign("field_name").references("users.id")
    // optionally depending on the use case
    // .onDelete("SET NULL")
    ```

  - **Down migration cleanup**: Always drop foreign key before dropping column

### Testing

**Running tests:** (see `api/tests/README.md` for full details)

- All API tests: `dev test` or `dev test api`
- All web tests: `dev test web`
- Specific API file: `dev test -- --run api/tests/services/example.test.ts` (`dev test` defaults to `api`)
- Specific web file: `dev test web -- --run web/tests/components/example.test.ts` (`web` keyword required)
- Source file shortcut: `dev test -- --run api/src/services/example.ts` (auto-converts to test path)
- Watch mode: omit `--run`
- Pattern matching: `dev test api -- --grep "pattern"`
- Path prefix (`api/` or `web/`) is auto-stripped by `bin/dev` for any argument position
- Legacy commands: `dev test_api` and `dev test_web` still work
- **Quick mode (skip global setup):** `dev test api --skip-setup -- --run <file>` runs ~5s instead of ~14s. Only use after the database is already initialized in the current session. Re-run without `--skip-setup` after pulling new migrations or resetting the database.
- **Single container rule (AI agents):** Only one test container can run at a time — two containers cause database deadlocks. Before starting a test run, check for an existing container: `docker ps --format '{{.Names}}' | grep test_api`. If one is running, watch its output instead of starting another: `docker logs -f <container-name>`. Do not start a second `dev test api` command while another is active.

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
- **One `expect` per test** — each test verifies one thing. Split distinct behaviors into separate tests.
- Assert database state via `findAll()` without where clauses (test isolation handles cleanup)
- Prefer concrete record assertions over count-only assertions. When asserting persisted results, prefer `findAll()` on the full table and compare records directly. Do not add restrictive `where` or `order` clauses unless that filter is the behavior under test.
- Combine count + content: `expect(records).toEqual([expect.objectContaining({...})])` (not separate `toHaveLength` + `toEqual`)
- **Expanded assertions:** When test expectation arrays or objects are easier to scan expanded, keep them one thing per line instead of collapsing:
  ```typescript
  expect(result).toEqual([
    expect.objectContaining({
      id: record.id,
    }),
  ])
  ```
- Avoid redundant `where` clauses in isolated scope or query tests unless the filter itself is under test.
- Import order in tests: third-party libraries first, then models, then factories, then the file under test.
- Negative spy assertions: `expect(spy).not.toHaveBeenCalled()` (never use `not.toHaveBeenCalledWith`)
- Controller tests: `mockCurrentUser(user)` and `request().get("/api/path")` from `@/support`
- **Error testing**: Use `.create()` with complete valid data, then destroy records to test "no longer exists" scenarios instead of using `.build()` with invalid IDs that cause foreign key violations
- When a lookup must exist in tests, prefer `rejectOnEmpty: true` instead of a manual null guard after `findByPk`/`findOne`

---

## Frontend Patterns & Conventions

### Code Style

- TypeScript only - no `any`, `@ts-expect-error`, `@ts-ignore`
- Vue 3 + Vuetify 3
- 2 spaces, no semicolons, double quotes, 100 char line limit
- camelCase for variables/functions, PascalCase for components
- **Props definition:** Prefer TypeScript generic style `defineProps<{ prop: type }>()`
- **Props defaults:** When `script setup` props need defaults, prefer `withDefaults(defineProps<...>(), ...)` rather than relying on optional props plus template checks alone.
- **Loading states:** Use `isNil(data)` instead of boolean `isLoading` flags for more precise data presence checks
- **Reactivity:** Use `toRefs(props)` when passing props to composables to maintain ref types and reactivity
- **Shared formatters:** Prefer existing helpers from `@/utils/formatters` over creating local inline formatters. Only add a new formatter when no suitable one exists.
- **Template refs:** Use `useTemplateRef("name")` instead of manual `ref<InstanceType<...> | null>(null)` for template references.
- **Top-level const placement:** Keep top-level `const` declarations near the code that uses them. Group by conceptual distance rather than hoisting everything to the top of `script setup`.
- **Explicit props over `$attrs`:** Define props explicitly rather than relying on `$attrs` inheritance or disabling it — explicit props are simpler and clearer.
- **Pass shared context from parents:** When a parent already has contextual data, pass it as a prop rather than having the child refetch the same record.
- **Date-only form state stays date-only:** For date-only inputs, keep form values as date-only strings and do timezone-aware datetime conversion only at the save boundary.
- **Prefer simple one-way helpers over writable proxy computeds:** Derive with a readonly helper/computed instead of introducing a writable proxy layer when a value is only needed for display or save-time transformation.
- **Vuetify-only classes:** Never use non-Vuetify utility classes (like Tailwind's `tracking-wide`). Stick to Vuetify typography and utility classes.
- **Semantic color usage:** Use theme colors (`primary`, `warning`, `secondary`) directly without lighten/darken modifiers.
- **Error notifications:** Use `console.error(...)` before `snack.error(...)` when handling a real error path. Do not log validation or other expected non-error user feedback with `console.error(...)`.
- **Legacy cleanup triage:** Before modernizing an isolated legacy frontend component, verify it is still reachable. If it is orphaned, prefer deleting it over migrating it.
- **Date formatter guard ordering:** In formatter helpers that accept `string | Date`, check `input instanceof Date` before generic `isEmpty(...)` checks — lodash treats JS `Date` objects as empty objects.
- **Browser setTimeout:** Use `number` type, not `NodeJS.Timeout`. Example: `const timer = ref<number | undefined>(undefined)`
- **Component guidance sharding:** Component-specific Vue/Vuetify patterns that are too granular for `AGENTS.md` belong in the nearest `web/src/components/README.md`. When a pattern is mainly about Vue component structure or Vuetify usage (not repo-wide architecture), document it there rather than expanding this file.

**Component Naming Convention:**

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

**Layout vs Page components:**

- **Pages** (`pages/`): Directly routable components. Name ends in `Page`. Path mirrors the URL.
- **Layouts** (`layouts/`): Components that contain a `<router-view>`. Name ends in `Layout`. Use a `Redirect` sibling (same name, suffix swapped) to redirect to the first child.
- **Page-specific components** live in `components/{page-name}/` subdirectory alongside their page.
- Route naming follows `{domain}/{resource}/{PageName}` — e.g., `administration/knowledge-entries/KnowledgeEntryEditPage`

### Architecture Patterns

**API Module Pattern:**
Type-safe API clients in `web/src/api/*-api.ts`

- Export types matching backend models/serializers
- Export `WhereOptions`, `FiltersOptions`, `QueryOptions` for query parameters
- Export API object with methods: `list()`, `get()`, `create()`, `update()`, `delete()`
- Methods return typed promises
- Example: `knowledgeEntriesApi.list(params)` → `Promise<{ knowledgeEntries: KnowledgeEntryAsIndex[], totalCount: number }>`
- **Type conventions:**
  - `list()` → returns `{ resources: ResourceAsIndex[], totalCount: number }`
  - `get()` → returns `{ resource: ResourceAsShow, policy: Policy }`
  - `create()` → returns `{ resource: ResourceAsShow }` or `{ resource: ResourceAsShow, policy: Policy }`
  - `update()` → returns `{ resource: ResourceAsShow, policy: Policy }`
  - `delete()` → returns `Promise<void>`
  - Always use `AsShow` for get/create/update, even if it's just an alias to the base model
  - Exclude `deletedAt` from frontend types (internal only)
  - Export `export type ResourcePolicy = Policy` for each resource
  - `FiltersOptions` come from the backend model's `establishScopes()` method
  - Keep deprecated `Object.freeze` constants alongside new TypeScript enums for backward compatibility, annotated with `@deprecated`
  - Enum naming: `{ModelName}{FieldName}` in PascalCase (e.g., `KnowledgeEntryStatuses`)

**Composable Pattern:**
Reactive data fetching in `web/src/use/use-*.ts`

_Plural form (`useResources`) for collections:_

- Accept `options` ref with query parameters, optional `skipWatchIf` function
- Return: `resources`, `totalCount`, `isLoading`, `isErrored`
- Provide: `fetch()` and `refresh()` methods
- Watch options with `deep: true, immediate: true`
- Use array watch pattern: `watch(() => [skipWatchIf(), unref(options)], async ([skip]) => { if (skip) return ... })`
- Always include `skipWatchIf` parameter (default `() => false`)
- Re-export types for consumer convenience (`WhereOptions`, `FiltersOptions`, `QueryOptions`, enums)
- State typed with explicit generic: `reactive<{ resources: ResourceAsIndex[]; totalCount: number; isLoading: boolean; isErrored: boolean }>()`

_Singular form (`useResource`) for single items:_

- Accept `id` ref (can be `number | null | undefined`)
- Parameter type is always `Ref<number | null | undefined>` — use descriptive name: `resourceId`
- Return: `resource`, `policy`, `isLoading`, `isErrored`
- Provide: `fetch()`, `refresh()`, optionally `save()`
- Watch id with `immediate: true`, skip if nil
- Always include null guard in `save()`: throw if `state.resource` is nil before updating
- Add `@deprecated` to stateful action methods (submit, approve) — prefer inline API calls in components
- Error logging: ``console.error(`Failed to fetch resource: ${error}`, { error })`` (template literal + object)

_Chaining composables with computed IDs:_

When you need to fetch a detail record based on a list lookup, chain composables using a computed ID:

```typescript
const resourcesQuery = computed(() => ({
  where: { name: props.name },
}))
const { resources } = useResources(resourcesQuery, {
  skipWatchIf: () => !isReady.value,
})
const resourceId = computed(() => resources.value[0]?.id)
const { resource } = useResource(resourceId)
```

This leverages Vue's reactivity — when `resources` updates, `resourceId` recomputes, triggering the singular composable to fetch automatically. Avoid manual watchers and imperative `fetch()` calls when reactive chaining suffices.

**Page-Based Edit Pattern (preferred over inline dialogs):**

For CRUD with server-side state, prefer the page pattern over inline dialogs:

- **EditCard** (`{Model}EditCard.vue`) — wrapper card with title and "New" button that navigates to `NewPage`
- **EditDataTable** (`{Model}EditDataTable.vue`) — server-paginated table with edit/delete navigation to `EditPage`
- **NewPage** (`{Model}NewPage.vue`) — standalone page for creating records
- **EditPage** (`{Model}EditPage.vue`) — standalone page for editing records

Key rules:
- Route props are always `string` — create `...AsNumber` computed using `parseInt()` for API calls, never `Number()`
- Action method naming: `createAndReturn()`, `saveAndReturn()`, `deleteAndReturn()`
- Form wrapper: `HeaderActionsFormCard` with `ref` and `validate()` guard before submit
- Use `v-skeleton-loader type="card@2"` on `EditPage` while record loads
- `returnTo` navigation: `useRouteQuery("returnTo", defaultReturnTo)` where `defaultReturnTo` uses `router.resolve().href`
- Route names follow `{model-plural}/{Model}NewPage` and `{model-plural}/{Model}EditPage` pattern
- `breadcrumbs` is a `computed` value passed to `useBreadcrumbs(breadcrumbs)`
- Never create separate `CreateForm` components — embed form inline in `NewPage`
- Always create separate `EditForm` components for `EditPage` (complex edit logic)

**Serializer Association Pattern:**

When a serializer depends on an eager-loaded association:
- Destructure associations first: `const { organization } = this.record`
- Fail with explicit preload errors: `throw new Error("Expected workflow organization association to be preloaded.")`
- Serialize associations into named locals before the returned object:
  ```typescript
  const serializedOrganization = Organizations.ReferenceSerializer.perform(organization)
  return {
    ...pick(this.record, ["id", "organizationId"]),
    organization: serializedOrganization,
  }
  ```
- When index rows need policy data, serialize it as `PolicyAsReference` using a small `serializePolicy(record, currentUser)` helper.

**Unique Field Validation Pattern:**

For fields requiring uniqueness validation across the database:
- Create a dedicated `{Model}{Field}UniqueTextField.vue` component
- Accept `excludingIds?: number[]` prop to allow the current record's own value
- Use `filters: { excludingIds }` (not `where: { excludeId }`) when querying for availability
- Component calls the API's `list()` endpoint with the candidate value and checks for zero results

**Financial Precision (if applicable):**

- Never use JavaScript arithmetic operators on financial values directly.
- Financial values should be strings in TypeScript, not `number`.
- Use SQL `DECIMAL` types for storage.
- Use `big.js` for arithmetic.
- Use `.toFixed(4)` for money and `.toFixed(2)` for percentages or hours.

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

See [`COMMITTING.md`](/COMMITTING.md) for commit message format, emoji guidance, and multi-concern commit conventions.

Follow the detailed patterns in `/agents/workflows/pull-request-management.md` for:

- Title conventions and formatting
- PR body structure and content
- Testing instructions format
- Quality checklist requirements

**Pre-submission:**

- All tests pass:
  - API: `dev test` or `dev test api`
  - Web: `dev test web`
- Type checking passes:
  - API: `dev test api -- --run api/src/**/*.ts` (type checking included)
  - Web: `dev test web -- --run web/src/**/*.ts` (type checking included)
- Linting passes:
  - API: `dev api npm run lint`
  - Web: `dev web npm run lint`
- Code formatting passes:
  - Check formatting: `git diff --name-only --diff-filter=ACM HEAD~1 | xargs npx prettier --check`
  - Fix formatting: `git diff --name-only --diff-filter=ACM HEAD~1 | xargs npx prettier --write`
- No `@ts-ignore`, `@ts-expect-error`, or `any` types
- Follow naming conventions (no abbreviations)
- Write tests for new functionality (AAA pattern)
- Never `git push --force` on main branch
- **One commit per logical change** — don't bundle multiple fixes or changes into a single commit

**Testing Instructions Format:**

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
- **Always verify UI element names against the actual Vue component source** before writing instructions — do not guess button labels or field names

For complex scenarios, use `## Test Case N: Description` subheadings.

**PR Description Guidelines:**

- **Concise language**: Use direct, active voice. Avoid redundant words like "entire", "proper", "fully"
- **Context section**: Focus on the problem and solution. Use present tense ("implements" not "will implement")
- **Implementation section**: Short, focused bullet points. Combine related items. Avoid qualifiers and unnecessary detail
- **Example**: "Add group creation service" instead of "Add proper group creation service for the entire system"

### Agent Workflow Discipline

**Codebase-wide search discipline:**
- Search for the **method or pattern**, not the variable name — variable names differ per file
- BAD: `form\.value\.validate` — misses `formRef`, `headerActionsFormCard`, etc.
- GOOD: `\.validate\(\)` — catches all call sites regardless of ref name
- When doing a codebase-wide pass, use the most general regex that captures the semantic pattern, then filter false positives manually

**Tracked files and permissions:**
- Do not ask for permission to edit or delete a file that is already tracked by git.
- Only escalate or ask for approval when the action is genuinely outside normal repository editing: sandbox restrictions, network access, or destructive operations the user did not request.

**Template/Workflow Separation:**
- Keep GitHub templates minimal with just structure
- Move detailed guidance, examples, and instructions to agent workflows
- Template = what to fill out, Workflow = how to fill it out

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
- `jira-issue-management.md` - Creating, enhancing, and managing Jira issues
- `code-review.md` - Code review quality control
- `testing-instructions.md` - Comprehensive testing instructions for PRs

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

- File name: `Type, Title, Date.md` (comma-separated, ISO date `YYYY-MM-DD`)
- **Type** is a clear category: `Plan`, `Backend Refactoring`, `Frontend Feature`, `Infrastructure`
- Examples:
  - `Plan, TK-26 - Add Internal User from the Active Directory, 2026-01-22.md`
  - `Backend Refactoring, Simplified Workflow Step Reordering, 2026-01-30.md`
  - `Frontend Feature, User Profile Enhancement, 2026-01-30.md`
- Use commas to separate components; no brackets or special characters; always ISO date format
- See `agents/plans/README.md` for the full plan structure template (problem statement, current state, options, recommended action, files changed)

**Reference Implementations in Workflows:**

Workflow files should cite a reference commit hash for any concrete implementation they describe:
- Format: `Reference: ModelName (commit: abc1234)`
- Include reference commits in workflow files so readers can `git show <hash>` for the authoritative example

**Workflow Frontmatter:**

All workflow files should include:
```yaml
---
description: Brief description of workflow purpose and scope
---
```
The `description` field helps AI assistants understand when to apply the workflow automatically.

---

## Quick Reference

### HTTP Status Codes

| Code | Meaning       | Used When             |
| ---- | ------------- | --------------------- |
| 200  | OK            | Successful GET, PATCH |
| 201  | Created       | Successful POST       |
| 204  | No Content    | Successful DELETE     |
| 400  | Bad Request   | General error         |
| 403  | Forbidden     | Policy check fails    |
| 404  | Not Found     | Record not found      |
| 422  | Unprocessable | Create/Update fails   |

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
if (!(await culturalProtocolService.canView(knowledgeEntry, user, community))) {
  return response.status(403).json({ message: "Access restricted by cultural protocol" })
}

// Log all access for audit trail
await auditLogService.create({
  knowledgeEntryId: entry.id,
  userId: user.id,
  communityId: community.id,
  action: "view",
  timestamp: new Date(),
})
```

**Data Handling Considerations:**

- Sensitive knowledge marked with protocol levels
- Export restrictions based on cultural protocols
- Watermarking for downloaded content
- Right to be forgotten for community members

---

## Changelog Management

- Maintain a single canonical `CHANGELOG.md` in the origin repository.
- Use Keep a Changelog structure with `## [Unreleased]` at the top.
- Track upstream releases with time-based versions: `vYYYY.MM.DD.x`.
- Keep origin-only work under `Unreleased` until it becomes part of an upstream release.
- Write user-facing entries grouped by theme, not commit-log summaries.
- For pull requests that change user-visible behavior or database schema, add at least one `Unreleased` entry. Pure refactors and test-only changes may be omitted and summarized later as a single "developer improvements" bullet during release preparation.
- Use a single bullet such as "Developer improvements to tests, migrations, and logging" for large batches of internal changes.
- Include short "Why?" explanations for major technical changes: framework upgrades, new subsystems, schema changes.

---

**Version:** 1.3
**Last Updated:** 2026-04-27
**Project:** Traditional Knowledge (TK)
