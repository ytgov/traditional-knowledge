<template>
  <v-row class="align-center pa-3 ma-0">
    <v-col cols="auto">
      <v-avatar :color="iconColor">
        <v-icon color="white">{{ icon }}</v-icon>
      </v-avatar>
    </v-col>

    <v-col class="py-0">
      <div class="text-body-2 font-weight-medium">{{ attachment.name }}</div>
      <div class="text-caption text-medium-emphasis">{{ formattedDate }}</div>
      <div class="text-caption text-medium-emphasis">{{ formattedSize }}</div>
    </v-col>

    <v-col
      cols="12"
      md="auto"
    >
      <slot name="append" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from "vue"

import { type AttachmentAsReference } from "@/api/attachments-api"
import { formatBytes, formatDate } from "@/utils/formatters"

const props = defineProps<{
  attachment: AttachmentAsReference
}>()

const iconColor = computed(() => {
  if (props.attachment.mimeType === "application/pdf") {
    return "red"
  }

  if (
    props.attachment.mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    props.attachment.mimeType === "application/msword"
  ) {
    return "blue"
  }

  return "grey"
})

const icon = computed(() => {
  if (props.attachment.mimeType === "application/pdf") {
    return "mdi-file-pdf-box"
  }

  if (
    props.attachment.mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    props.attachment.mimeType === "application/msword"
  ) {
    return "mdi-file-word-box"
  }

  return "mdi-file"
})

const formattedDate = computed(() => formatDate(props.attachment.createdAt))
const formattedSize = computed(() => formatBytes(props.attachment.size))
</script>
