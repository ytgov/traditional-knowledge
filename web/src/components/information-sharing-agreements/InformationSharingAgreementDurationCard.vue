<template>
  <v-card>
    <v-card-title class="bg-grey-lighten-4 d-flex align-center ga-3 px-6 py-4">
      <v-icon color="accent">mdi-clock-outline</v-icon>
      <span>Agreement Duration & Expiration</span>
    </v-card-title>
    <v-divider />
    <v-card-text class="pa-6 pa-md-8">
      <div class="mb-4">
        This agreement will come into effect upon the completion of mandatory fields and when both
        Parties indicate they accept the terms and conditions reflected wherein, and will remain in
        effect until the following:
      </div>

      <v-alert
        type="warning"
        variant="tonal"
        class="rounded-lg"
      >
        <template #prepend>
          <v-icon>mdi-calendar-check</v-icon>
        </template>
        <div class="text-overline text-warning-darken-2 mb-1">Expiration Condition</div>
        <div class="text-subtitle-1 font-weight-bold">
          <span v-if="isNil(expirationCondition)">Not configured</span>
          <span v-else-if="expirationCondition === InformationSharingAgreementExpirationConditions.COMPLETION_OF_PURPOSE">
            Completion of the purpose, project or decision described in this agreement.
          </span>
          <span v-else-if="expirationCondition === InformationSharingAgreementExpirationConditions.EXPIRATION_DATE">
            Fixed expiration date.
          </span>
          <span v-else-if="expirationCondition === InformationSharingAgreementExpirationConditions.UNDETERMINED_WITH_DEFAULT_EXPIRATION">
            Undetermined and/or work is on-going. Default expiration applies.
          </span>
          <span v-else>Unknown condition</span>
        </div>
        <div
          v-if="endDate"
          class="mt-3 d-flex align-center ga-2"
        >
          <span class="text-body-2 text-grey-darken-2">
            <span v-if="isNil(expirationCondition)">End date:</span>
            <span v-else-if="expirationCondition === InformationSharingAgreementExpirationConditions.COMPLETION_OF_PURPOSE">
              Estimated completion by:
            </span>
            <span v-else-if="expirationCondition === InformationSharingAgreementExpirationConditions.EXPIRATION_DATE">
              Expires on:
            </span>
            <span v-else-if="expirationCondition === InformationSharingAgreementExpirationConditions.UNDETERMINED_WITH_DEFAULT_EXPIRATION">
              Default expiration:
            </span>
            <span v-else>End date:</span>
          </span>
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

      <v-alert
        variant="tonal"
        class="mt-4 rounded-lg"
      >
        <template #prepend>
          <v-icon>mdi-information</v-icon>
        </template>
        <div>
          The options above do not prevent the possibility to amend, extend or terminate this agreement
          earlier due to mutually agreed upon conditions or other occurrences. These options ensure that
          by default, Traditional Knowledge (TK) is not retained indefinitely by Yukon Government (YG).
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
