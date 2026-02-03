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
    <p>
      Authorised access to this Traditional Knowledge (TK) is limited. Any Yukon Government (YG)
      employees who are authorised to consider this TK must have a work need that complies with the
      criteria of this agreement, adhere to the terms and conditions, and uphold the equivalent
      protection standards YG would normally apply to information provided by another government
      that is considered:
    </p>

    <v-row class="mt-4">
      <v-col
        cols="12"
        md="7"
        class="pa-0"
      >
        <v-col cols="12">
          <InformationSharingAgreementAccessLevelSelect
            v-model="informationSharingAgreement.accessLevel"
            label="Access level *"
            :rules="[required]"
            required
            @update:model-value="resetRelevantFieldsOnChange"
          />
        </v-col>
        <v-col
          v-if="
            informationSharingAgreement.accessLevel ===
            InformationSharingAgreementAccessLevels.PROTECTED_AND_LIMITED
          "
          cols="12"
        >
          <v-text-field
            v-model="informationSharingAgreement.accessLevelDepartmentRestriction"
            label="Specify department *"
            :rules="[required]"
            required
          />
        </v-col>
        <template
          v-else-if="
            informationSharingAgreement.accessLevel ===
            InformationSharingAgreementAccessLevels.CONFIDENTIAL_AND_RESTRICTED
          "
        >
          <v-col cols="12">
            <v-text-field
              v-model="informationSharingAgreement.accessLevelDepartmentRestriction"
              label="Specify department *"
              :rules="[required]"
              required
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="informationSharingAgreement.accessLevelBranchRestriction"
              label="Specify branch *"
              :rules="[required]"
              required
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="informationSharingAgreement.accessLevelUnitRestriction"
              label="Specify unit"
            />
          </v-col>
          <v-col cols="12">
            <v-switch
              v-model="informationSharingAgreement.hasAdditionalAccessRestrictions"
              label="Has ADDITIONAL MEASURES?"
              hide-details
            />
          </v-col>
          <v-col
            v-if="informationSharingAgreement.hasAdditionalAccessRestrictions"
            cols="12"
          >
            <v-textarea
              v-model="informationSharingAgreement.additionalAccessRestrictions"
              label="ADDITIONAL MEASURES *"
              :rules="[required]"
              required
              auto-grow
              rows="8"
            />
          </v-col>
        </template>
      </v-col>
      <v-col
        cols="12"
        md="5"
      >
        <v-card
          class="rounded-lg bg-grey-lighten-3"
          variant="outlined"
        >
          <v-card-title class="d-flex align-center">
            <v-icon size="x-small"> mdi-file-document </v-icon>
            <h4 class="ml-2">Access Guidelines</h4>
          </v-card-title>
          <v-card-text class="font-italic">
            {{ description || "Complete the form to see guidelines." }}
          </v-card-text>
        </v-card>
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
            name: 'information-sharing-agreements/InformationSharingAgreementEditDurationPage',
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
import { useRouter } from "vue-router"
import { useDisplay } from "vuetify"
import { useI18n } from "vue-i18n"
import { isEmpty, isNil } from "lodash"

import { required } from "@/utils/validators"

import useInformationSharingAgreement, {
  InformationSharingAgreementAccessLevels,
} from "@/use/use-information-sharing-agreement"
import useSnack from "@/use/use-snack"

import InformationSharingAgreementAccessLevelSelect from "@/components/information-sharing-agreements/InformationSharingAgreementAccessLevelSelect.vue"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)
const { informationSharingAgreement, isLoading, save } = useInformationSharingAgreement(
  informationSharingAgreementIdAsNumber
)

function resetRelevantFieldsOnChange(accessLevel: string | null | undefined) {
  if (isNil(informationSharingAgreement.value)) return

  if (accessLevel === InformationSharingAgreementAccessLevels.INTERNAL) {
    informationSharingAgreement.value.accessLevelDepartmentRestriction = null
    informationSharingAgreement.value.accessLevelBranchRestriction = null
    informationSharingAgreement.value.accessLevelUnitRestriction = null
    informationSharingAgreement.value.hasAdditionalAccessRestrictions = false
    informationSharingAgreement.value.additionalAccessRestrictions = null
  } else if (accessLevel === InformationSharingAgreementAccessLevels.PROTECTED_AND_LIMITED) {
    informationSharingAgreement.value.accessLevelBranchRestriction = null
    informationSharingAgreement.value.accessLevelUnitRestriction = null
    informationSharingAgreement.value.hasAdditionalAccessRestrictions = false
    informationSharingAgreement.value.additionalAccessRestrictions = null
  } else if (accessLevel === InformationSharingAgreementAccessLevels.CONFIDENTIAL_AND_RESTRICTED) {
    // do nothing
  }
}

const { t } = useI18n()

const description = computed(() => {
  if (isNil(informationSharingAgreement.value)) return ""

  const { accessLevel } = informationSharingAgreement.value
  if (isNil(accessLevel)) return ""

  let description = ""
  if (accessLevel === InformationSharingAgreementAccessLevels.INTERNAL) {
    description = t(`informationSharingAgreement.accessLevelDescriptions.${accessLevel}`)
  }

  const {
    accessLevelDepartmentRestriction,
    accessLevelBranchRestriction,
    accessLevelUnitRestriction,
    hasAdditionalAccessRestrictions,
    additionalAccessRestrictions,
  } = informationSharingAgreement.value

  if (
    accessLevel === InformationSharingAgreementAccessLevels.PROTECTED_AND_LIMITED &&
    accessLevelDepartmentRestriction
  ) {
    description = t(`informationSharingAgreement.accessLevelDescriptions.${accessLevel}`, {
      department: accessLevelDepartmentRestriction,
    })
  } else if (
    accessLevel === InformationSharingAgreementAccessLevels.CONFIDENTIAL_AND_RESTRICTED &&
    accessLevelBranchRestriction
  ) {
    const departmentBranchUnitHeirarchy = [
      accessLevelDepartmentRestriction,
      accessLevelBranchRestriction,
      accessLevelUnitRestriction,
    ]
      .filter(Boolean)
      .join(" / ")
    if (!hasAdditionalAccessRestrictions) {
      description = t(
        "informationSharingAgreement.accessLevelDescriptions.confidential_and_restricted",
        {
          departmentBranchUnitHeirarchy,
        }
      )
    } else if (hasAdditionalAccessRestrictions && !isEmpty(additionalAccessRestrictions)) {
      description = t(
        "informationSharingAgreement.accessLevelDescriptions.confidential_and_restricted_with_additional_restrictions",
        {
          departmentBranchUnitHeirarchy,
          additionalAccessRestrictions,
        }
      )
    }
  }

  return description
})

const router = useRouter()
const form = useTemplateRef("form")
const snack = useSnack()

async function saveAndGoToNextPage() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  try {
    await save()
    snack.success("Access Level updated.")

    await router.push({
      name: "information-sharing-agreements/InformationSharingAgreementEditConfidentialityPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    })
  } catch (error) {
    console.error(`Failed to update access level: ${error}`, { error })
    snack.error(`Failed to update access level: ${error}`)
  }
}

const { smAndDown } = useDisplay()
</script>
