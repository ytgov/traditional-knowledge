import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import informationSharingAgreementArchiveItemsApi, {
  type InformationSharingAgreementArchiveItem,
  type InformationSharingAgreementArchiveItemWhereOptions,
  type InformationSharingAgreementArchiveItemFiltersOptions,
  type InformationSharingAgreementArchiveItemQueryOptions,
} from "@/api/information-sharing-agreement-archive-items-api"

export {
  type InformationSharingAgreementArchiveItem,
  type InformationSharingAgreementArchiveItemWhereOptions,
  type InformationSharingAgreementArchiveItemFiltersOptions,
  type InformationSharingAgreementArchiveItemQueryOptions,
}

export function useInformationSharingAgreementArchiveItems(
  queryOptions: Ref<InformationSharingAgreementArchiveItemQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    informationSharingAgreementArchiveItems: InformationSharingAgreementArchiveItem[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    informationSharingAgreementArchiveItems: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<InformationSharingAgreementArchiveItem[]> {
    state.isLoading = true
    try {
      const { informationSharingAgreementArchiveItems, totalCount } =
        await informationSharingAgreementArchiveItemsApi.list(unref(queryOptions))
      state.isErrored = false
      state.informationSharingAgreementArchiveItems = informationSharingAgreementArchiveItems
      state.totalCount = totalCount
      return informationSharingAgreementArchiveItems
    } catch (error) {
      console.error("Failed to fetch information sharing agreement archive items:", error)
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

export default useInformationSharingAgreementArchiveItems
