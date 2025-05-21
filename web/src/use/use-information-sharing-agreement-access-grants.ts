import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import informationSharingAgreementAccessGrantsApi, {
  type InformationSharingAgreementAccessGrantIndexView,
  type InformationSharingAgreementAccessGrantWhereOptions,
  type InformationSharingAgreementAccessGrantFiltersOptions,
  type InformationSharingAgreementAccessGrantQueryOptions,
  InformationSharingAgreementAccessGrantAccessLevel,
} from "@/api/information-sharing-agreement-access-grants-api"

export {
  type InformationSharingAgreementAccessGrantIndexView,
  type InformationSharingAgreementAccessGrantWhereOptions,
  type InformationSharingAgreementAccessGrantFiltersOptions,
  type InformationSharingAgreementAccessGrantQueryOptions,
  InformationSharingAgreementAccessGrantAccessLevel,
}

export function useInformationSharingAgreementAccessGrants(
  queryOptions: Ref<InformationSharingAgreementAccessGrantQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    informationSharingAgreementAccessGrants: InformationSharingAgreementAccessGrantIndexView[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    informationSharingAgreementAccessGrants: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<InformationSharingAgreementAccessGrantIndexView[]> {
    state.isLoading = true
    try {
      const { informationSharingAgreementAccessGrants, totalCount } =
        await informationSharingAgreementAccessGrantsApi.list(unref(queryOptions))
      state.isErrored = false
      state.informationSharingAgreementAccessGrants = informationSharingAgreementAccessGrants
      state.totalCount = totalCount
      return informationSharingAgreementAccessGrants
    } catch (error) {
      console.error("Failed to fetch information sharing agreement access grants:", error)
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

export default useInformationSharingAgreementAccessGrants
