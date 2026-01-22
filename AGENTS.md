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
- `dev migrate make create-table-name` - Create new migration
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

**Database:**

- Knex for migrations, Sequelize for ORM
- Database: snake_case, Models: camelCase (Sequelize maps automatically)

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

### Agent Workflow Patterns

**Available Workflows:**

See `/agents/workflows/README.md` for the complete list of available workflows.

**Key Workflows:**
- `create-admin-ui.md` - Creating full CRUD admin interfaces
- `pull-request-management.md` - Creating and editing well-structured PRs
- `github-issue-creation.md` - Creating GitHub issues
- `jira-issue-creation.md` - Creating Jira issues in TK project

**Workflow Usage:**

**Example:**
```
Follow the workflow in agents/workflows/create-admin-ui.md
to create a comprehensive admin interface for Knowledge Entries.
```

Workflows are designed to be used with AI coding assistants and provide step-by-step guidance for complex, multi-step processes.

**Plan File Naming Convention:**

When creating new plan files in `/agents/plans/`, use the format:
- File name: `Plan, <Ticket-ID> - <Descriptive Title>, <YYYY-MM-DD>.md`
- Example: `Plan, TK-26 - Add Internal User from the Active Directory, 2026-01-22.md`

This ensures consistent naming and easy chronological sorting of plan documents.

---

## Code Patterns (Found in 3+ Places)

These patterns are consistently used throughout the codebase. Follow them when adding new features.

### Controller Patterns

**1. Error Handling with Try-Catch (All Controllers)**
```typescript
async index() {
  try {
    // business logic
    return this.response.json({ resources, totalCount })
  } catch (error) {
    logger.error("Error fetching resources" + error)
    return this.response.status(400).json({
      message: `Error fetching resources: ${error}`,
    })
  }
}
```

**Status codes:**
- 200: Success
- 201: Created
- 204: Deleted/No content
- 400: General error
- 403: Forbidden/unauthorized
- 404: Not found
- 422: Validation/creation/update error

**2. Policy Authorization Pattern (All Controllers)**
```typescript
async update() {
  // Load record
  const record = await this.loadRecord()
  if (isNil(record)) {
    return this.response.status(404).json({ message: "Record not found" })
  }

  // Check policy
  const policy = this.buildPolicy(record)
  if (!policy.update()) {
    return this.response.status(403).json({
      message: "You are not authorized to update this resource",
    })
  }

  // Permit attributes
  const permittedAttributes = policy.permitAttributes(this.request.body)

  // Perform update via service or direct
  // ...
}
```

**3. Private Helper Methods (All Controllers)**
```typescript
private async loadRecord() {
  return Model.findByPk(this.params.id, {
    include: ["association1", "association2"],
  })
}

private buildPolicy(record: Model = Model.build()) {
  return new ResourcePolicy(this.currentUser, record)
}
```

**4. Index Method with Scoping (All Controllers)**
```typescript
async index() {
  const where = this.buildWhere()
  const scopes = this.buildFilterScopes()
  const scopedModel = ResourcePolicy.applyScope(scopes, this.currentUser)

  const totalCount = await scopedModel.count({ where })
  const records = await scopedModel.findAll({
    where,
    limit: this.pagination.limit,
    offset: this.pagination.offset,
  })

  return this.response.json({ resources: records, totalCount })
}
```

**5. Service Delegation Pattern (Most Controllers)**
```typescript
// Create
const resource = await CreateService.perform(permittedAttributes, this.currentUser)

// Update
const resource = await UpdateService.perform(record, permittedAttributes, this.currentUser)
```

---

### Service Patterns

**1. Constructor Parameter Order (All Services)**
```typescript
// Create services
constructor(
  private attributes: ModelCreationAttributes,
  private currentUser: User
)

// Update services
constructor(
  private entity: Model,
  private attributes: UpdateAttributes,
  private currentUser: User
)

// Destroy services
constructor(
  private entity: Model,
  private currentUser: User
)
```

**Rule: Current user is always the last parameter**

**2. Static perform() Entry Point (All Services)**
```typescript
export class CreateService extends BaseService {
  async perform(): Promise<Model> {
    // implementation
  }
}

// Usage
const model = await CreateService.perform(attributes, currentUser)
```

