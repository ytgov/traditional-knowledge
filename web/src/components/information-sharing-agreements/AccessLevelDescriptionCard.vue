<template>
  <v-card>
    <v-card-title>
      <h3 class="text-h6 mb-0">Access</h3>
    </v-card-title>
    <v-card-text>
      <p>
        Authorised access to this Traditional Knowledge (TK) is limited. Any Yukon Government (YG)
        employees who are authorised to consider this TK must have a work need that complies with
        the criteria of this agreement, adhere to the terms and conditions, and uphold the
        equivalent protection standards YG would normally apply to information provided by another
        government that is considered:
      </p>

      <v-row class="mt-4">
        <v-col
          cols="12"
          md="6"
        >
          <InformationSharingAgreementAccessLevelSelect
            :model-value="accessLevel"
            label="Access level *"
            @update:model-value="emit('update:accessLevel', $event)"
          />
        </v-col>
        <v-col
          v-if="!isNil(accessLevel) && !isEmpty(description)"
          cols="12"
          md="6"
        >
          <p>
            {{ description }}
          </p>
        </v-col>
      </v-row>

      <v-row v-if="accessLevel === InformationSharingAgreementAccessLevels.PROTECTED_AND_LIMITED">
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            :model-value="accessLevelDepartmentRestriction"
            label="Specify department *"
            :rules="[required]"
            required
            @update:model-value="emit('update:accessLevelDepartmentRestriction', $event)"
          />
        </v-col>
      </v-row>
      <v-row
        v-else-if="
          accessLevel === InformationSharingAgreementAccessLevels.CONFIDENTIAL_AND_RESTRICTED
        "
      >
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            :model-value="accessLevelDepartmentRestriction"
            label="Specify department *"
            :rules="[required]"
            required
            @update:model-value="emit('update:accessLevelDepartmentRestriction', $event)"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            :model-value="accessLevelBranchRestriction"
            label="Specify branch *"
            :rules="[required]"
            required
            @update:model-value="emit('update:accessLevelBranchRestriction', $event)"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            :model-value="accessLevelUnitRestriction"
            label="Specify unit"
            @update:model-value="emit('update:accessLevelUnitRestriction', $event)"
          />
        </v-col>
        <v-col cols="12">
          <v-switch
            :model-value="hasAdditionalAccessRestrictions"
            label="Has ADDITIONAL MEASURES?"
            hide-details
            @update:model-value="emit('update:hasAdditionalAccessRestrictions', $event)"
          />
        </v-col>
        <v-col
          v-if="hasAdditionalAccessRestrictions"
          cols="12"
        >
          <v-textarea
            :model-value="additionalAccessRestrictions"
            label="ADDITIONAL MEASURES *"
            :rules="[required]"
            required
            auto-grow
            rows="8"
            @update:model-value="emit('update:additionalAccessRestrictions', $event)"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { isEmpty, isNil } from "lodash"

import { required } from "@/utils/validators"
import { InformationSharingAgreementAccessLevels } from "@/api/information-sharing-agreements-api"

import InformationSharingAgreementAccessLevelSelect from "@/components/information-sharing-agreements/InformationSharingAgreementAccessLevelSelect.vue"

const props = defineProps<{
  accessLevel: string | null | undefined
  accessLevelDepartmentRestriction: string | null | undefined
  accessLevelBranchRestriction: string | null | undefined
  accessLevelUnitRestriction: string | null | undefined
  hasAdditionalAccessRestrictions: boolean | null | undefined
  additionalAccessRestrictions: string | null | undefined
}>()

const emit = defineEmits<{
  "update:accessLevel": [value: string | null | undefined]
  "update:accessLevelDepartmentRestriction": [value: string | null | undefined]
  "update:accessLevelBranchRestriction": [value: string | null | undefined]
  "update:accessLevelUnitRestriction": [value: string | null | undefined]
  "update:hasAdditionalAccessRestrictions": [value: boolean | null]
  "update:additionalAccessRestrictions": [value: string | null | undefined]
}>()

const { t } = useI18n()

const description = computed(() => {
  if (isNil(props.accessLevel)) return ""

  let description = ""
  if (props.accessLevel === InformationSharingAgreementAccessLevels.INTERNAL) {
    description = t(`informationSharingAgreement.accessLevelDescriptions.${props.accessLevel}`)
  }

  if (
    props.accessLevel === InformationSharingAgreementAccessLevels.PROTECTED_AND_LIMITED &&
    props.accessLevelDepartmentRestriction
  ) {
    description = t(`informationSharingAgreement.accessLevelDescriptions.${props.accessLevel}`, {
      department: props.accessLevelDepartmentRestriction,
    })
  } else if (
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
      description = t(
        "informationSharingAgreement.accessLevelDescriptions.confidential_and_restricted",
        {
          departmentBranchUnitHeirarchy,
        }
      )
    } else if (
      props.hasAdditionalAccessRestrictions &&
      !isEmpty(props.additionalAccessRestrictions)
    ) {
      description = t(
        "informationSharingAgreement.accessLevelDescriptions.confidential_and_restricted_with_additional_restrictions",
        {
          departmentBranchUnitHeirarchy,
          additionalAccessRestrictions: props.additionalAccessRestrictions,
        }
      )
    }
  }

  return description
})
</script>
