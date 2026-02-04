<template>
  <v-card>
    <v-card-title class="bg-grey-lighten-4 d-flex align-center ga-3 px-6 py-4">
      <v-icon color="accent">mdi-lock-outline</v-icon>
      <span>Confidentiality</span>
    </v-card-title>
    <v-divider />
    <v-card-text class="pa-6 pa-md-8">
      <v-row class="mb-6">
        <v-col
          cols="12"
          md="6"
        >
          <div class="text-overline text-grey-darken-1 mb-2">Confidentiality Type</div>
          <div class="text-subtitle-1 font-weight-bold">
            <span v-if="isNil(confidentialityType)">Not configured</span>
            <span v-else-if="confidentialityType === InformationSharingAgreementConfidentialityType.ACCORDANCE">
              ACCORDANCE
            </span>
            <span v-else-if="confidentialityType === InformationSharingAgreementConfidentialityType.ACCEPTED_IN_CONFIDENCE">
              ACCEPTED IN CONFIDENCE
            </span>
            <span v-else>Unknown type</span>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <div class="text-overline text-grey-darken-1 mb-2">Description</div>
          <div class="text-subtitle-1 font-weight-medium text-grey-darken-3">
            {{ confidentialityDescription || "Not specified" }}
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <div>
        <div class="text-overline text-grey-darken-1 mb-4">
          Authorised application of Traditional Knowledge (TK)
        </div>
        <div class="mb-4">
          Yukon Government (YG) acknowledges the confidentiality and access identified above and
          will receive Traditional Knowledge (TK) as/in:
        </div>
        <div class="text-grey-darken-3 whitespace-pre-wrap">
          {{ authorizedApplication || "Not specified" }}
        </div>
        <p class="text-body-2 font-italic text-grey-darken-1 mt-6">
          Describes how Traditional Knowledge (TK) may be reflected in or considered for the
          described purpose. Includes if Yukon Government (YG) intends to share any materials
          pertaining to the outcome of this agreement.
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isNil } from "lodash"
import { useI18n } from "vue-i18n"

import { InformationSharingAgreementConfidentialityType } from "@/api/information-sharing-agreements-api"

const props = defineProps<{
  confidentialityType: InformationSharingAgreementConfidentialityType | null | undefined
  authorizedApplication: string | null | undefined
}>()

const { t } = useI18n()

const confidentialityDescription = computed(() => {
  if (isNil(props.confidentialityType)) {
    return ""
  }

  return t(`informationSharingAgreement.confidentialityDescriptions.${props.confidentialityType}`)
})
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap; /* preserves line breaks and wraps text if it's too long */
}
</style>
