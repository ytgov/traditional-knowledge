<template>
  <v-form
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-skeleton-loader
      v-if="isNil(externalOrganization)"
      type="card"
    />
    <v-card v-else class="border">
      <v-card-title>Edit Yukon First Nation</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="8"
          >
            <ExternalOrganizationNameUniqueTextField
              v-model="externalOrganization.name"
              label="Name *"
              :rules="[required]"
              :filters="externalOrganizationNameFilters"
              required
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
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

import { type VBtn, type VForm } from "vuetify/components"

import { required } from "@/utils/validators"
import useExternalOrganization from "@/use/use-external-organization"
import useSnack from "@/use/use-snack"

import ExternalOrganizationNameUniqueTextField from "@/components/external-organizations/ExternalOrganizationNameUniqueTextField.vue"

type CancelButtonOptions = VBtn["$props"]

const props = withDefaults(
  defineProps<{
    externalOrganizationId: number
    cancelButtonProps?: CancelButtonOptions
  }>(),
  {
    cancelButtonProps: () => ({
      to: {
        name: "admin/ExternalOrganizationsPage",
      },
    }),
  }
)

const emit = defineEmits<{
  saved: [externalOrganizationId: number]
}>()

const { externalOrganizationId } = toRefs(props)
const { externalOrganization, save, isLoading } = useExternalOrganization(externalOrganizationId)

const externalOrganizationNameFilters = computed(() => ({
  excludeById: externalOrganizationId.value,
}))

const snack = useSnack()

const form = ref<InstanceType<typeof VForm> | null>(null)

async function saveWrapper() {
  if (isNil(externalOrganization.value)) return
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) return

  try {
    await save()
    snack.success("Yukon First Nation saved!")
    emit("saved", externalOrganization.value.id)
  } catch (error) {
    console.error(`Failed to save Yukon First Nation: ${error}`, { error })
    snack.error(`Failed to save Yukon First Nation: ${error}`)
  }
}
</script>
