<template>
  <div class="d-flex">
    <FilterSearchDebouncedTextField
      v-model="search"
      class="mb-4 mr-5"
      label="Search"
      density="compact"
    />
    <v-btn
      color="primary"
      :to="{
        name: 'administration/information-sharing-agreements/InformationSharingAgreementAccessGrantNewPage',
        params: {
          informationSharingAgreementId,
        },
      }"
      style="height: 40px"
    >
      Grant Access
    </v-btn>
  </div>

  <InformationSharingAgreementAccessGrantEditDataTableServer
    :where="where"
    :filters="filters"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { isEmpty, isNil } from "lodash"

import FilterSearchDebouncedTextField from "@/components/common/tables/FilterSearchDebouncedTextField.vue"
import InformationSharingAgreementAccessGrantEditDataTableServer from "@/components/information-sharing-agreement-access-grants/InformationSharingAgreementAccessGrantEditDataTableServer.vue"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)
const where = computed(() => ({
  informationSharingAgreementId: informationSharingAgreementIdAsNumber.value,
}))

const search = ref("")

const filters = computed(() => {
  if (isNil(search.value) || isEmpty(search.value)) return {}

  return {
    search: search.value,
  }
})

useBreadcrumbs("Information Sharing Agreement", [
  ADMIN_CRUMB,
  {
    title: "Information Sharing Agreements",
    to: {
      name: "administration/InformationSharingAgreementsPage",
    },
  },
])
</script>
