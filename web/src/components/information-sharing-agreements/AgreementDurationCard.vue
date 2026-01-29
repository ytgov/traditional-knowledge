<template>
  <v-card>
    <v-card-title>Agreement Duration & Expiration</v-card-title>
    <v-divider />
    <v-card-text>
      This agreement will come into effect upon the completion of mandatory fields and when both
      Parties indicate they accept the terms and conditions reflected wherein, and will remain in
      effect until the following (pick one):

      <v-row class="mt-4">
        <v-col
          cols="12"
          md="6"
        >
          <v-radio-group
            :model-value="expirationCondition"
            :rules="[required]"
            required
            @update:model-value="emitExpirationConditionAndOptionallyUpdateEndDate"
          >
            <v-radio
              label="Completion of the purpose, project or decision described in this agreement, estimated completion by: *"
              :value="InformationSharingAgreementExpirationConditions.COMPLETION_OF_PURPOSE"
            />
            <v-radio
              label="Expiration date of: *"
              :value="InformationSharingAgreementExpirationConditions.EXPIRATION_DATE"
            />
            <v-radio
              label="Undetermined and/or work is on-going with other factors that could change. By default, this agreement will expire: *"
              :value="
                InformationSharingAgreementExpirationConditions.UNDETERMINED_WITH_DEFAULT_EXPIRATION
              "
            />
          </v-radio-group>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <StringDateInput
            :model-value="endDate"
            label="End Date *"
            :rules="[required]"
            required
            clearable
            validate-on-blur
            @update:model-value="emit('update:endDate', $event)"
          />
        </v-col>
      </v-row>

      The options above do not prevent the possibility to amend, extend or terminate this agreement
      earlier due to mutually agreed upon conditions or other occurrences. These options ensure that
      by default, Traditional Knowledge (TK) is not retained indefinitely by Yukon Government (YG).
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { InformationSharingAgreementExpirationConditions } from "@/api/information-sharing-agreements-api"
import { computed } from "vue"
import { DateTime } from "luxon"

import { required } from "@/utils/validators"

import StringDateInput from "@/components/common/StringDateInput.vue"

defineProps<{
  endDate: string | null | undefined
  expirationCondition: InformationSharingAgreementExpirationConditions | null | undefined
}>()

const emit = defineEmits<{
  "update:endDate": [value: string | null | undefined]
  "update:expirationCondition": [
    value: InformationSharingAgreementExpirationConditions | null | undefined,
  ]
}>()

const defaultEndDate = computed(() => {
  return DateTime.now().plus({ years: 2 }).toFormat("yyyy-MM-dd")
})

function emitExpirationConditionAndOptionallyUpdateEndDate(
  value: InformationSharingAgreementExpirationConditions | null | undefined
) {
  emit("update:expirationCondition", value)

  if (
    value === InformationSharingAgreementExpirationConditions.UNDETERMINED_WITH_DEFAULT_EXPIRATION
  ) {
    emit("update:endDate", defaultEndDate.value)
  }
}
</script>
