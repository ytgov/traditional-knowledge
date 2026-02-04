<template>
  <v-skeleton-loader
    v-if="isNil(informationSharingAgreement)"
    type="card"
  />
  <v-form
    v-else
    ref="form"
    @submit.prevent="saveAndGoToNextPage"
  >
    <v-row>
      <v-col cols="12">
        <p>
          Yukon Government (YG) acknowledges the confidentiality and access identified above and
          will receive Traditional Knowledge (TK) as / in:
        </p>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col
        cols="12"
        md="6"
      >
        <InformationSharingAgreementConfidentialitySelect
          v-model="informationSharingAgreement.confidentialityType"
          label="Confidentiality *"
          :rules="[required]"
          required
        />
      </v-col>
      <v-col
        v-if="!isNil(informationSharingAgreement.confidentialityType) && !isEmpty(description)"
        cols="12"
        md="6"
      >
        <v-card
          class="rounded-lg bg-grey-lighten-3"
          variant="outlined"
        >
          <v-card-title class="d-flex align-center">
            <v-icon size="x-small"> mdi-file-document </v-icon>
            <h4 class="ml-2">Confidentiality Guidelines</h4>
          </v-card-title>
          <v-card-text class="font-italic">
            {{ description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-textarea
          v-model="informationSharingAgreement.authorizedApplication"
          label="Authorised application of Traditional Knowledge (TK) *"
          hint="Describe how Traditional Knowledge (TK) may be reflected in or considered for the described purpose. Include if Yukon Government (YG) intends to share any materials pertaining to the outcome of this agreement."
          persistent-hint
          rows="8"
          auto-grow
          :rules="[required]"
          required
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex flex-column flex-md-row">
        <v-btn
          color="primary"
          type="submit"
          :loading="isLoading"
          :block="smAndDown"
        >
          Save
        </v-btn>
        <v-btn
          :to="{
            name: 'information-sharing-agreements/InformationSharingAgreementEditAccessPage',
            params: {
              informationSharingAgreementId,
            },
          }"
          class="mt-3 mt-md-0 ml-md-3"
          color="secondary"
          variant="outlined"
          :loading="isLoading"
          :block="smAndDown"
        >
          Cancel
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useDisplay } from "vuetify"
import { isEmpty, isNil } from "lodash"

import { required } from "@/utils/validators"

import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"
import useSnack from "@/use/use-snack"

import InformationSharingAgreementConfidentialitySelect from "@/components/information-sharing-agreements/InformationSharingAgreementConfidentialitySelect.vue"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)
const { informationSharingAgreement, isLoading, save } = useInformationSharingAgreement(
  informationSharingAgreementIdAsNumber
)

const { t } = useI18n()

const description = computed(() => {
  if (isNil(informationSharingAgreement.value?.confidentialityType)) return ""

  return t(
    `informationSharingAgreement.confidentialityDescriptions.${informationSharingAgreement.value.confidentialityType}`
  )
})

const form = useTemplateRef("form")
const snack = useSnack()
const router = useRouter()

async function saveAndGoToNextPage() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  try {
    await save()
    snack.success("Confidentiality updated.")

    await router.push({
      name: 'information-sharing-agreements/InformationSharingAgreementPage',
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    })
  } catch (error) {
    console.error(`Failed to update confidentiality: ${error}`, { error })
    snack.error(`Failed to update confidentiality: ${error}`)
  }
}

const { smAndDown } = useDisplay()
</script>
