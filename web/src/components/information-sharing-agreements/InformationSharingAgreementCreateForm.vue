<template>
  <v-form
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-row class="mt-2">
      <v-col>
        <InformationSharingAgreementBasicInformationCard
          v-model:title="informationSharingAgreementAttributes.title"
          v-model:purpose="informationSharingAgreementAttributes.purpose"
          v-model:sharing-group-contact-id="
            informationSharingAgreementAttributes.sharingGroupContactId
          "
          v-model:sharing-group-contact-title="
            informationSharingAgreementAttributes.sharingGroupContactTitle
          "
          v-model:receiving-group-contact-id="
            informationSharingAgreementAttributes.receivingGroupContactId
          "
          v-model:receiving-group-contact-title="
            informationSharingAgreementAttributes.receivingGroupContactTitle
          "
          v-model:receiving-group-secondary-contact-id="
            informationSharingAgreementAttributes.receivingGroupSecondaryContactId
          "
          class="border"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <AgreementDurationCard
          v-model:end-date="informationSharingAgreementAttributes.endDate"
          v-model:expiration-condition="informationSharingAgreementAttributes.expirationCondition"
          class="border"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <AccessLevelDescriptionCard
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
        <ConfidentialityCard
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

import AccessLevelDescriptionCard from "@/components/information-sharing-agreements/AccessLevelDescriptionCard.vue"
import AgreementDurationCard from "@/components/information-sharing-agreements/AgreementDurationCard.vue"
import ConfidentialityCard from "@/components/information-sharing-agreements/ConfidentialityCard.vue"
import InformationSharingAgreementBasicInformationCard from "@/components/information-sharing-agreements/InformationSharingAgreementBasicInformationCard.vue"

const informationSharingAgreementAttributes = ref<Partial<InformationSharingAgreement>>({
  title: undefined,
  description: undefined,
  endDate: undefined,
  sharingGroupContactId: undefined,
  receivingGroupContactId: undefined,
  receivingGroupSecondaryContactId: undefined,
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

  console.log("About to create - frontend debug:", {
    hasFileData: !!informationSharingAgreementAttributes.value.fileData,
    fileDataLength: informationSharingAgreementAttributes.value.fileData?.length,
    fileName: informationSharingAgreementAttributes.value.fileName,
    allKeys: Object.keys(informationSharingAgreementAttributes.value),
  })

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
