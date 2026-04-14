<template>
  <BaseActionsMenuBtnGroup
    v-bind="primaryButtonAttributes"
    :loading="isLoading"
  >
    <v-list-item
      :loading="isDownloadingSignedAcknowledgement"
      @click="downloadSignedAcknowledgement"
    >
      <v-list-item-title>Signed Confidentiality Acknowledgement</v-list-item-title>
      <template #prepend>
        <v-icon
          size="small"
          color="primary"
          icon="mdi-download"
        />
      </template>
      <v-tooltip
        activator="parent"
        text="Download the signed confidentiality acknowledgement document."
      />
    </v-list-item>
    <v-list-item
      v-if="hasSignedConfidentialityReceipt"
      :loading="isDownloadingSignedConfidentialityReceipt"
      @click="downloadSignedConfidentialityReceipt"
    >
      <v-list-item-title>Signed Confidentiality Receipt</v-list-item-title>
      <template #prepend>
        <v-icon
          size="small"
          color="primary"
          icon="mdi-download"
        />
      </template>
      <v-tooltip
        activator="parent"
        text="Download the signed confidentiality receipt document."
      />
    </v-list-item>
    <v-list-item
      v-if="policy?.update"
      class="cursor-pointer"
    >
      <v-list-item-title>Revert to Draft</v-list-item-title>
      <template #prepend>
        <v-icon
          size="small"
          color="warning"
          icon="mdi-pencil-outline"
        />
      </template>
      <v-tooltip
        activator="parent"
        text="Revert this agreement back to draft state for further editing."
      />
      <InformationSharingAgreementRevertToDraftDialog
        :information-sharing-agreement-id="informationSharingAgreementId"
        activator="parent"
        @success="emit('updated', informationSharingAgreementId)"
      />
    </v-list-item>
  </BaseActionsMenuBtnGroup>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue"
import { isNil } from "lodash"

import Api from "@/api"
import useAuthenticatedDownload from "@/use/utils/use-authenticated-download"
import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"
import useInformationSharingAgreementArchiveItems from "@/use/use-information-sharing-agreement-archive-items"

import BaseActionsMenuBtnGroup from "@/components/common/BaseActionsMenuBtnGroup.vue"
import InformationSharingAgreementRevertToDraftDialog from "@/components/information-sharing-agreements/InformationSharingAgreementRevertToDraftDialog.vue"

const props = defineProps<{
  informationSharingAgreementId: number
}>()

const emit = defineEmits<{
  updated: [informationSharingAgreementId: number]
}>()

const { informationSharingAgreementId } = toRefs(props)
const { informationSharingAgreement, isLoading, policy } = useInformationSharingAgreement(
  informationSharingAgreementId
)

const hasSignedConfidentialityReceipt = computed(() => {
  if (isNil(informationSharingAgreement.value)) {
    return false
  }

  const { signedConfidentialityReceipt } = informationSharingAgreement.value
  return !isNil(signedConfidentialityReceipt)
})

const informationSharingAgreementArchiveItemsQuery = computed(() => ({
  where: {
    informationSharingAgreementId: props.informationSharingAgreementId,
  },
  perPage: 1,
}))
const { informationSharingAgreementArchiveItems } = useInformationSharingAgreementArchiveItems(
  informationSharingAgreementArchiveItemsQuery
)
const archiveItemId = computed(
  () => informationSharingAgreementArchiveItems.value?.at(0)?.archiveItemId
)
const primaryButtonAttributes = computed(() => {
  if (!isNil(archiveItemId.value)) {
    return {
      primaryButtonText: "View Knowledge Item",
      primaryButtonTo: {
        name: "archive-items/ArchiveItemInformationSharingAgreementsPage",
        params: {
          archiveItemId: archiveItemId.value,
        },
      },
    }
  } else {
    return {
      primaryButtonText: "Create Knowledge Item",
      primaryButtonTo: {
        name: "information-sharing-agreements/archive-items/InformationSharingAgreementArchiveItemNewPage",
        params: {
          informationSharingAgreementId: props.informationSharingAgreementId,
        },
      },
    }
  }
})

const generateSignedAcknowledgementUrl = computed(() =>
  Api.Downloads.InformationSharingAgreements.signedAcknowledgementApi.downloadPath(
    props.informationSharingAgreementId
  )
)
const { submit: downloadSignedAcknowledgement, isLoading: isDownloadingSignedAcknowledgement } =
  useAuthenticatedDownload(generateSignedAcknowledgementUrl)

const generateSignedConfidentialityReceiptUrl = computed(() =>
  Api.Downloads.InformationSharingAgreements.signedConfidentialityReceiptApi.downloadPath(
    props.informationSharingAgreementId
  )
)
const {
  submit: downloadSignedConfidentialityReceipt,
  isLoading: isDownloadingSignedConfidentialityReceipt,
} = useAuthenticatedDownload(generateSignedConfidentialityReceiptUrl)
</script>

<style scoped></style>
