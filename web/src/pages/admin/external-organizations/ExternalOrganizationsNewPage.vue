<template>
  <ExternalOrganizationCreateForm />
</template>

<script setup lang="ts">
import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

import ExternalOrganizationCreateForm from "@/components/external-organizations/ExternalOrganizationCreateForm.vue"

useBreadcrumbs("New Yukon First Nation", [
  ADMIN_CRUMB,
  {
    title: "Yukon First Nations",
    to: {
      name: "admin/ExternalOrganizationsPage",
    },
  },
])
</script>
