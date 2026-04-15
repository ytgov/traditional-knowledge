# Components

→ **Copy-paste templates:** [`agents/templates/frontend/components.md`](../../../agents/templates/frontend/components.md) · [`agents/templates/frontend/pages.md`](../../../agents/templates/frontend/pages.md) · [`agents/templates/frontend/searchable-autocomplete.md`](../../../agents/templates/frontend/searchable-autocomplete.md)

For complete feature scaffolding: [`agents/workflows/create-admin-ui.md`](../../../agents/workflows/create-admin-ui.md)

## Naming Convention

**Pattern:** `{Model}{Purpose}{VuetifyComponent}.vue`

1. **Model/Domain** — primary data model (`KnowledgeEntry`, `CulturalProtocol`)
2. **Purpose** — specific functionality (`Filters`, `Edit`, `Search`)
3. **Vuetify Component** — wrapper (`Card`, `Dialog`, `DataTable`)

- Directories: kebab-case (`knowledge-entries/`)
- Files: PascalCase (`KnowledgeEntryEditCard.vue`)

## Layout vs Page

- **Pages** (`pages/`): directly routable, name ends in `Page`, path mirrors URL.
- **Layouts** (`layouts/`): contain `<router-view>`, name ends in `Layout`. Use a `Redirect` sibling to redirect to first child.
- **Page-specific components** live in `components/{page-name}/` alongside their page.
- Route naming: `{domain}/{resource}/{PageName}` — e.g., `administration/knowledge-entries/KnowledgeEntryEditPage`.

## Page-Based Edit Pattern

For CRUD with server-side state, prefer the page pattern over inline dialogs:

- **EditCard** (`{Model}EditCard.vue`) — wrapper with title and "New" button that navigates to `NewPage`.
- **EditDataTable** (`{Model}EditDataTable.vue`) — server-paginated table with edit/delete navigation.
- **NewPage** (`{Model}NewPage.vue`) — standalone page for creating records.
- **EditPage** (`{Model}EditPage.vue`) — standalone page for editing records.

Key rules:
- Route props are always `string` — create `...AsNumber` computed using `parseInt()` for API calls, never `Number()`.
- Action method naming: `createAndReturn()`, `saveAndReturn()`, `deleteAndReturn()`.
- Form wrapper: `HeaderActionsFormCard` with `ref` and `validate()` guard before submit.
- Use `v-skeleton-loader type="card@2"` on `EditPage` while record loads.
- `returnTo` navigation: `useRouteQuery("returnTo", defaultReturnTo)` where `defaultReturnTo` uses `router.resolve().href`.
- Route names follow `{model-plural}/{Model}NewPage` and `{model-plural}/{Model}EditPage` pattern.
- `breadcrumbs` is a `computed` value passed to `useBreadcrumbs(breadcrumbs)`.
- Never create separate `CreateForm` components — embed form inline in `NewPage`.
- Always create separate `EditForm` components for `EditPage` (complex edit logic).

## Unique Field Validation Pattern

- Create a dedicated `{Model}{Field}UniqueTextField.vue` component.
- Accept `excludingIds?: number[]` to allow the current record's own value.
- Use `filters: { excludingIds }` (not `where: { excludeId }`) when querying for availability.
- Component calls the API's `list()` endpoint with the candidate value and checks for zero results.

## Serializer Association Pattern

- Destructure associations first; throw explicit preload errors if missing.
- Serialize associations into named locals before the returned object:
  ```typescript
  const serializedOrganization = Organizations.ReferenceSerializer.perform(organization)
  return {
    ...pick(this.record, ["id", "organizationId"]),
    organization: serializedOrganization,
  }
  ```
- When index rows need policy data, serialize as `PolicyAsReference` using a small `serializePolicy(record, currentUser)` helper.
