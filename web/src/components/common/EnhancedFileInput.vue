<template>
  <v-file-input
    :loading="isFileDialogOpening"
    @click="isFileDialogOpening = true"
    @focus="isFileDialogOpening = false"
    @blur="isFileDialogOpening = false"
    @keydown="isFileDialogOpening = false"
  />
</template>

<script setup lang="ts">
import { ref } from "vue"

const isFileDialogOpening = ref(false)
</script>
