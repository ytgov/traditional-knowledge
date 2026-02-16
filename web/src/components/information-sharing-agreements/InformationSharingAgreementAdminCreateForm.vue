<template>
  <v-form
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-row class="mt-2">
      <v-col>
        <InformationSharingAgreementBasicInformationEditCard
          v-model:title="informationSharingAgreementAttributes.title"
          v-model:purpose="informationSharingAgreementAttributes.purpose"
          v-model:external-group-contact-id="
            informationSharingAgreementAttributes.externalGroupContactId
          "
          v-model:external-group-contact-title="
            informationSharingAgreementAttributes.externalGroupContactTitle
          "
          v-model:internal-group-contact-id="
            informationSharingAgreementAttributes.internalGroupContactId
          "
          v-model:internal-group-contact-title="
            informationSharingAgreementAttributes.internalGroupContactTitle
          "
          v-model:internal-group-secondary-contact-id="
            informationSharingAgreementAttributes.internalGroupSecondaryContactId
          "
          class="border"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <InformationSharingAgreementDurationEditCard
          v-model:end-date="informationSharingAgreementAttributes.endDate"
          v-model:expiration-condition="informationSharingAgreementAttributes.expirationCondition"
          class="border"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <InformationSharingAgreementAccessEditCard
          v-model:access-level="informationSharingAgreementAttributes.accessLevel"
          v-model:access-level-department-restriction="
            informationSharingAgreementAttributes.accessLevelDepartmentRestriction
          "
          v-model:access-level-branch-restriction="
            informationSharingAgreementAttributes.accessLevelBranchRestriction
          "
          v-model:access-level-unit-restriction="
            informationSharingAgreementAttributes.accessLevelUnitRestriction
          "
          v-model:has-additional-access-restrictions="
            informationSharingAgreementAttributes.hasAdditionalAccessRestrictions
          "
          v-model:additional-access-restrictions="
            informationSharingAgreementAttributes.additionalAccessRestrictions
          "
          class="border"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <InformationSharingAgreementConfidentialityEditCard
          v-model:confidentiality-type="informationSharingAgreementAttributes.confidentialityType"
          v-model:authorized-application="
            informationSharingAgreementAttributes.authorizedApplication
          "
          class="border"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn
          :loading="isLoading"
          color="secondary"
          variant="outlined"
          :to="{
            name: 'administration/InformationSharingAgreementsPage',
          }"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          class="ml-3"
          :loading="isLoading"
          type="submit"
          color="primary"
        >
          Create
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { ref, useTemplateRef } from "vue"
import { useRouter } from "vue-router"

import { VForm } from "vuetify/components"

import informationSharingAgreementsApi, {
  type InformationSharingAgreement,
} from "@/api/information-sharing-agreements-api"

import useSnack from "@/use/use-snack"

import InformationSharingAgreementAccessEditCard from "@/components/information-sharing-agreements/InformationSharingAgreementAccessEditCard.vue"
import InformationSharingAgreementBasicInformationEditCard from "@/components/information-sharing-agreements/InformationSharingAgreementBasicInformationEditCard.vue"
import InformationSharingAgreementConfidentialityEditCard from "@/components/information-sharing-agreements/InformationSharingAgreementConfidentialityEditCard.vue"
import InformationSharingAgreementDurationEditCard from "@/components/information-sharing-agreements/InformationSharingAgreementDurationEditCard.vue"

const informationSharingAgreementAttributes = ref<Partial<InformationSharingAgreement>>({
  title: undefined,
  description: undefined,
  endDate: undefined,
  externalGroupContactId: undefined,
  internalGroupContactId: undefined,
  internalGroupSecondaryContactId: undefined,
  accessLevel: undefined,
  accessLevelDepartmentRestriction: undefined,
  accessLevelBranchRestriction: undefined,
  accessLevelUnitRestriction: undefined,
  additionalAccessRestrictions: undefined,
  hasAdditionalAccessRestrictions: undefined,
  confidentialityType: undefined,
  authorizedApplication: undefined,
})

const form = useTemplateRef("form")
const isLoading = ref(false)
const snack = useSnack()
const router = useRouter()

async function saveWrapper() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  isLoading.value = true
  try {
    await informationSharingAgreementsApi.create(informationSharingAgreementAttributes.value)
    snack.success("Information Sharing Agreement created.")
    router.push({
      name: "administration/InformationSharingAgreementsPage",
    })
  } catch (error) {
    console.error(`Failed to create information sharing agreement: ${error}`, { error })
    snack.error(`Failed to create information sharing agreement: ${error}`)
  } finally {
    isLoading.value = false
  }
}
</script>
