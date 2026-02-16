<template>
  <v-form
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-card>
      <template #title>Access Details</template>
      <template #text>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <UserSearchableAutocomplete
              v-model="informationSharingAgreementAccessGrantAttributes.userId"
              label="User *"
              :filters="userFilters"
              :rules="[required]"
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <InformationSharingAgreementAccessGrantAccessLevelSelect
              v-model="informationSharingAgreementAccessGrantAttributes.accessLevel"
              label="Access Level *"
              :rules="[required]"
              required
            />
          </v-col>
        </v-row>
      </template>
      <template #actions>
        <v-btn
          :loading="isLoading"
          color="secondary"
          variant="outlined"
          :to="{
            name: 'administration/information-sharing-agreements/InformationSharingAgreementAccessGrantsPage',
            params: {
              informationSharingAgreementId,
            },
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
          Grant Access
        </v-btn>
      </template>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, ref, useTemplateRef } from "vue"
import { useRouter } from "vue-router"

import { required } from "@/utils/validators"

import informationSharingAgreementAccessGrantsApi, {
  type InformationSharingAgreementAccessGrant,
  InformationSharingAgreementAccessGrantAccessLevels,
} from "@/api/information-sharing-agreement-access-grants-api"
import useSnack from "@/use/use-snack"

import UserSearchableAutocomplete from "@/components/users/UserSearchableAutocomplete.vue"
import InformationSharingAgreementAccessGrantAccessLevelSelect from "@/components/information-sharing-agreement-access-grants/InformationSharingAgreementAccessGrantAccessLevelSelect.vue"

const props = defineProps<{
  informationSharingAgreementId: number
  groupId: number
}>()

const informationSharingAgreementAccessGrantAttributes = ref<
  Partial<InformationSharingAgreementAccessGrant>
>({
  informationSharingAgreementId: props.informationSharingAgreementId,
  groupId: props.groupId,
  userId: undefined,
  accessLevel: InformationSharingAgreementAccessGrantAccessLevels.READ,
})

const userFilters = computed(() => ({
  withSameTypeAsGroup: props.groupId,
  withoutAccessGrantFor: props.informationSharingAgreementId,
}))

const isLoading = ref(false)
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
    await informationSharingAgreementAccessGrantsApi.create(
      informationSharingAgreementAccessGrantAttributes.value
    )
    snack.success("Access granted successfully.")
    router.push({
      name: "administration/information-sharing-agreements/InformationSharingAgreementAccessGrantsPage",
      params: {
        informationSharingAgreementId: props.informationSharingAgreementId,
      },
    })
  } catch (error) {
    console.error(`Failed to grant access: ${error}`, { error })
    snack.error(`Failed to grant access: ${error}`)
  } finally {
    isLoading.value = false
  }
}
</script>