**3. Early Validation with Lodash (All Services)**
```typescript
async perform(): Promise<Model> {
  if (isNil(this.attributes.title)) {
    throw new Error("Title is required")
  }
  if (isEmpty(this.attributes.email)) {
    throw new Error("Email is required")
  }

  // business logic
}
```

**4. Transaction Wrapping (Many Services)**
```typescript
async perform(): Promise<Model> {
  return db.transaction(async () => {
    const record = await Model.create(this.attributes)
    await RelatedModel.create({ recordId: record.id })
    return record
  })
}
```

---

### Model Patterns

**1. Establish Scopes Method (All Models)**
```typescript
export class User extends BaseModel<...> {
  // ... attributes ...

  static establishScopes(): void {
    this.addSearchScope(["firstName", "lastName", "email"])

    this.addScope("notInGroup", (groupId: number) => ({
      where: {
        id: {
          [Op.notIn]: sql`(SELECT user_id FROM user_groups WHERE group_id = :groupId)`,
        },
      },
      replacements: { groupId },
    }))
  }
}
```

**2. Soft Delete Pattern (All Models)**
```typescript
@Attribute(DataTypes.DATE(0))
declare deletedAt: CreationOptional<Date | null>
```

Records are never physically deleted, only soft-deleted by setting `deletedAt`.

**3. Standard Timestamps (All Models)**
```typescript
@Attribute(DataTypes.DATE(0))
@NotNull
@Default(sql.fn("getutcdate"))
declare createdAt: CreationOptional<Date>

@Attribute(DataTypes.DATE(0))
@NotNull
@Default(sql.fn("getutcdate"))
declare updatedAt: CreationOptional<Date>
```

**4. Association Pattern (All Models)**
```typescript
// HasMany
@HasMany(() => RelatedModel, {
  foreignKey: "userId",
  inverse: "user",
})
declare relatedModels?: NonAttribute<RelatedModel[]>

// BelongsTo
@BelongsTo(() => User, {
  foreignKey: "userId",
  inverse: {
    as: "createdItems",
    type: "hasMany",
  },
})
declare user?: NonAttribute<User>

// BelongsToMany
@BelongsToMany(() => Group, {
  through: () => UserGroup,
  foreignKey: "userId",
  otherKey: "groupId",
  inverse: "users",
})
declare groups?: NonAttribute<Group[]>
```

**5. Enum as Static Readonly (Many Models)**
```typescript
export enum UserRoles {
  SYSTEM_ADMIN = "system_admin",
  USER = "user",
}

export class User extends BaseModel<...> {
  static readonly Roles = UserRoles

  @ValidateAttribute({
    isIn: {
      args: [Object.values(UserRoles)],
      msg: `Role must be one of ${Object.values(UserRoles).join(", ")}`,
    },
  })
  declare roles: string[]
}
```

---

### Policy Patterns

**1. System Admin Bypass (9 Policies)**
```typescript
show(): boolean {
  if (this.user.isSystemAdmin) return true
  // ... other checks
}

create(): boolean {
  if (this.user.isSystemAdmin) return true
  // ... other checks
}
```

**2. CRUD Method Structure (All Policies)**
```typescript
export class ResourcePolicy extends BasePolicy<Model> {
  show(): boolean {
    // Check if user can view
  }

  create(): boolean {
    // Check if user can create
  }

  update(): boolean {
    // Check if user can modify
  }

  destroy(): boolean {
    // Check if user can delete
  }
}
```

**3. Permitted Attributes (All Policies)**
```typescript
permittedAttributes(): Path[] {
  const attributes = ["field1", "field2", "field3"]

  if (this.user.isSystemAdmin) {
    attributes.push("adminOnlyField")
  }

  return attributes
}

permittedAttributesForCreate(): Path[] {
  return ["foreignKeyId", ...this.permittedAttributes()]
}
```

