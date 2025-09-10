import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import categoriesApi, {
  Category,
  CategoryFiltersOptions,
  CategoryWhereOptions,
} from "@/api/categories-api"

export { type Category, type CategoryWhereOptions, type CategoryFiltersOptions }

export function useCategory(id: Ref<number | null | undefined>) {
  const state = reactive<{
    category: Category | null
    isUpdate: boolean
    isLoading: boolean
    isErrored: boolean
  }>({
    category: null,
    isUpdate: !isNil(id.value),
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<Category> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { category } = await categoriesApi.get(staticId)
      state.isErrored = false
      state.category = category
      return category
    } catch (error) {
      console.error("Failed to fetch category:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<Category> {
    if (state.isUpdate) return update()
    else return create()
  }

  async function update(): Promise<Category> {
    const staticId = unref(id)

    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    if (isNil(state.category)) {
      throw new Error("No category to save")
    }

    state.isLoading = true
    try {
      const { category } = await categoriesApi.update(staticId, state.category)
      state.isErrored = false
      state.category = category
      return category
    } catch (error) {
      console.error("Failed to save category:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function create(): Promise<Category> {
    const staticId = unref(id)
    if (!isNil(staticId)) {
      throw new Error("id is not required")
    }

    if (isNil(state.category)) {
      throw new Error("No category to save")
    }

    state.isLoading = true
    try {
      const { category } = await categoriesApi.create(state.category)
      state.isErrored = false
      state.category = category
      return category
    } catch (error) {
      console.error("Failed to create category:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(id),
    async (newId) => {
      if (isNil(newId)) {
        ;(state.category as unknown) = { name: "" }

        return
      }

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

export default useCategory
