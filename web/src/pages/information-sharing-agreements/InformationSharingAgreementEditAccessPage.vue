<template>
  <v-skeleton-loader
    v-if="isNil(informationSharingAgreement)"
    type="card"
  />
  <v-form
    v-else
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-row class="mt-2">
      <v-col cols="12">
        <AccessLevelDescriptionCard
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
            name: 'administration/InformationSharingAgreementsPage',
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
import { useDisplay } from "vuetify"
import { isNil } from "lodash"

import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"
import useSnack from "@/use/use-snack"

import AccessLevelDescriptionCard from "@/components/information-sharing-agreements/AccessLevelDescriptionCard.vue"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)
const { informationSharingAgreement, isLoading, save } = useInformationSharingAgreement(
  informationSharingAgreementIdAsNumber
)

const form = useTemplateRef("form")
const snack = useSnack()

async function saveWrapper() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  try {
    await save()
    snack.success("Access Level updated.")
  } catch (error) {
    console.error(`Failed to update access level: ${error}`, { error })
    snack.error(`Failed to update access level: ${error}`)
  }
}

const { smAndDown } = useDisplay()
</script>
