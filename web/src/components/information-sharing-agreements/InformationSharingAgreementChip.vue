<template>
  <v-chip
    v-bind="$attrs"
    :loading="isLoading"
    variant="text"
    :class="classes"
    :size="size"
    color="primary"
    style="height: 18px; border-radius: 4px; padding-left: 4px; padding-right: 8px"
  >
    <v-progress-circular
      v-if="isLoading"
      size="20"
      width="2"
      indeterminate
    />
    <template v-else-if="isNil(informationSharingAgreement)">
      <em>unset</em>
    </template>
    <template v-else>
      <strong
        class="text-primary"
        style="font-weight: 600; font-size: 14px"
        >{{ informationSharingAgreement.title }}</strong
      >
      <v-icon
        right
        size="large"
        >mdi-menu-down</v-icon
      >
      <v-menu
        activator="parent"
        :close-on-content-click="false"
      >
        <v-card
          class="mx-auto"
          max-width="450"
          :title="informationSharingAgreement.title"
        >
          <v-card-text>
            <v-row
              class="mt-0"
              dense
            >
              <v-col cols="12">
                <p class="whitespace-pre-wrap">
                  {{ informationSharingAgreement.description || "\<No description provided\>" }}
                </p>
              </v-col>
              <v-col cols="12">
                <h4>Duration</h4>
                <p>Start: {{ formatDate(informationSharingAgreement.startDate) }}</p>
                <p>End: {{ formatDate(informationSharingAgreement.endDate) }}</p>
              </v-col>
              <v-col cols="12">
                <h4>Sharing Group</h4>
                <p
                  v-if="
                    isNil(informationSharingAgreement.sharingGroupId) ||
                    isNil(informationSharingAgreement.sharingGroupContactId)
                  "
                >
                  <em>No sharing group specified</em>
                </p>
                <template v-else>
                  <p><GroupChip :group-id="informationSharingAgreement.sharingGroupId" /></p>
                  <p><UserChip :user-id="informationSharingAgreement.sharingGroupContactId" /></p>
                </template>
              </v-col>
              <v-col cols="12">
                <h4>Receiving Group</h4>
                <p
                  v-if="
                    isNil(informationSharingAgreement.receivingGroupId) ||
                    isNil(informationSharingAgreement.receivingGroupContactId)
                  "
                >
                  <em>No receiving group specified</em>
                </p>
                <template v-else>
                  <p><GroupChip :group-id="informationSharingAgreement.receivingGroupId" /></p>
                  <p><UserChip :user-id="informationSharingAgreement.receivingGroupContactId" /></p>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
  </v-chip>
</template>

<script lang="ts" setup>
import { toRefs } from "vue"
import { isNil } from "lodash"

import { VChip } from "vuetify/components"

import { formatDate } from "@/utils/formatters"
import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"

import GroupChip from "@/components/groups/GroupChip.vue"
import UserChip from "@/components/users/UserChip.vue"

const props = withDefaults(
  defineProps<{
    informationSharingAgreementId: number
    classes?: Record<string, boolean> | string[] | string
    size?: VChip["size"]
  }>(),
  {
    classes: "cursor-pointer",
    size: "large",
  }
)

const { informationSharingAgreementId } = toRefs(props)
const { informationSharingAgreement, isLoading } = useInformationSharingAgreement(
  informationSharingAgreementId
)
</script>

<style scoped>
.v-chip:hover {
  background-color: rgba(var(--v-theme-primary), 0.2) !important;
}
</style>
