<template>
  <AuthenticatedPostForm
    :action-url="downloadUrl"
    text="Download Confidentiality Receipt"
    :activator-props="{
      title: 'Download the confidentiality receipt for printing and signature',
      ...activatorProps,
    }"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"

import informationSharingAgreementsApi from "@/api/information-sharing-agreements-api"

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

const downloadUrl = computed(() =>
  informationSharingAgreementsApi.generateConfidentialityReceiptPath(
    props.informationSharingAgreementId
  )
)
</script>
