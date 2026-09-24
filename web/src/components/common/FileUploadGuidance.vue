<template>
  <v-alert
    type="info"
    variant="tonal"
    density="compact"
    class="mb-4"
  >
    <p class="mb-1 font-weight-medium">Accepted files</p>
    <p class="mb-1">
      All electronic file extensions are accepted, including documents, maps, audio files, and
      video files.
    </p>
    <p class="mb-1">
      Some file extensions may require separate software or an application to open.
    </p>
    <p class="mb-0">Maximum file size: {{ maximumFileSizeLabel }} per file.</p>
  </v-alert>
</template>

<script setup lang="ts">
import { MAXIMUM_UPLOAD_FILE_SIZE_LABEL } from "@/config"

const maximumFileSizeLabel = MAXIMUM_UPLOAD_FILE_SIZE_LABEL
</script>
