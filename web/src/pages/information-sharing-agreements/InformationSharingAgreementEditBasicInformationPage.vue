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
    <v-row>
      <v-col
        cols="12"
        md="8"
      >
        <v-text-field
          v-model="informationSharingAgreement.title"
          label="Title *"
          :rules="[required]"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          v-model="informationSharingAgreement.purpose"
          label="What is the purpose, work, program, decision, or project this Traditional Knowledge (TK) will inform? *"
          :rules="[required]"
          required
          auto-grow
          rows="8"
        />
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col
        cols="12"
        md="6"
      >
        <UserSearchableAutocomplete
          v-model="informationSharingAgreement.sharingGroupContactId"
          label="Yukon First Nation or Transboundary Contact Name *"
          :where="sharingGroupContactWhere"
          :rules="[required]"
          required
          @click:clear="updateSharingGroupContactTitle(null)"
          @selected="updateSharingGroupContactTitle"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="informationSharingAgreement.sharingGroupContactTitle"
          label="Yukon First Nation or Transboundary Contact Title *"
          :rules="[required]"
          required
        />
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col
        cols="12"
        md="6"
      >
        <UserSearchableAutocomplete
          v-model="informationSharingAgreement.receivingGroupContactId"
          label="Yukon Government (YG) Contact Name *"
          :where="receivingGroupContactWhere"
          :rules="[required]"
          required
          @click:clear="updateReceivingGroupContactTitle(null)"
          @selected="updateReceivingGroupContactTitle"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="informationSharingAgreement.receivingGroupContactTitle"
          label="Yukon Government (YG) Contact Title *"
          :rules="[required]"
          required
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <UserSearchableAutocomplete
          v-model="informationSharingAgreement.receivingGroupSecondaryContactId"
          label="Yukon Government (YG) Manager Contact Name *"
          :where="receivingGroupSecondaryContactWhere"
          hint="Typically the manager of the primary YG contact, but can be any appropriate internal contact."
          :rules="[required]"
          required
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
import { computed, useTemplateRef } from "vue"
import { useRouter } from "vue-router"
import { useDisplay } from "vuetify"
import { isNil } from "lodash"

import { required } from "@/utils/validators"

import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"
import useSnack from "@/use/use-snack"

import UserSearchableAutocomplete, {
  type UserAsIndex,
} from "@/components/users/UserSearchableAutocomplete.vue"

const props = defineProps<{
  informationSharingAgreementId: string
}>()

const informationSharingAgreementIdAsNumber = computed(() =>
  parseInt(props.informationSharingAgreementId)
)
const { informationSharingAgreement, isLoading, save } = useInformationSharingAgreement(
  informationSharingAgreementIdAsNumber
)

const sharingGroupContactWhere = computed(() => ({
  isExternal: true,
}))
const receivingGroupContactWhere = computed(() => ({
  isExternal: false,
}))
const receivingGroupSecondaryContactWhere = computed(() => ({
  isExternal: false,
}))

function updateSharingGroupContactTitle(user: UserAsIndex | null) {
  if (isNil(informationSharingAgreement.value)) return

  if (isNil(user)) {
    informationSharingAgreement.value.sharingGroupContactTitle = null
  } else {
    informationSharingAgreement.value.sharingGroupContactTitle = user.title
  }
}

function updateReceivingGroupContactTitle(user: UserAsIndex | null) {
  if (isNil(informationSharingAgreement.value)) return

  if (isNil(user)) {
    informationSharingAgreement.value.receivingGroupContactTitle = null
  } else {
    informationSharingAgreement.value.receivingGroupContactTitle = user.title
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

  try {
    await save()
    snack.success("Basic Information updated.")

    await router.push({
      name: "information-sharing-agreements/InformationSharingAgreementEditDurationPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    })
  } catch (error) {
    console.error(`Failed to update basic information: ${error}`, { error })
    snack.error(`Failed to update basic information: ${error}`)
  }
}

const { smAndDown } = useDisplay()
</script>