**4. Policy Scope Pattern (All Policies)**
```typescript
// All records (admin)
static policyScope(_user: User): FindOptions<Attributes<Model>> {
  return {}  // or ALL_RECORDS_SCOPE
}

// User-owned records
static policyScope(user: User): FindOptions<Attributes<Model>> {
  return {
    where: {
      userId: user.id,
    },
  }
}

// Complex filtering with associations
static policyScope(user: User): FindOptions<Attributes<Model>> {
  return {
    include: [
      {
        association: "accessGrants",
        where: { userId: user.id },
      },
    ],
  }
}
```

**5. User Ownership Check (4 Policies)**
```typescript
update(): boolean {
  if (this.user.isSystemAdmin) return true
  if (this.user.id === this.record.userId) return true
  return false
}
```

---

### Vue Component Patterns

**1. Form Wrapper (All Forms)**
```vue
<template>
  <v-form ref="formRef" @submit.prevent="saveWrapper">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <!-- form fields -->
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn :loading="isLoading" type="submit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
```

**2. Form Validation (All Forms)**
```typescript
async function saveWrapper() {
  if (isNil(formRef.value)) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  isLoading.value = true
  try {
    await save()
    snack.success("Saved successfully")
    router.push({ name: "list-page" })
  } catch (error) {
    console.error("Save failed:", error)
    snack.error(`Save failed: ${error}`)
  } finally {
    isLoading.value = false
  }
}
```

**3. Composables for API Calls (All Components)**
```typescript
// Single item composable
const { item, isLoading, isErrored, save, refresh } = useItem(itemId)

// List composable
const { items, totalCount, isLoading, refresh } = useItems(queryOptions)
```

**Composable auto-fetches on ID/query change via `watch()`**

**4. Loading State Management (All Async Operations)**
```typescript
const isLoading = ref(false)

async function performAction() {
  isLoading.value = true
  try {
    await api.doSomething()
  } finally {
    isLoading.value = false
  }
}
```

```vue
<v-btn :loading="isLoading" @click="performAction">Action</v-btn>
<v-data-table-server :loading="isLoading" ... />
<v-skeleton-loader v-if="isLoading" type="card" />
```

**5. Error Notifications (All Error Handling)**
```typescript
import { useSnack } from "@/composables/use-snack"

const snack = useSnack()

try {
  await save()
  snack.success("Item saved")
} catch (error) {
  console.error("Failed:", error)
  snack.error(`Failed: ${error}`)
}
```

**6. Debounced Search (All Autocomplete Components)**
```typescript
import { debounce } from "lodash"

const searchToken = ref("")
const debouncedSearch = debounce((value: string) => {
  searchToken.value = value
}, 500)
```

**7. Route Query Persistence (All Data Tables)**
```typescript
import { useRouteQuery } from "@vueuse/router"

const page = useRouteQuery("page", "1", { transform: Number })
const perPage = useRouteQuery("perPage", "10", { transform: Number })
const sortBy = useVuetifySortByToSafeRouteQuery("sortBy", [...])
```

Pagination, sorting, and filtering persist to URL for shareable links.

**8. Skeleton Loaders (All Edit Forms)**
```vue
<template>
  <v-skeleton-loader v-if="isNil(item)" type="card" />
  <v-form v-else ref="formRef">
    <!-- form content -->
  </v-form>
</template>
```

---

### Cross-Cutting Patterns

**1. Lodash Utilities (Backend)**
- `isNil()` - Check null or undefined
- `isEmpty()` - Check empty strings, arrays, objects
- `isUndefined()` - Strict undefined check
- `omit()` - Remove properties from objects
- `pick()` - Select specific properties
- `uniqBy()` - Unique array by property
- `debounce()` - Debounce functions (also frontend)

**2. Logger Usage (Backend)**
```typescript
import logger from "@/utils/logger"

logger.error("Error message", { error, context })
logger.warn("Warning message")
logger.info("Info message")
logger.debug("Debug message")
```

**3. Conditional Where Clauses (Backend)**
```typescript
const where: WhereOptions<Model> = {}

if (!isNil(filters.status)) {
  where.status = filters.status
}

if (!isEmpty(filters.search)) {
  // apply search
}
```

---

## File Naming Conventions

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

**Workflow Version:** 1.0
**Last Updated:** 2026-01-22
**Project:** Traditional Knowledge (TK)
