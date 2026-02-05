# Composables Templates

**Location:** `web/src/use/`

Create 2 files: one for list (plural) and one for single item (singular).

---

## use-{resource-names}.ts (List Composable)

```typescript
import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import resourceNamesApi, {
  type ResourceNameAsIndex,
  type ResourceNameWhereOptions,
  type ResourceNameFiltersOptions,
  type ResourceNameQueryOptions,
} from "@/api/resource-names-api"

export {
  type ResourceNameAsIndex,
  type ResourceNameWhereOptions,
  type ResourceNameFiltersOptions,
  type ResourceNameQueryOptions,
}

export function useResourceNames(
  queryOptions: Ref<ResourceNameQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    resourceNames: ResourceNameAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    resourceNames: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<ResourceNameAsIndex[]> {
    state.isLoading = true
    try {
      const { resourceNames, totalCount } = await resourceNamesApi.list(
        unref(queryOptions)
      )
      state.isErrored = false
      state.resourceNames = resourceNames
      state.totalCount = totalCount
      return resourceNames
    } catch (error) {
      console.error(`Failed to fetch resource names: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => [skipWatchIf(), unref(queryOptions)],
    async ([skip]) => {
      if (skip) return

      await fetch()
    },
    { deep: true, immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
  }
}

export default useResourceNames
```

---

## use-{resource-name}.ts (Single Item Composable)

```typescript
import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import resourceNamesApi, {
  type ResourceNameAsShow,
  type ResourceNamePolicy,
} from "@/api/resource-names-api"

export { type ResourceNameAsShow, type ResourceNamePolicy }

export function useResourceName(resourceNameId: Ref<number | null | undefined>) {
  const state = reactive<{
    resourceName: ResourceNameAsShow | null
    policy: ResourceNamePolicy | null
    isLoading: boolean
    isErrored: boolean
  }>({
    resourceName: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<ResourceNameAsShow> {
    const staticId = unref(resourceNameId)
    if (isNil(staticId)) {
      throw new Error("resourceNameId is required")
    }

    state.isLoading = true
    try {
      const { resourceName, policy } = await resourceNamesApi.get(staticId)
      state.isErrored = false
      state.resourceName = resourceName
      state.policy = policy
      return resourceName
    } catch (error) {
      console.error("Failed to fetch resource name:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<ResourceNameAsShow> {
    const staticId = unref(resourceNameId)
    if (isNil(staticId)) {
      throw new Error("resourceNameId is required")
    }

    if (isNil(state.resourceName)) {
      throw new Error("No resource name to save")
    }

    state.isLoading = true
    try {
      const { resourceName, policy } = await resourceNamesApi.update(
        staticId,
        state.resourceName
      )
      state.isErrored = false
      state.resourceName = resourceName
      state.policy = policy
      return resourceName
    } catch (error) {
      console.error(`Failed to save resource name: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(resourceNameId),
    async (newId) => {
      if (isNil(newId)) return

      await fetch()
    },
    { immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
    save,
  }
}

export default useResourceName
```

---

## Checklist

- [ ] List composable uses `Ref<QueryOptions>` parameter
- [ ] List composable has `skipWatchIf` option
- [ ] Single composable uses `Ref<number | null | undefined>` parameter
- [ ] Single composable has `save()` method
- [ ] Both use `reactive()` + `toRefs()` pattern
- [ ] Both have `fetch()` and `refresh()` methods
- [ ] Both export types from API client
- [ ] Both have default exports

## Usage Examples

### List Composable

```typescript
const queryOptions = computed(() => ({
  filters: { search: searchTerm.value },
  perPage: 10,
  page: 1,
}))

const { resourceNames, totalCount, isLoading, refresh } = useResourceNames(queryOptions)
```

### Single Item Composable

```typescript
const resourceNameId = toRef(props, "resourceNameId")
const { resourceName, policy, isLoading, save } = useResourceName(resourceNameId)

async function handleSave() {
  await save()
  snack.success("Saved!")
}
```
