import { type Ref, reactive, ref, toRefs, unref, watch } from "vue"

import categoriesApi, {
  Category,
  CategoryFiltersOptions,
  CategoryWhereOptions,
  CategoryQueryOptions
} from "@/api/categories-api"

export { type Category, type CategoryWhereOptions, type CategoryFiltersOptions, type CategoryQueryOptions }

export function useCategories(
  queryOptions: Ref<CategoryQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
  categories: Category[]
  totalCount: number
  isLoading: boolean
  isErrored: boolean
}>({
  categories: [],
  totalCount: 0,
  isLoading: false,
  isErrored: false,
})
  async function fetch(): Promise<void> {
    state.isLoading = true
    try {
      const { categories, totalCount } = await categoriesApi.list(unref(queryOptions))
      state.isErrored = false
      state.categories = categories
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

export default useCategories
