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
    <p>
      This agreement will come into effect upon the completion of mandatory fields and when both
      Parties indicate they accept the terms and conditions reflected wherein, and will remain in
      effect until the following (pick one):
    </p>

    <v-row class="mt-4">
      <v-col
        cols="12"
        md="6"
      >
        <v-radio-group
          :model-value="informationSharingAgreement.expirationCondition"
          :rules="[required]"
          required
          @update:model-value="updateExpirationConditionAndOptionallyUpdateEndDate"
        >
          <v-radio
            label="Completion of the purpose, project or decision described in this agreement, estimated completion by: *"
            :value="InformationSharingAgreementExpirationConditions.COMPLETION_OF_PURPOSE"
          />
          <v-radio
            label="Expiration date of: *"
            :value="InformationSharingAgreementExpirationConditions.EXPIRATION_DATE"
          />
          <v-radio
            label="Undetermined and/or work is on-going with other factors that could change. By default, this agreement will expire: *"
            :value="
              InformationSharingAgreementExpirationConditions.UNDETERMINED_WITH_DEFAULT_EXPIRATION
            "
          />
        </v-radio-group>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <StringDateInput
          v-model="informationSharingAgreement.endDate"
          label="End Date *"
          :rules="[required]"
          required
          clearable
          validate-on-blur
        />
      </v-col>
    </v-row>

    The options above do not prevent the possibility to amend, extend or terminate this agreement
    earlier due to mutually agreed upon conditions or other occurrences. These options ensure that
    by default, Traditional Knowledge (TK) is not retained indefinitely by Yukon Government (YG).

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
            name: 'information-sharing-agreements/InformationSharingAgreementEditBasicInformationPage',
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
import { isNil } from "lodash"
import { DateTime } from "luxon"

import { required } from "@/utils/validators"
import { InformationSharingAgreementExpirationConditions } from "@/api/information-sharing-agreements-api"

import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"
import useSnack from "@/use/use-snack"

import StringDateInput from "@/components/common/StringDateInput.vue"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)
const { informationSharingAgreement, isLoading, save } = useInformationSharingAgreement(
  informationSharingAgreementIdAsNumber
)

const defaultEndDate = computed(() => {
  return DateTime.now().plus({ years: 2 }).toFormat("yyyy-MM-dd")
})

function updateExpirationConditionAndOptionallyUpdateEndDate(
  value: InformationSharingAgreementExpirationConditions | null
) {
  if (isNil(informationSharingAgreement.value)) return

  informationSharingAgreement.value.expirationCondition = value

  if (
    value === InformationSharingAgreementExpirationConditions.UNDETERMINED_WITH_DEFAULT_EXPIRATION
  ) {
    informationSharingAgreement.value.endDate = defaultEndDate.value
  }
}

const form = useTemplateRef("form")
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
    await save()
    snack.success("Agreement Duration updated.")
    await router.push({
      name: "information-sharing-agreements/InformationSharingAgreementEditAccessPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    })
  } catch (error) {
    console.error(`Failed to update agreement duration: ${error}`, { error })
    snack.error(`Failed to update agreement duration: ${error}`)
  } finally {
    isLoading.value = false
  }
}

const { smAndDown } = useDisplay()
</script>
