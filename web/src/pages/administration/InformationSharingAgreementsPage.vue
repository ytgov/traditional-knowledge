<template>
  <v-card class="border">
    <v-card-text>
      <div class="d-flex flex-wrap ga-4 mb-4">
        <FilterSearchDebouncedTextField
          v-model="search"
          label="Search"
          density="compact"
        />
      </div>

      <InformationSharingAgreementsAdminEditDataTableServer :filters="filters" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { isEmpty, isNil } from "lodash"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

import FilterSearchDebouncedTextField from "@/components/common/tables/FilterSearchDebouncedTextField.vue"
import InformationSharingAgreementsAdminEditDataTableServer from "@/components/information-sharing-agreements/InformationSharingAgreementsAdminEditDataTableServer.vue"

const search = ref("")

const filters = computed(() => {
  if (isNil(search.value) || isEmpty(search.value)) return {}

  return {
    search: search.value,
  }
})

useBreadcrumbs("Information Sharing Agreements", [ADMIN_CRUMB])
</script>
