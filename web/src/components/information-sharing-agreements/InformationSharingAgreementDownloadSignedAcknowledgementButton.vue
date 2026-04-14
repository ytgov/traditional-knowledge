<template>
  <AuthenticatedPostForm
    :action-url="downloadSignedConfidentialityAcknowledgementUrl"
    text="Signed Confidentiality Acknowledgement"
    :activator-props="{
      title: 'Download the signed confidentiality acknowledgement document',
      ...activatorProps,
    }"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"

import Api from "@/api"

import AuthenticatedPostForm, {
  type ActivatorProps,
} from "@/components/common/AuthenticatedPostForm.vue"

const props = withDefaults(
  defineProps<{
    informationSharingAgreementId: number
    activatorProps?: ActivatorProps
  }>(),
  {
    activatorProps: () => ({}),
  }
)

const downloadSignedConfidentialityAcknowledgementUrl = computed(() =>
  Api.Downloads.InformationSharingAgreements.signedConfidentialityAcknowledgementApi.downloadPath(
    props.informationSharingAgreementId
  )
)
</script>
