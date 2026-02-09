<template>
  <AuthenticatedPostForm
    :action-url="generateAcknowledgementUrl"
    text="Download Draft"
    :activator-props="{
      variant: 'outlined',
      color: 'secondary',
      size: 'large',
      title: 'Download a draft of the agreement for printing and signature',
    }"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"

import informationSharingAgreementsApi from "@/api/information-sharing-agreements-api"

import AuthenticatedPostForm from "@/components/common/AuthenticatedPostForm.vue"

const props = defineProps<{
  informationSharingAgreementId: number
}>()

const generateAcknowledgementUrl = computed(() =>
  informationSharingAgreementsApi.generateAcknowledgementPath(props.informationSharingAgreementId)
)
</script>
