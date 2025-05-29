<template>
  <v-skeleton-loader
    v-if="isNil(archiveItem)"
    type="card"
  />
  <v-card v-else>
    <template #title>Attachments</template>
    <template
      v-if="archiveItem.files && archiveItem.files.length > 0"
      #text
    >
      <div
        v-for="file of archiveItem.files"
        :key="file.id"
      >
        <ArchiveItemFileCard
          :file="file"
          @accessed="emit('accessed', $event)"
        />
      </div>
    </template>
    <template
      v-else
      #text
    >
      No Attachments
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { toRefs } from "vue"

import useArchiveItem from "@/use/use-archive-item"

import ArchiveItemFileCard from "@/components/archive-item-files/ArchiveItemFileCard.vue"

const props = defineProps<{
  archiveItemId: number
}>()

const emit = defineEmits<{
  accessed: [archiveItemFileId: number]
}>()

const { archiveItemId } = toRefs(props)
const { archiveItem } = useArchiveItem(archiveItemId)
</script>
