<template>
  <v-skeleton-loader
    v-if="isNil(informationSharingAgreement)"
    type="card"
  />
  <v-card
    v-else
    class="border"
    title="Information Sharing Agreement Details"
  >
    <template #text>
      <v-row>
        <v-col cols="6">
          <v-text-field
            :model-value="informationSharingAgreement.title"
            label="Title"
            readonly
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            :model-value="informationSharingAgreement.identifier"
            label="Identifier"
            readonly
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            :model-value="informationSharingAgreement.description || 'No description provided'"
            label="Description"
            readonly
            rows="2"
            auto-grow
          />
        </v-col>
        <v-col
          v-if="
            informationSharingAgreement.sharingGroupId ||
            informationSharingAgreement.receivingGroupId
          "
          cols="12"
          md="6"
        >
          <v-card
            v-if="informationSharingAgreement.sharingGroupId"
            class="border"
            color="#ffffff66"
          >
            <v-card-text>
              <h3 class="mt-n1 mb-3">Sharing Group</h3>

              <h4>Group:</h4>
              <GroupChip :group-id="informationSharingAgreement.sharingGroupId" />

              <h4 class="mt-3">Contact:</h4>
              <UserChip :user-id="informationSharingAgreement.sharingGroupContactId" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          v-if="
            informationSharingAgreement.sharingGroupId ||
            informationSharingAgreement.receivingGroupId
          "
          cols="12"
          md="6"
        >
          <v-card
            v-if="informationSharingAgreement.receivingGroupId"
            class="border"
            color="#ffffff66"
          >
            <v-card-text>
              <h3 class="mt-n1 mb-3">Receiving Group</h3>

              <h4>Group:</h4>
              <GroupChip :group-id="informationSharingAgreement.receivingGroupId" />

              <h4 class="mt-3">Contact:</h4>
              <UserChip :user-id="informationSharingAgreement.receivingGroupContactId" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-text-field
            :model-value="`${formatDate(informationSharingAgreement.startDate)} to ${formatDate(informationSharingAgreement.endDate)}`"
            label="Duration"
            readonly
          />
        </v-col>
        <v-col
          v-if="
            informationSharingAgreement.status === InformationSharingAgreementStatuses.SIGNED &&
            !isNil(signedAcknowledgement)
          "
          cols="12"
        >
          <v-card
            class="border"
            color="#ffffff66"
          >
            <v-card-text>
              <h3 class="mt-n1 mb-3">Signed Acknowledgement</h3>
              <div class="d-flex align-center ga-2">
                <span>{{ signedAcknowledgement.name }}</span>
                <InformationSharingAgreementDownloadSignedAcknowledgementButton
                  :information-sharing-agreement-id="informationSharingAgreementId"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div class="d-flex mt-5 ga-2">
        <v-btn
          v-if="policy?.update"
          color="primary"
          v-bind="editButtonProps"
        >
          Edit
        </v-btn>
        <InformationSharingAgreementDownloadDraftButton
          :information-sharing-agreement-id="informationSharingAgreementId"
        />
      </div>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue"
import { isNil } from "lodash"

import { type VBtn } from "vuetify/components"

import { formatDate } from "@/utils/formatters"
import useInformationSharingAgreement, {
  InformationSharingAgreementStatuses,
} from "@/use/use-information-sharing-agreement"

import InformationSharingAgreementDownloadDraftButton from "@/components/information-sharing-agreements/InformationSharingAgreementDownloadDraftButton.vue"
import InformationSharingAgreementDownloadSignedAcknowledgementButton from "@/components/information-sharing-agreements/InformationSharingAgreementDownloadSignedAcknowledgementButton.vue"

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
const { informationSharingAgreement, policy } = useInformationSharingAgreement(
  informationSharingAgreementId
)
const signedAcknowledgement = computed(
  () => informationSharingAgreement.value?.signedAcknowledgement
)
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
