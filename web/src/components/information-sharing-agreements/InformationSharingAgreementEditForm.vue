<template>
  <v-form
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-skeleton-loader
      v-if="isNil(informationSharingAgreement)"
      type="card"
    />
    <v-card v-else>
      <v-card-title>Information Sharing Agreement Details</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="12"
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
              v-model="informationSharingAgreement.description"
              label="Description"
              auto-grow
              clearable
              rows="6"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <UserSearchableAutocomplete
              v-model="informationSharingAgreement.sharingGroupContactId"
              label="Sharing Group Contact *"
              :disabled="isNil(informationSharingAgreement.sharingGroupId)"
              :filters="sharingGroupContactFilters"
              :rules="[required]"
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <UserSearchableAutocomplete
              v-model="informationSharingAgreement.receivingGroupContactId"
              label="Receiving Group Contact *"
              :rules="[required]"
              :disabled="isNil(informationSharingAgreement.receivingGroupId)"
              :filters="receivingGroupContactFilters"
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <!-- TODO: consider using a v-date-input range type? -->
            <v-date-input
              v-model="informationSharingAgreement.startDate"
              label="Start Date *"
              :rules="[required]"
              :max="informationSharingAgreement.endDate"
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-date-input
              v-model="informationSharingAgreement.endDate"
              label="End Date *"
              :rules="[required]"
              :min="informationSharingAgreement.startDate"
              required
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn
              :loading="isLoading"
              color="secondary"
              variant="outlined"
              v-bind="cancelButtonProps"
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
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, ref, toRefs } from "vue"

import { type VBtn, type VForm } from "vuetify/lib/components/index.mjs"

import { required } from "@/utils/validators"
import useInformationSharingAgreement from "@/use/use-information-sharing-agreement"
import useSnack from "@/use/use-snack"

import UserSearchableAutocomplete from "@/components/users/UserSearchableAutocomplete.vue"

type CancelButtonOptions = VBtn["$props"]

const props = withDefaults(
  defineProps<{
    informationSharingAgreementId: number
    cancelButtonProps?: CancelButtonOptions
  }>(),
  {
    cancelButtonProps: ({ informationSharingAgreementId }) => ({
      to: {
        name: "administration/information-sharing-agreements/InformationSharingAgreementPage",
        params: {
          informationSharingAgreementId,
        },
      },
    }),
  }
)

const emit = defineEmits<{
  saved: [informationSharingAgreementId: number]
}>()

const { informationSharingAgreementId } = toRefs(props)
const { informationSharingAgreement, save, isLoading } = useInformationSharingAgreement(
  informationSharingAgreementId
)

const snack = useSnack()
const form = ref<InstanceType<typeof VForm> | null>(null)

const sharingGroupContactFilters = computed(() => ({
  inGroup: informationSharingAgreement.value?.sharingGroupId,
}))

const receivingGroupContactFilters = computed(() => ({
  inGroup: informationSharingAgreement.value?.receivingGroupId,
}))

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
    snack.success("Information Sharing Agreement saved!")
    emit("saved", informationSharingAgreement.value.id)
  } catch (error) {
    console.error(`Failed to save information sharing agreement: ${error}`, { error })
    snack.error(`Failed to save information sharing agreement: ${error}`)
  }
}
</script>
