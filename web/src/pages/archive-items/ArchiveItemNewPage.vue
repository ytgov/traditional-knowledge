<template>
  <ArchiveItemNewForm />
</template>

<script setup lang="ts">
import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"

import ArchiveItemNewForm from "@/components/archive-items/ArchiveItemNewForm.vue"

useBreadcrumbs("New Knowledge Item", [
  BASE_CRUMB,
  {
    title: "Knowledge Items",
    to: {
      name: "archive-items/ArchiveItemListPage",
    },
  },
])
</script>
