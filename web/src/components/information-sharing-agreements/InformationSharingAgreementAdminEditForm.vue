<template>
  <v-skeleton-loader
    v-if="isNil(informationSharingAgreement)"
    type="card@4"
  />
  <v-form
    v-else
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-row class="mt-2">
      <v-col>
        <InformationSharingAgreementBasicInformationEditCard
          v-model:title="informationSharingAgreement.title"
          v-model:purpose="informationSharingAgreement.purpose"
          v-model:sharing-group-contact-id="informationSharingAgreement.sharingGroupContactId"
          v-model:sharing-group-contact-title="informationSharingAgreement.sharingGroupContactTitle"
          v-model:receiving-group-contact-id="informationSharingAgreement.receivingGroupContactId"
          v-model:receiving-group-contact-title="
            informationSharingAgreement.receivingGroupContactTitle
          "
          v-model:receiving-group-secondary-contact-id="
            informationSharingAgreement.receivingGroupSecondaryContactId
          "
          class="border"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <InformationSharingAgreementDurationEditCard
          v-model:end-date="informationSharingAgreement.endDate"
          v-model:expiration-condition="informationSharingAgreement.expirationCondition"
          class="border"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <InformationSharingAgreementAccessEditCard
          v-model:access-level="informationSharingAgreement.accessLevel"
          v-model:access-level-department-restriction="
            informationSharingAgreement.accessLevelDepartmentRestriction
          "
          v-model:access-level-branch-restriction="
            informationSharingAgreement.accessLevelBranchRestriction
          "
          v-model:access-level-unit-restriction="
            informationSharingAgreement.accessLevelUnitRestriction
          "
          v-model:has-additional-access-restrictions="
            informationSharingAgreement.hasAdditionalAccessRestrictions
          "
          v-model:additional-access-restrictions="
            informationSharingAgreement.additionalAccessRestrictions
          "
          class="border"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <InformationSharingAgreementConfidentialityEditCard
          v-model:confidentiality-type="informationSharingAgreement.confidentialityType"
          v-model:authorized-application="informationSharingAgreement.authorizedApplication"
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
          Save
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { toRefs, useTemplateRef } from "vue"
import { isNil } from "lodash"

import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"
import useSnack from "@/use/use-snack"

import InformationSharingAgreementAccessEditCard from "@/components/information-sharing-agreements/InformationSharingAgreementAccessEditCard.vue"
import InformationSharingAgreementBasicInformationEditCard from "@/components/information-sharing-agreements/InformationSharingAgreementBasicInformationEditCard.vue"
import InformationSharingAgreementConfidentialityEditCard from "@/components/information-sharing-agreements/InformationSharingAgreementConfidentialityEditCard.vue"
import InformationSharingAgreementDurationEditCard from "@/components/information-sharing-agreements/InformationSharingAgreementDurationEditCard.vue"

const props = defineProps<{
  informationSharingAgreementId: number
}>()

const emit = defineEmits<{
  saved: [informationSharingAgreementId: number]
}>()

const { informationSharingAgreementId } = toRefs(props)
const { informationSharingAgreement, save, isLoading } = useInformationSharingAgreement(
  informationSharingAgreementId
)

const snack = useSnack()
const form = useTemplateRef("form")

async function saveWrapper() {
  if (isNil(informationSharingAgreement.value)) return
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  try {
    await save()
    snack.success("Information Sharing Agreement updated.")
    emit("saved", props.informationSharingAgreementId)
  } catch (error) {
    console.error(`Failed to update information sharing agreement: ${error}`, { error })
    snack.error(`Failed to update information sharing agreement: ${error}`)
  }
}
</script>
