<template>
  <v-card>
    <v-card-title class="bg-grey-lighten-4 d-flex align-center ga-3 px-6 py-4">
      <v-icon color="accent">mdi-information-outline</v-icon>
      <span>Basic Information</span>
    </v-card-title>
    <v-divider />
    <v-card-text class="pa-6 pa-md-8">
      <div class="mb-6">
        <div class="text-overline text-grey-darken-1 mb-2">Agreement Title</div>
        <div class="text-h5 font-weight-bold">{{ title }}</div>
      </div>

      <div class="mb-6">
        <div class="text-overline text-grey-darken-1 mb-2">
          Purpose of Traditional Knowledge (TK) Information
        </div>
        <div class="text-body-1 text-grey-darken-3 whitespace-pre-wrap">
          {{ purpose || "Not specified" }}
        </div>
      </div>

      <v-divider class="my-6" />

      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-center ga-2 mb-4">
            <v-icon
              size="small"
              color="primary"
            >
              mdi-account-group
            </v-icon>
            <span class="font-weight-bold text-primary">
              Yukon First Nation or Transboundary Contact
            </span>
          </div>
          <div class="mb-3">
            <div class="text-body-2 text-grey-darken-1 mb-1">Contact Name</div>
            <span
              v-if="isNil(sharingGroupContactId)"
              class="font-weight-medium"
              >Not specified</span
            >
            <UserChip
              v-else
              :user-id="sharingGroupContactId"
            />
          </div>
          <div>
            <div class="text-body-2 text-grey-darken-1 mb-1">Title</div>
            <div class="font-weight-medium">{{ sharingGroupContactTitle || "Not specified" }}</div>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-center ga-2 mb-4">
            <v-icon
              size="small"
              color="primary"
            >
              mdi-bank
            </v-icon>
            <span class="font-weight-bold text-primary">Yukon Government (YG) Contact</span>
          </div>
          <div class="mb-3">
            <div class="text-body-2 text-grey-darken-1 mb-1">Contact Name</div>
            <span
              v-if="isNil(receivingGroupContactId)"
              class="font-weight-medium"
              >Not specified</span
            >
            <UserChip
              v-else
              :user-id="receivingGroupContactId"
            />
          </div>
          <div class="mb-3">
            <div class="text-body-2 text-grey-darken-1 mb-1">Title</div>
            <div class="font-weight-medium">
              {{ receivingGroupContactTitle || "Not specified" }}
            </div>
          </div>
          <div>
            <div class="text-body-2 text-grey-darken-1 mb-1">Manager Contact Name</div>
            <span
              v-if="isNil(receivingGroupSecondaryContactId)"
              class="font-weight-medium"
              >Not specified</span
            >
            <UserChip
              v-else
              :user-id="receivingGroupSecondaryContactId"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"

import UserChip from "@/components/users/UserChip.vue"

defineProps<{
  title: string | null | undefined
  purpose: string | null | undefined
  sharingGroupContactId: number | null | undefined
  sharingGroupContactTitle: string | null | undefined
  receivingGroupContactId: number | null | undefined
  receivingGroupContactTitle: string | null | undefined
  receivingGroupSecondaryContactId: number | null | undefined
}>()
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap; /* preserves line breaks and wraps text if it's too long */
}
</style>
