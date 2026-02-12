<template>
  <AuthenticatedPostForm
    :action-url="generateAcknowledgementUrl"
    text="Download Draft"
    :activator-props="{
      title: 'Download a draft of the agreement for printing and signature',
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

const generateAcknowledgementUrl = computed(() =>
  informationSharingAgreementsApi.generateAcknowledgementPath(props.informationSharingAgreementId)
)
</script>
