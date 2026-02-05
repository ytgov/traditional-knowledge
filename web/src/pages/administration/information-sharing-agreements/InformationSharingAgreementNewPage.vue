<template>
  <InformationSharingAgreementAdminCreateForm />
</template>

<script setup lang="ts">
import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import InformationSharingAgreementAdminCreateForm from "@/components/information-sharing-agreements/InformationSharingAgreementAdminCreateForm.vue"

useBreadcrumbs("New Information Sharing Agreement", [
  ADMIN_CRUMB,
  {
    title: "Information Sharing Agreements",
    to: {
      name: "administration/InformationSharingAgreementsPage",
    },
  },
])
</script>
