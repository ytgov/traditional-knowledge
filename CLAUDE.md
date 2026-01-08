# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Traditional Knowledge is a Yukon Government application for managing traditional knowledge archive items with access control via information sharing agreements and groups. Built with a monorepo structure containing API (backend), Web (frontend), and Archiver services.

**Stack:**
- Backend: Node.js + Express + TypeScript + Sequelize 7 + Knex (migrations)
- Frontend: Vue 3 + Vuetify + TypeScript + Axios + Pinia
- Database: Microsoft SQL Server (MSSQL)
- Auth: Auth0 with JWT
- Storage: Azure Blob Storage
- Cache: Redis
- Mail: MailDev (dev) / Outlook365 (prod)

## Development Commands

### Docker-based Development (Recommended)

Use the `dev` command (Ruby wrapper for docker compose) or `docker compose -f docker-compose.development.yml`:

```bash
# Boot all services with watch mode
dev up --watch
# or: dev watch

# Boot individual services
dev up api
dev up web
dev up db

# Stop services
dev down

# Wipe database
dev down -v

# Run API tests
dev test_api

# Access database CLI
dev sqlcmd
```

### Local Development (requires asdf + node installed)

```bash
# Install dependencies at root
npm install

# Install per-service dependencies (for IDE linting/types)
cd api && npm i
cd web && npm i

# Run services locally
cd api && npm run start        # API on :3000
cd web && npm run start         # Web on :8080
cd api && npm run start:scheduler  # Scheduler service
```

### Build & Test

```bash
# API
cd api
npm run build          # Build TypeScript
npm run clean          # Remove dist/
npm test              # Run vitest tests
npm run lint          # ESLint
npm run check-types   # TypeScript check

# Web
cd web
npm run build          # Build for production
npm run preview        # Preview production build
npm test              # Run vitest tests
npm run lint          # ESLint
npm run check-types   # Vue TypeScript check
```

### Database Migrations

Using Knex with snake_case in DB, camelCase in JS (via Sequelize models):

```bash
# Create migration
dev migrate make create-table-name
# or: dev knex migrate:make create-table-name

# Run migrations
dev migrate latest
# or: dev migrate up

# Rollback last migration
dev migrate down

# Rollback all migrations
dev migrate rollback --all

# Create seed
dev seed make seed-name
# or: dev knex seed:make seed-name

# Run seeds
dev seed run
```

Seeds are environment-specific (`api/src/db/seeds/development` vs `production`). Seeds should be idempotent as they don't track run state.

Migrations can also be triggered via web UI after login:
- http://localhost:3000/migrate/latest
- http://localhost:3000/migrate/up
- http://localhost:3000/migrate/down
- http://localhost:3000/migrate/seed

### Production Build Testing

```bash
# Build production image locally
docker compose up --build

# Or with build args
docker compose build \
  --build-arg RELEASE_TAG=$(date +%Y.%m.%d) \
  --build-arg GIT_COMMIT_HASH=$(git rev-parse HEAD)
```

## Architecture Patterns

### Backend (API)

The backend follows a **Policy-Controller-Service-Model** architecture inspired by Rails conventions:

**Models** (`api/src/models/`)
- Extend `BaseModel` which extends Sequelize's `Model`
- Use camelCase for JavaScript (snake_case in DB via Sequelize)
- Key methods: `findBySlugOrPk()`, `findEach()` for batch processing
- Search scopes: `addSearchScope()` for full-text search

**Controllers** (`api/src/controllers/`)
- Extend `BaseController` with CRUD action methods: `index`, `show`, `create`, `update`, `destroy`
- Static getters map to Express routes (e.g., `UsersController.index` → `GET /api/users`)
- Helper properties: `currentUser`, `params`, `query`, `pagination`
- Helper methods: `buildWhere()`, `buildFilterScopes()`, `buildOrder()`
- Caching support: Set `cacheIndex`, `cacheShow`, `cacheDuration`, `cachePrefix`
- Namespace controllers for complex routes (e.g., `Users.DirectorySyncController` for `/api/users/:userId/directory-sync`)

**Policies** (`api/src/policies/`)
- Control data access and permissions
- Methods mirror controller actions: `create()`, `update()`, `show()`, `destroy()`
- `permittedAttributes()` provides allowlist for mass assignment
- `policyScope()` restricts query results based on user permissions
- `applyScope()` applies scopes to models for filtered queries

**Services** (`api/src/services/`)
- Business logic layer for create/update/delete operations
- Typically namespaced by model (e.g., `services/users/create-service.ts`)
- Pattern: `CreateService.perform(attributes, currentUser)`

**Serializers** (`api/src/serializers/`)
- Transform DB representation to frontend format
- Add/remove fields before sending to client
- Usage: `IndexSerializer.perform(models)` in controllers

**Middlewares** (`api/src/middlewares/`)
- JWT validation: `jwt-middleware.ts`
- Authorization: `authorization-middleware.ts`
- Request logging: `request-logger-middleware.ts`
- Caching: `cache-middleware.ts`

