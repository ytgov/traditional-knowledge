<template>
  <v-card class="rounded-lg">
    <v-card-title class="bg-grey-lighten-4 d-flex align-center ga-3 px-6 py-4">
      <v-icon color="accent">mdi-clock-outline</v-icon>
      <span>Agreement Duration & Expiration</span>
    </v-card-title>
    <v-divider />
    <v-card-text class="pa-6 pa-md-8">
      <v-alert
        type="warning"
        variant="tonal"
        class="rounded-lg"
      >
        <template #prepend>
          <v-icon>mdi-calendar-check</v-icon>
        </template>
        <div class="text-overline text-warning-darken-2 mb-1">Expiration Condition</div>
        <div class="text-subtitle-1 font-weight-bold">{{ expirationConditionLabel }}</div>
        <div
          v-if="endDate"
          class="mt-3 d-flex align-center ga-2"
        >
          <span class="text-body-2 text-grey-darken-2">{{ endDateLabel }}</span>
          <v-chip
            size="small"
            variant="outlined"
            color="warning"
            class="font-weight-medium"
          >
            {{ formattedEndDate }}
          </v-chip>
        </div>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { DateTime } from "luxon"
import { isNil } from "lodash"

import { InformationSharingAgreementExpirationConditions } from "@/api/information-sharing-agreements-api"

const props = defineProps<{
  expirationCondition: InformationSharingAgreementExpirationConditions | null | undefined
  endDate: string | null | undefined
}>()

const expirationConditionLabel = computed(() => {
  if (isNil(props.expirationCondition)) {
    return "Not configured"
  }

  const labelMap: Record<InformationSharingAgreementExpirationConditions, string> = {
    [InformationSharingAgreementExpirationConditions.COMPLETION_OF_PURPOSE]:
      "Completion of the purpose, project or decision described in this agreement.",
    [InformationSharingAgreementExpirationConditions.EXPIRATION_DATE]: "Fixed expiration date.",
    [InformationSharingAgreementExpirationConditions.UNDETERMINED_WITH_DEFAULT_EXPIRATION]:
      "Undetermined and/or work is on-going. Default expiration applies.",
  }

  return labelMap[props.expirationCondition]
})

const endDateLabel = computed(() => {
  if (isNil(props.expirationCondition)) {
    return "End date:"
  }

  const labelMap: Record<InformationSharingAgreementExpirationConditions, string> = {
    [InformationSharingAgreementExpirationConditions.COMPLETION_OF_PURPOSE]:
      "Estimated completion by:",
    [InformationSharingAgreementExpirationConditions.EXPIRATION_DATE]: "Expires on:",
    [InformationSharingAgreementExpirationConditions.UNDETERMINED_WITH_DEFAULT_EXPIRATION]:
      "Default expiration:",
  }

  return labelMap[props.expirationCondition]
})

const formattedEndDate = computed(() => {
  if (isNil(props.endDate)) {
    return "Not specified"
  }

  const date = DateTime.fromISO(props.endDate)
  if (!date.isValid) {
    return props.endDate
  }

  return date.toFormat("MM/dd/yyyy")
})
</script>
