import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import externalOrganizationsApi, {
  type ExternalOrganizationAsIndex,
  type ExternalOrganizationWhereOptions,
  type ExternalOrganizationFiltersOptions,
  type ExternalOrganizationQueryOptions,
} from "@/api/external-organizations-api"

export {
  type ExternalOrganizationAsIndex,
  type ExternalOrganizationWhereOptions,
  type ExternalOrganizationFiltersOptions,
  type ExternalOrganizationQueryOptions,
}

export function useExternalOrganizations(
  queryOptions: Ref<ExternalOrganizationQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    externalOrganizations: ExternalOrganizationAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    externalOrganizations: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<ExternalOrganizationAsIndex[]> {
    state.isLoading = true
    try {
      const { externalOrganizations, totalCount } = await externalOrganizationsApi.list(
        unref(queryOptions)
      )
      state.isErrored = false
      state.externalOrganizations = externalOrganizations
      state.totalCount = totalCount
      return externalOrganizations
    } catch (error) {
      console.error(`Failed to fetch external organizations: ${error}`, { error })
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

export default useExternalOrganizations
