<template>
  <v-select
    :model-value="modelValue"
    :items="confidentialityTypes"
    label="Confidentiality"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"

import { InformationSharingAgreementConfidentialityType } from "@/api/information-sharing-agreements-api"

defineProps<{
  modelValue: InformationSharingAgreementConfidentialityType | null | undefined
}>()

const emit = defineEmits<{
  "update:modelValue": [value: InformationSharingAgreementConfidentialityType | null | undefined]
}>()

const { t } = useI18n()

const confidentialityTypes = computed(() =>
  Object.values(InformationSharingAgreementConfidentialityType).map((confidentialityType) => ({
    title: t(`informationSharingAgreement.confidentialityTypes.${confidentialityType}`),
    value: confidentialityType,
  }))
)
</script>
