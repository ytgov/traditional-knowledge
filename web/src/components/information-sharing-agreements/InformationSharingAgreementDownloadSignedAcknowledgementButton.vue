<template>
  <AuthenticatedPostForm
    :action-url="downloadSignedAcknowledgementUrl"
    text="Signed Acknowledgement"
    :activator-props="{
      color: 'primary',
      size: 'large',
      title: 'Download the signed acknowledgement document',
    }"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"

import Api from "@/api"

import AuthenticatedPostForm from "@/components/common/AuthenticatedPostForm.vue"

const props = defineProps<{
  informationSharingAgreementId: number
}>()

const downloadSignedAcknowledgementUrl = computed(() =>
  Api.Downloads.InformationSharingAgreements.signedAcknowledgementApi.downloadPath(
    props.informationSharingAgreementId
  )
)
</script>
