<template>
  <v-skeleton-loader
    v-if="isNil(informationSharingAgreement)"
    type="card@4"
  />
  <v-container v-else>
    TODO: InformationSharingAgreementPage.vue -> add content
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isNil } from "lodash"

import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"
import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)
const { informationSharingAgreement } = useInformationSharingAgreement(
  informationSharingAgreementIdAsNumber
)

const pageTitle = computed(() => {
  if (isNil(informationSharingAgreement.value)) {
    return "loading..."
  }

  const { title } = informationSharingAgreement.value
  return title
})

useBreadcrumbs(pageTitle.value, [
  BASE_CRUMB,
  {
    title: "Information Sharing Agreements",
    to: {
      name: "InformationSharingAgreementsPage",
    },
  },
])
</script>
