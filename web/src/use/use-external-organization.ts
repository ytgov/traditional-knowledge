import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import externalOrganizationsApi, {
  type ExternalOrganizationAsShow,
  type ExternalOrganizationPolicy,
} from "@/api/external-organizations-api"

export { type ExternalOrganizationAsShow, type ExternalOrganizationPolicy }

export function useExternalOrganization(externalOrganizationId: Ref<number | null | undefined>) {
  const state = reactive<{
    externalOrganization: ExternalOrganizationAsShow | null
    policy: ExternalOrganizationPolicy | null
    isLoading: boolean
    isErrored: boolean
  }>({
    externalOrganization: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<ExternalOrganizationAsShow> {
    const staticId = unref(externalOrganizationId)
    if (isNil(staticId)) {
      throw new Error("externalOrganizationId is required")
    }

    state.isLoading = true
    try {
      const { externalOrganization, policy } = await externalOrganizationsApi.get(staticId)
      state.isErrored = false
      state.externalOrganization = externalOrganization
      state.policy = policy
      return externalOrganization
    } catch (error) {
      console.error("Failed to fetch external organization:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<ExternalOrganizationAsShow> {
    const staticId = unref(externalOrganizationId)
    if (isNil(staticId)) {
      throw new Error("externalOrganizationId is required")
    }

    if (isNil(state.externalOrganization)) {
      throw new Error("No external organization to save")
    }

    state.isLoading = true
    try {
      const { externalOrganization, policy } = await externalOrganizationsApi.update(
        staticId,
        state.externalOrganization
      )
      state.isErrored = false
      state.externalOrganization = externalOrganization
      state.policy = policy
      return externalOrganization
    } catch (error) {
      console.error(`Failed to save external organization: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(externalOrganizationId),
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

export default useExternalOrganization
