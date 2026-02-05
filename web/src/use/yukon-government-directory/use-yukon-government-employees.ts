import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import employeesApi, {
  type YukonGovernmentEmployee,
  type YukonGovernmentEmployeeWhereOptions,
  type YukonGovernmentEmployeeQueryOptions,
} from "@/api/yukon-government-directory/employees-api"

export {
  type YukonGovernmentEmployee,
  type YukonGovernmentEmployeeWhereOptions,
  type YukonGovernmentEmployeeQueryOptions,
}

export function useYukonGovernmentEmployees(
  queryOptions: Ref<YukonGovernmentEmployeeQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    employees: YukonGovernmentEmployee[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    employees: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<YukonGovernmentEmployee[]> {
    state.isLoading = true
    try {
      const { employees, totalCount } = await employeesApi.list(unref(queryOptions))
      state.isErrored = false
      state.employees = employees
      state.totalCount = totalCount
      return employees
    } catch (error) {
      console.error(`Failed to fetch Yukon Government employees: ${error}`, { error })
      state.isErrored = true
      state.employees = []
      state.totalCount = 0
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

  function reset() {
    state.employees = []
    state.totalCount = 0
    state.isLoading = false
    state.isErrored = false
  }

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
    reset,
  }
}

export default useYukonGovernmentEmployees
