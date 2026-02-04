<template>
  <v-card class="rounded-lg">
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
          <div class="text-subtitle-1 font-weight-bold">{{ confidentialityTypeLabel }}</div>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <div class="text-overline text-grey-darken-1 mb-2">Last Reviewed</div>
          <div class="text-subtitle-1 font-weight-bold">Not configured</div>
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
        <div class="text-grey-darken-3">
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

import { InformationSharingAgreementConfidentialityType } from "@/api/information-sharing-agreements-api"

const props = defineProps<{
  confidentialityType: InformationSharingAgreementConfidentialityType | null | undefined
  authorizedApplication: string | null | undefined
}>()

const confidentialityTypeLabel = computed(() => {
  if (isNil(props.confidentialityType)) {
    return "Not configured"
  }

  const labelMap: Record<InformationSharingAgreementConfidentialityType, string> = {
    [InformationSharingAgreementConfidentialityType.ACCORDANCE]: "In Accordance",
    [InformationSharingAgreementConfidentialityType.ACCEPTED_IN_CONFIDENCE]:
      "Government-to-Government Confidential",
  }

  return labelMap[props.confidentialityType]
})
</script>
