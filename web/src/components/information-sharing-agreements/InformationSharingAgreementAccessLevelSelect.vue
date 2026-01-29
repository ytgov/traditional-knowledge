<template>
  <v-select
    :model-value="modelValue"
    :items="accessLevelItems"
    label="Access level"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"

import { InformationSharingAgreementAccessLevels } from "@/api/information-sharing-agreements-api"

defineProps<{
  modelValue: string | null | undefined
}>()

const emit = defineEmits<{
  "update:modelValue": [value: string | null | undefined]
}>()

const { t } = useI18n()

const accessLevelItems = computed(() =>
  Object.values(InformationSharingAgreementAccessLevels).map((accessLevel) => ({
    title: t(`informationSharingAgreement.accessLevels.${accessLevel}`),
    value: accessLevel,
  }))
)
</script>
