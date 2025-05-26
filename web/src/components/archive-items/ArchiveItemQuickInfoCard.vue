<template>
  <v-skeleton-loader
    v-if="isNil(archiveItem)"
    type="card"
  />
  <v-card
    v-else
    variant="tonal"
  >
    <template #title>
      <div class="text-subtitle-2 mb-n2 text-grey">RECORDED AT</div>
      {{ formatDateTime(archiveItem.createdAt) }}
    </template>

    <v-divider />

    <template #text>
      <div v-if="archiveItem.userId">
        <div class="text-subtitle-2 mb-n1 text-grey">RECORDED BY</div>
        {{ archiveItem.user.displayName }}

        <p
          v-if="archiveItem.user.title"
          class="mb-0"
        >
          {{ archiveItem.user.title }}
        </p>
      </div>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { toRefs } from "vue"

import { formatDateTime } from "@/utils/formatters"
import useArchiveItem from "@/use/use-archive-item"

const props = defineProps<{
  archiveItemId: number
}>()

const { archiveItemId } = toRefs(props)
const { archiveItem } = useArchiveItem(archiveItemId)
</script>
