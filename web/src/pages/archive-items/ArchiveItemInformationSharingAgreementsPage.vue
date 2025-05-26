<template>
  <ArchiveItemAccessCard :archive-item-id="archiveItemIdAsNumber" />
</template>

<script setup lang="ts">
import { computed } from "vue"

import ArchiveItemAccessCard from "@/components/archive-item/ArchiveItemAccessCard.vue"

const props = defineProps<{
  archiveItemId: string
}>()

const archiveItemIdAsNumber = computed(() => parseInt(props.archiveItemId))
</script>
