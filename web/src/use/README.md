# Composables (`use/`)

Reactive data fetching in `web/src/use/use-*.ts`. → **Copy-paste template:** [`agents/templates/frontend/composables.md`](../../../agents/templates/frontend/composables.md)

## Plural Form (`useResources`) — for collections

- Accept `options` ref with query parameters + optional `skipWatchIf` function (default `() => false`).
- Return: `resources`, `totalCount`, `isLoading`, `isErrored`, `fetch()`, `refresh()`.
- Watch with `deep: true, immediate: true`.
- Array watch pattern:
  ```typescript
  watch(() => [skipWatchIf(), unref(options)], async ([skip]) => {
    if (skip) return
    // fetch...
  })
  ```
- Re-export types for consumer convenience (`WhereOptions`, `FiltersOptions`, `QueryOptions`, enums).
- State typed with explicit generic:
  ```typescript
  reactive<{ resources: ResourceAsIndex[]; totalCount: number; isLoading: boolean; isErrored: boolean }>()
  ```

## Singular Form (`useResource`) — for single items

- Accept `id` ref typed as `Ref<number | null | undefined>`. Use descriptive name: `resourceId`.
- Return: `resource`, `policy`, `isLoading`, `isErrored`, `fetch()`, `refresh()`.
- Skip fetch when id is nil.
- Always include null guard in `save()`: throw if `state.resource` is nil before updating.
- Add `@deprecated` to stateful action methods (submit, approve) — prefer inline API calls in components.
- Error logging: `` console.error(`Failed to fetch resource: ${error}`, { error }) ``

## Chaining Composables with Computed IDs

When you need a detail record based on a list lookup, chain with a computed ID:

```typescript
const resourcesQuery = computed(() => ({ where: { name: props.name } }))
const { resources } = useResources(resourcesQuery, { skipWatchIf: () => !isReady.value })
const resourceId = computed(() => resources.value[0]?.id)
const { resource } = useResource(resourceId)
```

Vue's reactivity handles re-fetching automatically. Avoid manual watchers and imperative `fetch()` calls when reactive chaining suffices.
