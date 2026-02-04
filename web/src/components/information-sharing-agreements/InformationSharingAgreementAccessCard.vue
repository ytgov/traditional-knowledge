<template>
  <v-card>
    <v-card-title class="bg-grey-lighten-4 d-flex align-center ga-3 px-6 py-4">
      <v-icon color="accent">mdi-key-outline</v-icon>
      <span>Access</span>
    </v-card-title>
    <v-divider />
    <v-card-text class="pa-6 pa-md-8">
      <v-row>
        <v-col
          cols="12"
          lg="7"
        >
          <div class="mb-4">
            <div class="text-overline text-grey-darken-1 mb-2">Access Level</div>
            <div class="text-h6 font-weight-bold text-primary d-flex align-center ga-2">
              <v-icon color="primary">mdi-lock-open-outline</v-icon>
              <span>{{ accessLevelLabel }}</span>
            </div>
          </div>

          <p class="text-body-2 text-grey-darken-2">
            Authorised access to this Traditional Knowledge (TK) is limited. Any Yukon Government
            (YG) employees who are authorised to consider this TK must have a work need that
            complies with the criteria of this agreement, adhere to the terms and conditions, and
            uphold the equivalent protection standards YG would normally apply to information
            provided by another government that is considered confidential.
          </p>

          <template
            v-if="
              accessLevel === InformationSharingAgreementAccessLevels.PROTECTED_AND_LIMITED &&
              accessLevelDepartmentRestriction
            "
          >
            <div class="mt-4">
              <div class="text-body-2 text-grey-darken-1 mb-1">Department Restriction</div>
              <div class="font-weight-medium">{{ accessLevelDepartmentRestriction }}</div>
            </div>
          </template>

          <template
            v-else-if="
              accessLevel === InformationSharingAgreementAccessLevels.CONFIDENTIAL_AND_RESTRICTED
            "
          >
            <v-row class="mt-4">
              <v-col
                v-if="accessLevelDepartmentRestriction"
                cols="12"
                md="4"
              >
                <div class="text-body-2 text-grey-darken-1 mb-1">Department</div>
                <div class="font-weight-medium">{{ accessLevelDepartmentRestriction }}</div>
              </v-col>
              <v-col
                v-if="accessLevelBranchRestriction"
                cols="12"
                md="4"
              >
                <div class="text-body-2 text-grey-darken-1 mb-1">Branch</div>
                <div class="font-weight-medium">{{ accessLevelBranchRestriction }}</div>
              </v-col>
              <v-col
                v-if="accessLevelUnitRestriction"
                cols="12"
                md="4"
              >
                <div class="text-body-2 text-grey-darken-1 mb-1">Unit</div>
                <div class="font-weight-medium">{{ accessLevelUnitRestriction }}</div>
              </v-col>
            </v-row>

            <div
              v-if="hasAdditionalAccessRestrictions && additionalAccessRestrictions"
              class="mt-4"
            >
              <div class="text-body-2 text-grey-darken-1 mb-1">Additional Measures</div>
              <div class="font-weight-medium">{{ additionalAccessRestrictions }}</div>
            </div>
          </template>
        </v-col>

        <v-col
          cols="12"
          lg="5"
        >
          <v-card
            variant="outlined"
            class="bg-grey-lighten-4 rounded-lg"
          >
            <v-card-title class="text-body-2 font-weight-bold d-flex align-center ga-2 px-4 py-3">
              <v-icon size="small">mdi-file-document-outline</v-icon>
              <span>Access Guidelines</span>
            </v-card-title>
            <v-card-text class="text-body-2 text-grey-darken-3 font-italic">
              {{ accessGuidelines || "Complete the form to see guidelines." }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { isEmpty, isNil } from "lodash"

import { InformationSharingAgreementAccessLevels } from "@/api/information-sharing-agreements-api"

const props = defineProps<{
  accessLevel: InformationSharingAgreementAccessLevels | null | undefined
  accessLevelDepartmentRestriction: string | null | undefined
  accessLevelBranchRestriction: string | null | undefined
  accessLevelUnitRestriction: string | null | undefined
  hasAdditionalAccessRestrictions: boolean | null | undefined
  additionalAccessRestrictions: string | null | undefined
}>()

const { t } = useI18n()

const accessLevelLabel = computed(() => {
  if (isNil(props.accessLevel)) {
    return "Not configured"
  }

  return t(`informationSharingAgreement.accessLevels.${props.accessLevel}`)
})

const accessGuidelines = computed(() => {
  if (isNil(props.accessLevel)) {
    return ""
  }

  if (props.accessLevel === InformationSharingAgreementAccessLevels.INTERNAL) {
    return t(`informationSharingAgreement.accessLevelDescriptions.${props.accessLevel}`)
  }

  if (
    props.accessLevel === InformationSharingAgreementAccessLevels.PROTECTED_AND_LIMITED &&
    props.accessLevelDepartmentRestriction
  ) {
    return t(`informationSharingAgreement.accessLevelDescriptions.${props.accessLevel}`, {
      department: props.accessLevelDepartmentRestriction,
    })
  }

  if (
    props.accessLevel === InformationSharingAgreementAccessLevels.CONFIDENTIAL_AND_RESTRICTED &&
    props.accessLevelBranchRestriction
  ) {
    const departmentBranchUnitHeirarchy = [
      props.accessLevelDepartmentRestriction,
      props.accessLevelBranchRestriction,
      props.accessLevelUnitRestriction,
    ]
      .filter(Boolean)
      .join(" / ")

    if (!props.hasAdditionalAccessRestrictions) {
      return t(
        "informationSharingAgreement.accessLevelDescriptions.confidential_and_restricted",
        { departmentBranchUnitHeirarchy }
      )
    }

    if (props.hasAdditionalAccessRestrictions && !isEmpty(props.additionalAccessRestrictions)) {
      return t(
        "informationSharingAgreement.accessLevelDescriptions.confidential_and_restricted_with_additional_restrictions",
        {
          departmentBranchUnitHeirarchy,
          additionalAccessRestrictions: props.additionalAccessRestrictions,
        }
      )
    }
  }

  return ""
})
</script>
