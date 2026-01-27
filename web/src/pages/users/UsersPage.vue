<template>
  <v-card class="border">
    <v-card-text>
      <div class="d-flex flex-wrap ga-4 mb-4">
        <FilterSearchDebouncedTextField
          v-model="search"
          label="Search"
          density="compact"
        />
        <div
          v-if="isSystemAdmin"
          class="d-flex ga-2"
        >
          <v-btn
            color="primary"
            :to="{
              name: 'users/UserInternalNewPage',
            }"
            height="40px"
          >
            New Internal User
          </v-btn>
          <v-btn
            color="secondary"
            :to="{
              name: 'users/UserExternalNewPage',
            }"
            height="40px"
          >
            New External User
          </v-btn>
        </div>
      </div>

      <UsersEditDataTableServer :filters="filters" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { isEmpty, isNil } from "lodash"

import { ADMIN_CRUMB, useBreadcrumbs } from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"

import FilterSearchDebouncedTextField from "@/components/common/tables/FilterSearchDebouncedTextField.vue"
import UsersEditDataTableServer from "@/components/users/UsersEditDataTableServer.vue"

const { isSystemAdmin } = useCurrentUser()

const search = ref("")

const filters = computed(() => {
  if (isNil(search.value) || isEmpty(search.value)) return {}

  return {
    search: search.value,
  }
})

useBreadcrumbs("Users", [ADMIN_CRUMB])
</script>