**Mailers** (`api/src/mailers/`)
- Email templates using MJML
- Base class: `BaseMailer` extends `ApplicationMailer`
- Namespaced by domain (e.g., `mailers/groups/notify-admins-of-added-user-mailer.ts`)

**Database** (`api/src/db/`)
- `db-client.ts`: Sequelize connection
- `cache-client.ts`: Redis client
- `migrations/`: Knex migrations (snake_case naming)
- `seeds/`: Environment-specific seeds (development/production)

### Frontend (Web)

**Pages** (`web/src/pages/`)
- Directly routable components ending in `Page`
- Directory structure mirrors URL structure
- Route names: path-based (e.g., `travel-requests/details/DetailsPage`)
- Edit variants use `*EditPage` suffix

**Components** (`web/src/components/`)
- Organized by domain (e.g., `archive-items/`, `groups/`, `users/`)
- Common reusables in `common/`
- Layout components in `default-layout/`

**API Layer** (`web/src/api/`)
- One file per backend resource (e.g., `users-api.ts`)
- Standardized CRUD methods: `list()`, `get()`, `create()`, `update()`, `delete()`
- Axios-based HTTP client in `http-client.ts`
- Type definitions for models and query parameters

**Layouts** (`web/src/layouts/`)
- `DefaultLayout.vue`: Standard authenticated layout
- `BlankLayout.vue`: Minimal layout (e.g., for sign-in)

**State Management**
- Pinia stores for global state
- API calls from components using API layer

### Archiver Service

Separate service for background document processing/archiving. Uses same DB as API. Has its own scheduler for periodic tasks.

## Key Concepts

### Information Sharing Agreements (ISAs)
- Define access rules for archive items
- Have access grants that specify which groups/users can access items
- Archive items can be linked to multiple ISAs

### Groups
- Collections of users with shared permissions
- Users can belong to multiple groups
- Group admins manage membership

### Archive Items
- Core content entities with files, categories, retentions
- Security levels control visibility
- Audit trail tracks all changes
- Files stored in Azure Blob Storage

### Notifications
- User notifications for group membership, access grants, etc.
- Email notifications (can be disabled per-user)
- Services generate notifications on key events

## Testing

**API Tests** (`api/tests/`)
- Vitest framework
- Pattern: `api/tests/{path}/{filename}.test.ts` mirrors `api/src/{path}/{filename}.ts`
- Global setup: `tests/global-setup.ts` (DB setup, migrations, seeds)
- Per-file setup: `tests/setup.ts` (cleanup between test files)
- Run: `npm test` or `dev test_api`

**Test Structure:**
```typescript
describe("api/src/services/users/create-service.ts", () => {
  describe("CreateService", () => {
    describe(".perform", () => {
      test("creates a new user in the database", async () => {
        // test implementation
      })
    })
  })
})
```

## Configuration

**Environment Variables:**
- Development: `api/.env.development`, `archiver/.env.development`
- Production: `.env` (not committed)
- See `docker-compose.development.yml` → `x-default-environment` for defaults
- Required secret: `BLOB_CONNECTION_STRING`

**Key Config Files:**
- `api/src/config.ts`: Central configuration
- `api/src/config.d/knexfile.ts`: Knex/migration config
- `web/vite.config.ts`: Vite build config

## Auth & Security

- Auth0 for authentication (JWT tokens)
- Third-party cookies required (browser tracking protection must be disabled)
- JWT middleware validates tokens on API requests
- Authorization middleware loads `currentUser`
- Helmet for security headers (CSP configured in `app.ts`)
- Policies enforce row-level security

## Common Patterns

**Creating a new resource:**
1. Create migration in `api/src/db/migrations/`
2. Create model in `api/src/models/`
3. Create policy in `api/src/policies/`
4. Create controller in `api/src/controllers/`
5. Create services in `api/src/services/{resource}/`
6. Add routes to `api/src/router.ts`
7. Create serializer in `api/src/serializers/` (if needed)
8. Create API layer in `web/src/api/{resource}-api.ts`
9. Create components in `web/src/components/{resource}/`
10. Create pages in `web/src/pages/{resource}/`
11. Add routes to `web/src/router/`

**Controller namespace pattern for custom actions:**
- Prefer namespaced controllers over custom actions
- Example: `POST /api/users/:userId/directory-sync` → `Users.DirectorySyncController.create`
- Not: `UsersController.directorySync()`

**Path aliases:**
- `@/` resolves to `src/` in both API and Web
- Configured in `tsconfig.json` paths

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

## File Naming Conventions

- Database: snake_case (tables, columns)
- JavaScript/TypeScript: camelCase (variables, properties)
- Vue Components: PascalCase
- Files: kebab-case for multi-word files
- Controllers: `*-controller.ts`
- Services: `*-service.ts`
- Models: singular (e.g., `user.ts`)
- Migrations: timestamp prefix + descriptive name

## Notes

- Database table/column names use snake_case but Sequelize models use camelCase
- Controllers should use BaseController helpers, not direct Sequelize queries
- Policies must be checked before any data access in controllers
- Services handle business logic, not controllers
- Serializers transform data for API responses
- Frontend API layer provides single point of update if backend changes
- Seeds must be idempotent (can run multiple times safely)
