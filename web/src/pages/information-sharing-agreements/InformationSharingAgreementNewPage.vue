<template>
  <InformationSharingAgreementCreateForm />
</template>

<script setup lang="ts">
import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"
import InformationSharingAgreementCreateForm from "@/components/information-sharing-agreements/InformationSharingAgreementCreateForm.vue"

useBreadcrumbs("New Information Sharing Agreement", [
  BASE_CRUMB,
  {
    title: "Information Sharing Agreements",
    to: {
      name: "InformationSharingAgreementsPage",
    },
  },
])
</script>
