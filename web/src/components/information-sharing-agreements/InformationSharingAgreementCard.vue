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
            informationSharingAgreement.externalGroupId ||
            informationSharingAgreement.internalGroupId
          "
          cols="12"
          md="6"
        >
          <v-card
            v-if="informationSharingAgreement.externalGroupId"
            class="border"
            color="#ffffff66"
          >
            <v-card-text>
              <h3 class="mt-n1 mb-3">External Group</h3>

              <h4>Group:</h4>
              <GroupChip :group-id="informationSharingAgreement.externalGroupId" />

              <h4 class="mt-3">Contact:</h4>
              <UserChip :user-id="informationSharingAgreement.externalGroupContactId" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          v-if="
            informationSharingAgreement.externalGroupId ||
            informationSharingAgreement.internalGroupId
          "
          cols="12"
          md="6"
        >
          <v-card
            v-if="informationSharingAgreement.internalGroupId"
            class="border"
            color="#ffffff66"
          >
            <v-card-text>
              <h3 class="mt-n1 mb-3">Internal Group</h3>

              <h4>Group:</h4>
              <GroupChip :group-id="informationSharingAgreement.internalGroupId" />

              <h4 class="mt-3">Contact:</h4>
              <UserChip :user-id="informationSharingAgreement.internalGroupContactId" />
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
              <span>{{ signedAcknowledgement.name }}</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div class="d-flex flex-column flex-md-row mt-5 justify-space-between ga-2">
        <div class="d-flex flex-column flex-md-row ga-2">
          <template
            v-if="informationSharingAgreement.status === InformationSharingAgreementStatuses.DRAFT"
          >
            <InformationSharingAgreementDownloadDraftButton
              :information-sharing-agreement-id="informationSharingAgreementId"
              :activator-props="{
                variant: 'outlined',
                color: 'secondary',
              }"
            />
            <v-btn
              color="secondary"
              v-bind="signButtonProps"
            >
              Mark as Signed
            </v-btn>
          </template>
          <template
            v-else-if="
              informationSharingAgreement.status === InformationSharingAgreementStatuses.SIGNED
            "
          >
            <v-btn
              color="warning"
              variant="outlined"
            >
              Revert to Draft
              <InformationSharingAgreementRevertToDraftDialog
                :information-sharing-agreement-id="informationSharingAgreementId"
                activator="parent"
                @success="refresh"
              />
            </v-btn>
            <InformationSharingAgreementDownloadSignedAcknowledgementButton
              :information-sharing-agreement-id="informationSharingAgreementId"
            />
          </template>
        </div>

        <div class="d-flex flex-column flex-md-row justify-end ga-2">
          <v-btn
            v-if="
              policy?.update &&
              informationSharingAgreement.status === InformationSharingAgreementStatuses.DRAFT
            "
            color="primary"
            v-bind="editButtonProps"
          >
            Edit
          </v-btn>
        </div>
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
import InformationSharingAgreementRevertToDraftDialog from "@/components/information-sharing-agreements/InformationSharingAgreementRevertToDraftDialog.vue"

import GroupChip from "@/components/groups/GroupChip.vue"
import UserChip from "@/components/users/UserChip.vue"

type VBtnProps = VBtn["$props"]

const props = withDefaults(
  defineProps<{
    informationSharingAgreementId: number
    cancelButtonProps?: VBtnProps
    editButtonProps?: VBtnProps
    signButtonProps?: VBtnProps
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
    signButtonProps: ({ informationSharingAgreementId }) => ({
      to: {
        name: "information-sharing-agreements/InformationSharingAgreementSignPage",
        params: {
          informationSharingAgreementId,
        },
      },
    }),
  }
)

const { informationSharingAgreementId } = toRefs(props)
const { informationSharingAgreement, policy, refresh } = useInformationSharingAgreement(
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
