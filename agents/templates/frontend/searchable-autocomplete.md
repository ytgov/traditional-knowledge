# Searchable Autocomplete Template

**Location:** `web/src/components/{resource-names}/`

Searchable autocomplete component with debounced search, pagination, and v-model support.

**Reference:** `UserSearchableAutocomplete.vue`, `GroupSearchableAutocomplete.vue`, `ExternalOrganizationSearchableAutocomplete.vue`

## Decision Rules

- **Simple models (name only):** Use `item-title="name"` without custom chip/list-item
- **Complex models (multiple display fields):** Create custom `{Model}Chip.vue` and `{Model}ListItem.vue`
- **Title conflicts:** If model has a `title` attribute, use `safeItemProps()` to omit it

## Prerequisites

- [ ] API client with `list()` supporting search filter
- [ ] `use-{resource-name}.ts` composable (singular, for selected value)
- [ ] `use-{resource-names}.ts` composable (plural, for search results)

## What This Produces

A Vue component that:
- Fetches data from an API endpoint with search filtering
- Debounces user input to avoid excessive API calls
- Shows paginated results with "Show More" option
- Maintains selected value via v-model
- Supports `where` and `filters` props for query customization

**Decision Rules:**
- **Simple models (name only):** Use `item-title="name"` without custom chip/list-item components
- **Complex models (multiple display fields):** Create custom `{Model}Chip.vue` and `{Model}ListItem.vue` components
- **Title conflicts:** If model has a `title` attribute, use `safeItemProps()` to omit it from list item props

## Prerequisites Checklist

Before starting, ensure:

- [ ] Model exists with API endpoint supporting `list()` with search filter
- [ ] `use-{model}.ts` composable exists (singular, for fetching selected value)
- [ ] `use-{models}.ts` composable exists (plural, for fetching search results)
- [ ] API types exported: `{Model}AsIndex`, `{Model}WhereOptions`, `{Model}FiltersOptions`

---

## Component Structure

### File Location

```
web/src/components/{models}/
  {Model}SearchableAutocomplete.vue
```

### Naming Convention

**Pattern:** `{Model}SearchableAutocomplete.vue` (singular model name)

**Examples:**
- `ExternalOrganizationSearchableAutocomplete.vue`
- `UserSearchableAutocomplete.vue`
- `GroupSearchableAutocomplete.vue`

---

## Template: Simple Autocomplete (Name Only)

Use this template when the model only displays `name`:

```vue
<template>
  <v-autocomplete
    :model-value="modelValue"
    :loading="isLoading"
    :items="allItems"
    label="Model Name"
    hint="Search for a model."
    item-value="id"
    item-title="name"
    auto-select-first
    chips
    clearable
    no-filter
    persistent-hint
    @update:model-value="emit('update:modelValue', $event)"
    @update:search="debouncedUpdateSearchToken"
    @click:clear="reset"
  >
    <template
      v-if="hasMore"
      #append-item
    >
      <v-divider />
      <v-list-item
        class="text-primary text-center"
        title="Show More"
        @click="nextPage"
      />
    </template>
  </v-autocomplete>
</template>

<!-- Special module scope (non-setup) required for exports -->
<script lang="ts">
export {
  type ModelAsIndex,
  type ModelWhereOptions,
  type ModelFiltersOptions,
} from "@/use/use-models"
</script>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"
import { debounce, isEmpty, isNil, uniqBy } from "lodash"

import useModel from "@/use/use-model"
import useModels, {
  type ModelAsIndex,
  type ModelWhereOptions,
  type ModelFiltersOptions,
} from "@/use/use-models"

const props = defineProps<{
  modelValue: number | null | undefined
  where?: ModelWhereOptions
  filters?: Omit<ModelFiltersOptions, "search">
}>()

const emit = defineEmits<{
  "update:modelValue": [modelId: number | null | undefined]
}>()

const modelId = computed(() => props.modelValue)
const { model } = useModel(modelId)

const searchToken = ref("")

function updateSearchToken(value: string) {
  searchToken.value = value
  page.value = 1
}

const debouncedUpdateSearchToken = debounce(updateSearchToken, 500)

const searchFilter = computed(() => {
  if (isNil(searchToken.value) || isEmpty(searchToken.value)) return {}

  return {
    search: searchToken.value,
  }
})

const perPage = computed(() => {
  if (isNil(searchToken.value) || isEmpty(searchToken.value)) return 100

  return 20
})

const page = ref(1)

const modelsQuery = computed<{
  where?: ModelWhereOptions
  filters?: ModelFiltersOptions
  perPage: number
  page: number
}>(() => {
  return {
    where: props.where,
    filters: {
      ...props.filters,
      ...searchFilter.value,
    },
    perPage: perPage.value,
    page: page.value,
  }
})
const { models, totalCount, isLoading, refresh } = useModels(modelsQuery)

const allItems = computed<ModelAsIndex[]>(() => {
  if (isNil(model.value)) {
    return models.value
  }

  return uniqBy([...models.value, model.value], "id")
})

async function reset() {
  searchToken.value = ""
  await refresh()
}

watch(
  () => props.modelValue,
  async (newModelValue) => {
    if (isEmpty(newModelValue)) {
      await reset()
    }
  }
)

const hasMore = computed(() => page.value * perPage.value < totalCount.value)

function nextPage() {
  page.value += 1
}

defineExpose({
  reset,
})
</script>
```

