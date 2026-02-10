<template>
  <AuthenticatedPostForm
    :action-url="downloadSignedAcknowledgementUrl"
    text="Signed Acknowledgement"
    :activator-props="{
      title: 'Download the signed acknowledgement document',
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

const downloadSignedAcknowledgementUrl = computed(() =>
  Api.Downloads.InformationSharingAgreements.signedAcknowledgementApi.downloadPath(
    props.informationSharingAgreementId
  )
)
</script>
