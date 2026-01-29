<template>
  <v-card class="border">
    <v-card-title>Agreement Duration & Expiration</v-card-title>
    <v-card-text>
      This agreement will come into effect upon the completion of mandatory fields and when both
      Parties indicate they accept the terms and conditions reflected wherein, and will remain in
      effect until the following:

      <v-row class="mt-4">
        <v-col
          cols="12"
          md="6"
        >
          <v-radio-group>
            <v-radio
              label="Completion of the purpose, project or decision described in this agreement, estimated completion by:"
              value="one"
            />
            <v-radio
              label="Expiration date of:"
              value="two"
            />
            <v-radio
              label="Undetermined and/or work is on-going with other factors that could change. By default, this agreement will expire:"
              value="three"
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
import { required } from "@/utils/validators"

import StringDateInput from "@/components/common/StringDateInput.vue"

defineProps<{
  endDate: string | null | undefined
}>()

const emit = defineEmits<{
  "update:endDate": [value: string | null | undefined]
}>()
</script>
