<template>
  <v-skeleton-loader
    v-if="isNil(archiveItem)"
    type="card@2"
  />
  <v-card v-else class="border">
    <template #title>Archive Item Description</template>
    <template #text>
      <v-row>
        <v-col
          cols="12"
          md="8"
        >
          <v-text-field
            v-model="archiveItem.title"
            label="Title"
            readonly
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <SecurityLevelSelect
            v-model="archiveItem.securityLevel"
            label="Security level"
            readonly
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="archiveItem.description"
            label="Description"
            readonly
            rows="3"
          />
        </v-col>
      </v-row>
    </template>

    <v-card-title>Tags</v-card-title>
    <v-card-text>
      <p class="mb-4">
        Tags are used as filter criteria to find items in the archive. You can select as many as are
        applicable to this item.
      </p>
      <v-combobox
        v-model="archiveItem.tags"
        label="Tags"
        multiple
        chips
        readonly
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isNil } from "lodash"

import useArchiveItem from "@/use/use-archive-item"

import SecurityLevelSelect from "@/components/archive-items/SecurityLevelSelect.vue"

const props = defineProps<{
  archiveItemId: number
}>()

const { archiveItem } = useArchiveItem(computed(() => props.archiveItemId))
</script>
