<template>
  <v-skeleton-loader
    v-if="isNil(informationSharingAgreement)"
    type="card"
  />
  <v-form
    v-else
    ref="form"
    @submit.prevent="signAndRedirect"
  >
    <v-row>
      <v-col
        cols="12"
        md="8"
      >
        <p class="mb-4">
          Upload the signed acknowledgement document to mark this agreement as signed.
        </p>

        <v-file-input
          v-model="signedAcknowledgement"
          label="Signed Acknowledgement"
          :rules="[required]"
          accept=".pdf,.doc,.docx"
          show-size
          required
          validate-on="blur"
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
          Mark as Signed
        </v-btn>
        <v-btn
          :to="{
            name: 'information-sharing-agreements/InformationSharingAgreementPage',
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
import { computed, ref, useTemplateRef } from "vue"
import { useRouter } from "vue-router"
import { useDisplay } from "vuetify"
import { isNil } from "lodash"

import { required } from "@/utils/validators"

import informationSharingAgreementsApi from "@/api/information-sharing-agreements-api"

import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"
import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"
import useSnack from "@/use/use-snack"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)
const { informationSharingAgreement, isLoading } = useInformationSharingAgreement(
  informationSharingAgreementIdAsNumber
)

const signedAcknowledgement = ref<File | null>(null)
const form = useTemplateRef("form")
const snack = useSnack()
const router = useRouter()

async function signAndRedirect() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) return

  console.log(`signedAcknowledgement.value:`, signedAcknowledgement.value)
  if (isNil(signedAcknowledgement.value)) {
    throw new Error("Signed acknowledgement is required")
  }

  isLoading.value = true
  try {
    await informationSharingAgreementsApi.sign(
      informationSharingAgreementIdAsNumber.value,
      signedAcknowledgement.value
    )
    snack.success("Agreement marked as signed!")

    await router.push({
      name: "information-sharing-agreements/InformationSharingAgreementPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    })
  } catch (error) {
    console.error(`Failed to sign agreement: ${error}`, { error })
    snack.error(`Failed to sign agreement: ${error}`)
  } finally {
    isLoading.value = false
  }
}

const pageTitle = computed(() => {
  if (isNil(informationSharingAgreement.value)) {
    return "loading..."
  }

  return `Mark as Signed: ${informationSharingAgreement.value.title}`
})

useBreadcrumbs(pageTitle, [
  BASE_CRUMB,
  {
    title: "Information Sharing Agreements",
    to: {
      name: "InformationSharingAgreementsPage",
    },
  },
])

const { smAndDown } = useDisplay()
</script>
