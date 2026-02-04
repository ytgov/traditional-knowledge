<template>
  <InformationSharingAgreementAdminEditForm
    :information-sharing-agreement-id="informationSharingAgreementIdAsNumber"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

import InformationSharingAgreementAdminEditForm from "@/components/information-sharing-agreements/InformationSharingAgreementAdminEditForm.vue"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)

useBreadcrumbs("Edit Information Sharing Agreement", [
  ADMIN_CRUMB,
  {
    title: "Information Sharing Agreements",
    to: {
      name: "administration/InformationSharingAgreementsPage",
    },
  },
])
</script>
