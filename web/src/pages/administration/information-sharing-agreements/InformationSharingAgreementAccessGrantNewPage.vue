<template>
  <InformationSharingAgreementAccessGrantCreateForm
    :information-sharing-agreement-id="informationSharingAgreementIdAsNumber"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

import InformationSharingAgreementAccessGrantCreateForm from "@/components/information-sharing-agreement-access-grants/InformationSharingAgreementAccessGrantCreateForm.vue"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)

useBreadcrumbs("Grant Access", [
  ADMIN_CRUMB,
  {
    title: "Information Sharing Agreements",
    to: {
      name: "administration/InformationSharingAgreementsPage",
    },
  },
])
</script>
