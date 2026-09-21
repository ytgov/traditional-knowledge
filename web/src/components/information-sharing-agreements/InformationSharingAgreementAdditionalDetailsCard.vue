<template>
  <v-card>
    <v-card-title class="bg-grey-lighten-4 d-flex align-center ga-3 px-6 py-4">
      <v-icon color="accent">mdi-clipboard-text-outline</v-icon>
      <span>Additional Details</span>
    </v-card-title>
    <v-divider />
    <v-card-text class="pa-6 pa-md-8">
      <div class="text-overline text-grey-darken-1 mb-2">5. Compelled disclosure</div>
      <div
        v-if="!isEmpty(disclosureNotes)"
        class="text-grey-darken-3 whitespace-pre-wrap"
      >
        {{ disclosureNotes }}
      </div>
      <div
        v-else
        class="text-grey-darken-3"
      >
        Not specified
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isEmpty } from "lodash"

defineProps<{
  disclosureNotes: string | null | undefined
}>()
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap; /* preserves line breaks and wraps long text */
}
</style>
