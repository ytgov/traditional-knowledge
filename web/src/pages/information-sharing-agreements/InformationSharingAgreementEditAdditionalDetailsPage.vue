<template>
  <v-skeleton-loader
    v-if="isNil(informationSharingAgreement)"
    type="card"
  />
  <v-form
    v-else
    ref="form"
    @submit.prevent="saveAndGoToAgreementPage"
  >
    <v-row>
      <v-col cols="12">
        <h3 class="text-subtitle-1 font-weight-bold">Compelled disclosure</h3>
        <p class="text-body-2 text-medium-emphasis mb-2">
          This section is optional. Under Yukon legislation, Yukon Government could be compelled to
          disclose information in its custody. Indicate if additional protocols are required, for
          example if there is a request to notify additional contacts.
        </p>
        <v-textarea
          v-model="informationSharingAgreement.disclosureNotes"
          label="Additional disclosure protocols"
          rows="3"
          auto-grow
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex flex-column flex-md-row ga-3">
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
            name: 'information-sharing-agreements/InformationSharingAgreementEditPage',
            params: {
              informationSharingAgreementId,
            },
          }"
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

import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"
import useSnack from "@/use/use-snack"

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
const router = useRouter()

async function saveAndGoToAgreementPage() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  try {
    await save()
    snack.success("Additional details updated.")

    await router.push({
      name: "information-sharing-agreements/InformationSharingAgreementPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    })
  } catch (error) {
    console.error(`Failed to update additional details: ${error}`, { error })
    snack.error(`Failed to update additional details: ${error}`)
  }
}

const { smAndDown } = useDisplay()
</script>
