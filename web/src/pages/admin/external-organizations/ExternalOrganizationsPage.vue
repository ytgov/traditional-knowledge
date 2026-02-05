<template>
  <v-card class="border">
    <v-card-text>
      <div class="d-flex flex-wrap ga-4 mb-4">
        <FilterSearchDebouncedTextField
          v-model="search"
          label="Search"
          density="compact"
        />
        <v-btn
          v-if="isSystemAdmin"
          color="primary"
          :to="{
            name: 'admin/ExternalOrganizationsNewPage',
          }"
          style="height: 40px"
        >
          New Yukon First Nation
        </v-btn>
      </div>

      <ExternalOrganizationsDataTable :filters="filters" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { isEmpty, isNil } from "lodash"

import { ADMIN_CRUMB, useBreadcrumbs } from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"

import FilterSearchDebouncedTextField from "@/components/common/tables/FilterSearchDebouncedTextField.vue"
import ExternalOrganizationsDataTable from "@/components/external-organizations/ExternalOrganizationsDataTable.vue"

const { isSystemAdmin } = useCurrentUser()

const search = ref("")

const filters = computed(() => {
  if (isNil(search.value) || isEmpty(search.value)) return {}

  return {
    search: search.value,
  }
})

useBreadcrumbs("Yukon First Nations", [ADMIN_CRUMB])
</script>
