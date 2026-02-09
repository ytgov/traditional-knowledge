import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import informationSharingAgreementsApi, {
  type InformationSharingAgreementAsShow,
  type InformationSharingAgreementPolicy,
  type InformationSharingAgreementWhereOptions,
  type InformationSharingAgreementFiltersOptions,
  InformationSharingAgreementAccessLevels,
  InformationSharingAgreementExpirationConditions,
  InformationSharingAgreementConfidentialityType,
  InformationSharingAgreementStatuses,
} from "@/api/information-sharing-agreements-api"

export {
  type InformationSharingAgreementAsShow,
  type InformationSharingAgreementPolicy,
  type InformationSharingAgreementWhereOptions,
  type InformationSharingAgreementFiltersOptions,
  InformationSharingAgreementAccessLevels,
  InformationSharingAgreementExpirationConditions,
  InformationSharingAgreementConfidentialityType,
  InformationSharingAgreementStatuses,
}

export function useInformationSharingAgreement(id: Ref<number | null | undefined>) {
  const state = reactive<{
    informationSharingAgreement: InformationSharingAgreementAsShow | null
    policy: InformationSharingAgreementPolicy | null
    isLoading: boolean
    isErrored: boolean
  }>({
    informationSharingAgreement: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<InformationSharingAgreementAsShow> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { informationSharingAgreement, policy } =
        await informationSharingAgreementsApi.get(staticId)
      state.isErrored = false
      state.informationSharingAgreement = informationSharingAgreement
      state.policy = policy
      return informationSharingAgreement
    } catch (error) {
      console.error(`Failed to fetch information sharing agreement ${error}:`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<InformationSharingAgreementAsShow> {
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
