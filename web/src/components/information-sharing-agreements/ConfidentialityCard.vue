<template>
  <v-card>
    <v-card-title>Confidentiality</v-card-title>
    <v-divider />
    <v-card-text>
      <p class="mb-2">
        Yukon Government (YG) acknowledges the confidentiality and access identified above and will
        receive Traditional Knowledge (TK) as / in:
      </p>

      <v-row class="mt-4">
        <v-col
          cols="12"
          md="6"
        >
          <InformationSharingAgreementConfidentialitySelect
            :model-value="confidentialityType"
            label="Confidentiality *"
            :rules="[required]"
            required
            @update:model-value="emit('update:confidentialityType', $event)"
          />
        </v-col>
        <v-col
          v-if="!isNil(confidentialityType) && !isEmpty(description)"
          cols="12"
          md="6"
        >
          <p>
            {{ description }}
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-textarea
            :model-value="authorizedApplication"
            label="Authorised application of Traditional Knowledge (TK) *"
            hint="Describe how Traditional Knowledge (TK) may be reflected in or considered for the described purpose. Include if Yukon Government (YG) intends to share any materials pertaining to the outcome of this agreement."
            persistent-hint
            rows="8"
            auto-grow
            :rules="[required]"
            required
            @update:model-value="emit('update:authorizedApplication', $event)"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isEmpty, isNil } from "lodash"
import { useI18n } from "vue-i18n"

import { required } from "@/utils/validators"
import { InformationSharingAgreementConfidentialityType } from "@/api/information-sharing-agreements-api"
import InformationSharingAgreementConfidentialitySelect from "@/components/information-sharing-agreements/InformationSharingAgreementConfidentialitySelect.vue"

const props = defineProps<{
  confidentialityType: InformationSharingAgreementConfidentialityType | null | undefined
  authorizedApplication: string | null | undefined
}>()

const emit = defineEmits<{
  "update:confidentialityType": [
    value: InformationSharingAgreementConfidentialityType | null | undefined,
  ]
  "update:authorizedApplication": [value: string | null | undefined]
}>()

const { t } = useI18n()

const description = computed(() => {
  if (isNil(props.confidentialityType)) return ""

  return t(`informationSharingAgreement.confidentialityDescriptions.${props.confidentialityType}`)
})
</script>
