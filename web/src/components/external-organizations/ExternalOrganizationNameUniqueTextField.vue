<template>
  <UniqueTextField
    v-model="externalOrganizationName"
    label="Name"
    :check-availability="checkNameAvailability"
    unique-validation-message="Yukon First Nation name must be unique"
    is-unique-message="Yukon First Nation name is available"
    is-not-unique-message="Yukon First Nation name is already taken"
  />
</template>

<script setup lang="ts">
import externalOrganizationsApi, {
  type ExternalOrganizationFiltersOptions,
} from "@/api/external-organizations-api"

import UniqueTextField from "@/components/common/UniqueTextField.vue"

const externalOrganizationName = defineModel<string | null | undefined>({
  required: true,
})

const props = withDefaults(
  defineProps<{
    filters?: ExternalOrganizationFiltersOptions
  }>(),
  {
    filters: () => ({}),
  }
)

async function checkNameAvailability(name: string) {
  const { externalOrganizations } = await externalOrganizationsApi.list({
    where: {
      name,
    },
    filters: props.filters,
    perPage: 1, // We only need one result to check availability
  })
  return externalOrganizations.length === 0
}
</script>
