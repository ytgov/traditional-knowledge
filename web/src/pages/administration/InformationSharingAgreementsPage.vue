<template>
  <v-card>
    <v-card-text>
      <div class="d-flex flex-wrap ga-4 mb-4">
        <FilterSearchDebouncedTextField
          v-model="search"
          label="Search"
          density="compact"
        />
        <v-btn
          v-if="isSystemAdmin || isCreatorGroupAdmin"
          color="primary"
          :to="{
            name: 'administration/information-sharing-agreements/InformationSharingAgreementNewPage',
          }"
          style="height: 40px"
        >
          <span class="text-pre-wrap">New Agreement</span>
        </v-btn>
      </div>

      <InformationSharingAgreementsEditDataTableServer :filters="filters" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { isEmpty, isNil } from "lodash"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"

import FilterSearchDebouncedTextField from "@/components/common/tables/FilterSearchDebouncedTextField.vue"
import InformationSharingAgreementsEditDataTableServer from "@/components/information-sharing-agreements/InformationSharingAgreementsEditDataTableServer.vue"

const { isSystemAdmin, isCreatorGroupAdmin } = useCurrentUser()

const search = ref("")

const filters = computed(() => {
  if (isNil(search.value) || isEmpty(search.value)) return {}

  return {
    search: search.value,
  }
})

useBreadcrumbs("Information Sharing Agreements", [ADMIN_CRUMB])
</script>