---

## Template: Complex Autocomplete (Custom Display)

Use this template when model needs custom chip and list item display:

```vue
<template>
  <v-autocomplete
    :model-value="modelValue"
    :loading="isLoading"
    :items="allItems"
    label="Model Name"
    hint="Search for a model."
    item-value="id"
    auto-select-first
    chips
    clearable
    no-filter
    persistent-hint
    @update:model-value="emit('update:modelValue', $event)"
    @update:search="debouncedUpdateSearchToken"
    @click:clear="reset"
  >
    <template #chip="{ props: chipProps, item: { raw: result } }">
      <ModelChip
        v-if="!isNil(result.id)"
        v-bind="chipProps"
        :model-id="result.id"
      />
      <v-chip
        v-else
        v-bind="chipProps"
        :text="'Unknown#' + JSON.stringify(result)"
      />
    </template>
    <template #item="{ props: itemProps, item: { raw: result } }">
      <ModelListItem
        v-if="!isNil(result.id)"
        v-bind="safeItemProps(itemProps)"
        :model-id="result.id"
      />
      <v-list-item
        v-else
        v-bind="safeItemProps(itemProps)"
        :title="'Unknown#' + (result.id || JSON.stringify(result))"
      />
    </template>
    <template
      v-if="hasMore"
      #append-item
    >
      <v-divider />
      <v-list-item
        class="text-primary text-center"
        title="Show More"
        @click="nextPage"
      />
    </template>
  </v-autocomplete>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"
import { debounce, isEmpty, isNil, omit, uniqBy } from "lodash"

import useModel from "@/use/use-model"
import useModels, {
  type ModelAsIndex,
  type ModelWhereOptions,
  type ModelFiltersOptions,
} from "@/use/use-models"

import ModelChip from "@/components/models/ModelChip.vue"
import ModelListItem from "@/components/models/ModelListItem.vue"

// ... same props, emit, state as simple template ...

/**
 * Title is an attribute of the Model object, which overrides the title in the list item, so title must be removed.
 */
function safeItemProps(itemProps: Record<string, unknown>) {
  return omit(itemProps, ["title"])
}

// ... rest same as simple template ...
</script>
```

---

## Key Patterns

### 1. Debounced Search (500ms)

```typescript
const debouncedUpdateSearchToken = debounce(updateSearchToken, 500)
```

Prevents excessive API calls while user types.

### 2. Pagination Strategy

```typescript
const perPage = computed(() => {
  if (isNil(searchToken.value) || isEmpty(searchToken.value)) return 100
  return 20
})
```

- **No search:** Load 100 items (covers most small datasets)
- **With search:** Load 20 items per page (focused results)

### 3. Preserve Selected Value

```typescript
const allItems = computed<ModelAsIndex[]>(() => {
  if (isNil(model.value)) {
    return models.value
  }
  return uniqBy([...models.value, model.value], "id")
})
```

Ensures currently selected item appears even if not in search results.

### 4. Reset on Clear

```typescript
async function reset() {
  searchToken.value = ""
  await refresh()
}
```

Clears search and refreshes to initial state.

### 5. Show More Pagination

```typescript
const hasMore = computed(() => page.value * perPage.value < totalCount.value)

function nextPage() {
  page.value += 1
}
```

Loads next page when user clicks "Show More".

---

## Implementation Checklist

- [ ] Component file created in correct directory
- [ ] Uses `no-filter` attribute (API handles filtering)
- [ ] Debounce set to 500ms
- [ ] Pagination with "Show More" implemented
- [ ] Selected value preserved via `uniqBy`
- [ ] `reset()` method exposed via `defineExpose`
- [ ] Type exports in module-scoped script block
- [ ] Props include `where` and `filters` for customization

---

## Common Pitfalls

1. **Forgetting `no-filter`:** Without this, Vuetify filters client-side AND API filters, causing confusion
2. **Missing type exports:** The module-scoped `<script lang="ts">` block is required for re-exporting types
3. **Not preserving selected value:** Always merge current selection with search results using `uniqBy`
4. **Wrong debounce timing:** Too short causes API spam, too long feels unresponsive (500ms is optimal)

