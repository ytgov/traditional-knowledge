<template>
  <v-skeleton-loader
    v-if="isNil(informationSharingAgreement)"
    type="card"
  />
  <v-card v-else>
    <template #title> Information Sharing Agreement Details </template>
    <template #text>
      <v-row>
        <v-col cols="12">
          <p>{{ informationSharingAgreement.title }}</p>
        </v-col>
        <v-col cols="12">
          <p class="whitespace-pre-wrap">
            {{ informationSharingAgreement.description || "\<No description provided\>" }}
          </p>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <h4>Sharing Group</h4>
          <p><GroupChip :group-id="informationSharingAgreement.sharingGroupId" /></p>
          <p><UserChip :user-id="informationSharingAgreement.sharingGroupContactId" /></p>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <h4>Receiving Group</h4>
          <p><GroupChip :group-id="informationSharingAgreement.receivingGroupId" /></p>
          <p><UserChip :user-id="informationSharingAgreement.receivingGroupContactId" /></p>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <h4>Duration</h4>
          <p>Start: {{ formatDate(informationSharingAgreement.startDate) }}</p>
          <p>End: {{ formatDate(informationSharingAgreement.endDate) }}</p>
        </v-col>
      </v-row>
    </template>
    <template #actions>
      <v-btn
        :loading="isLoading"
        color="secondary"
        variant="outlined"
        v-bind="cancelButtonProps"
      >
        Return
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="editButtonProps"
        color="primary"
        v-bind="editButtonProps"
      >
        Edit
      </v-btn>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { toRefs } from "vue"
import { isNil } from "lodash"

import { type VBtn } from "vuetify/components"

import { formatDate } from "@/utils/formatters"
import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"

import GroupChip from "@/components/groups/GroupChip.vue"
import UserChip from "@/components/users/UserChip.vue"

type VBtnProps = VBtn["$props"]

const props = withDefaults(
  defineProps<{
    informationSharingAgreementId: number
    cancelButtonProps?: VBtnProps
    editButtonProps?: VBtnProps
  }>(),
  {
    cancelButtonProps: () => ({
      to: {
        name: "administration/InformationSharingAgreementsPage",
      },
    }),
    editButtonProps: ({ informationSharingAgreementId }) => ({
      to: {
        name: "administration/information-sharing-agreements/InformationSharingAgreementEditPage",
        params: {
          informationSharingAgreementId,
        },
      },
    }),
  }
)

const { informationSharingAgreementId } = toRefs(props)
const { informationSharingAgreement, isLoading } = useInformationSharingAgreement(
  informationSharingAgreementId
)
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
