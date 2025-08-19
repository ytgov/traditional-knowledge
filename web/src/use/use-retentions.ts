import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import retentionsApi, {
  Retention,
  RetentionWhereOptions,
  RetentionFiltersOptions,
  RetentionQueryOptions,
} from "@/api/retentions-api"

export {
  type Retention,
  type RetentionWhereOptions,
  type RetentionFiltersOptions,
  type RetentionQueryOptions,
}

export function useRetentions(
  queryOptions: Ref<RetentionQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    retentions: Retention[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    retentions: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })
  async function fetch(): Promise<void> {
    state.isLoading = true
    try {
      const { retentions, totalCount } = await retentionsApi.list(unref(queryOptions))
      state.isErrored = false
      state.retentions = retentions
      state.totalCount = totalCount
    } catch (error) {
      console.error("Failed to fetch status:", error)
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

export default useRetentions
