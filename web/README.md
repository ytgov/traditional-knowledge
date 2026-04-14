# Web — Frontend Patterns & Conventions

Vue 3 + Vuetify 3 + TypeScript + Vite + Pinia.

---

## Code Style

- TypeScript only — no `any`, `@ts-expect-error`, `@ts-ignore`.
- 2 spaces, no semicolons, double quotes, 100 char line limit.
- camelCase for variables/functions, PascalCase for components.
- **Props:** prefer `defineProps<{ prop: type }>()`. Use `withDefaults(defineProps<...>(), ...)` for defaults.
- **Loading states:** use `isNil(data)` instead of boolean `isLoading` flags.
- **Reactivity:** use `toRefs(props)` when passing props to composables.
- **Shared formatters:** prefer existing helpers from `@/utils/formatters`. Only add a new one when none exists.
- **Template refs:** use `useTemplateRef("name")` instead of `ref<InstanceType<...> | null>(null)`.
- **Top-level `const` placement:** keep near the code that uses it — group by conceptual distance, not hoisted to top.
- **Explicit props over `$attrs`:** define props explicitly rather than relying on `$attrs` inheritance.
- **Pass shared context from parents:** when a parent already has contextual data, pass it as a prop rather than having the child refetch.
- **Date-only form state stays date-only:** keep date-only inputs as date strings; do timezone conversion only at the save boundary.
- **Prefer simple one-way helpers:** derive with a readonly computed instead of a writable proxy when a value is only needed for display.
- **Vuetify-only classes:** never use non-Vuetify utility classes (e.g., Tailwind). Stick to Vuetify typography and utility classes.
- **Semantic color usage:** use theme colors (`primary`, `warning`, `secondary`) — no lighten/darken modifiers.
- **Error notifications:** `console.error(...)` before `snack.error(...)` on real error paths. Never use `console.error` for expected validation feedback.
- **Legacy cleanup:** before modernizing an isolated legacy component, verify it is still reachable. If orphaned, prefer deleting it.
- **Date formatter guard ordering:** in formatters that accept `string | Date`, check `input instanceof Date` before `isEmpty(...)` — lodash treats `Date` objects as empty.
- **Browser `setTimeout`:** use `number` type, not `NodeJS.Timeout`. Example: `const timer = ref<number | undefined>(undefined)`.

---

## Component Naming

**Pattern:** `{Model}{Purpose}{VuetifyComponent}.vue`

1. **Model/Domain** — primary data model (`KnowledgeEntry`, `CulturalProtocol`)
2. **Purpose** — specific functionality (`Filters`, `Edit`, `Search`)
3. **Vuetify Component** — wrapper (`Card`, `Dialog`, `DataTable`)

**Directory structure:**

- Location: `web/src/components/{model}/`
- Directories: kebab-case (`knowledge-entries`)
- Files: PascalCase (`KnowledgeEntryEditCard.vue`)

**Layout vs Page:**

- **Pages** (`pages/`): directly routable, name ends in `Page`, path mirrors URL.
- **Layouts** (`layouts/`): contain `<router-view>`, name ends in `Layout`.
- **Page-specific components** live in `components/{page-name}/` alongside their page.
- Route naming: `{domain}/{resource}/{PageName}` — e.g., `administration/knowledge-entries/KnowledgeEntryEditPage`.

---

## Subsystem Documentation

- **API clients** → [`src/api/README.md`](src/api/README.md)
- **Composables** → [`src/use/README.md`](src/use/README.md)
- **Components, pages, naming** → [`src/components/README.md`](src/components/README.md)
