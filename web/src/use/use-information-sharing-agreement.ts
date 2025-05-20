import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import informationSharingAgreementsApi, {
  type InformationSharingAgreement,
  type InformationSharingAgreementWhereOptions,
  type InformationSharingAgreementFiltersOptions,
} from "@/api/information-sharing-agreements-api"

export {
  type InformationSharingAgreement,
  type InformationSharingAgreementWhereOptions,
  type InformationSharingAgreementFiltersOptions,
}

export function useInformationSharingAgreement(id: Ref<number | null | undefined>) {
  const state = reactive<{
    informationSharingAgreement: InformationSharingAgreement | null
    isLoading: boolean
    isErrored: boolean
  }>({
    informationSharingAgreement: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<InformationSharingAgreement> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { informationSharingAgreement } = await informationSharingAgreementsApi.get(staticId)
      state.isErrored = false
      state.informationSharingAgreement = informationSharingAgreement
      return informationSharingAgreement
    } catch (error) {
      console.error(`Failed to fetch information sharing agreement ${error}:`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<InformationSharingAgreement> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    if (isNil(state.informationSharingAgreement)) {
      throw new Error("No information sharing agreement to save")
    }

    state.isLoading = true
    try {
      const { informationSharingAgreement } = await informationSharingAgreementsApi.update(
        staticId,
        state.informationSharingAgreement
      )
      state.isErrored = false
      state.informationSharingAgreement = informationSharingAgreement
      return informationSharingAgreement
    } catch (error) {
      console.error(`Failed to save information sharing agreement ${error}:`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(id),
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

export default useInformationSharingAgreement
