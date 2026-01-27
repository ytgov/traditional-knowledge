<template>
  <v-form
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-card class="border">
      <v-card-title>New Yukon First Nation</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="8"
          >
            <ExternalOrganizationNameUniqueTextField
              v-model="organizationAttributes.name"
              label="Name *"
              :rules="[required]"
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
              :to="{
                name: 'admin/ExternalOrganizationsPage',
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
              Create
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { ref } from "vue"
import { useRouter } from "vue-router"

import { VForm } from "vuetify/components"

import { required } from "@/utils/validators"
import externalOrganizationsApi, {
  type ExternalOrganization,
} from "@/api/external-organizations-api"
import useSnack from "@/use/use-snack"

import ExternalOrganizationNameUniqueTextField from "@/components/external-organizations/ExternalOrganizationNameUniqueTextField.vue"

const organizationAttributes = ref<Partial<ExternalOrganization>>({})

const isLoading = ref(false)
const form = ref<InstanceType<typeof VForm> | null>(null)
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
    await externalOrganizationsApi.create(organizationAttributes.value)
    snack.success("Yukon First Nation created.")
    router.push({
      name: "admin/ExternalOrganizationsPage",
    })
  } catch (error) {
    console.error(`Failed to create Yukon First Nation: ${error}`, { error })
    snack.error(`Failed to create Yukon First Nation: ${error}`)
  } finally {
    isLoading.value = false
  }
}
</script>
