<template>
  <v-card>
    <v-card-text>
      <div class="d-flex flex-wrap ga-4 mb-4">
        <v-text-field
          v-model="search"
          label="Search"
          density="compact"
        />
        <v-btn
          color="primary"
          :to="{ name: 'users/UserNewPage' }"
          style="height: 40px"
        >
          New User
        </v-btn>
      </div>

      <UsersEditDataTableServer :filters="filters" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { isEmpty, isNil } from "lodash"

import { ADMIN_CRUMB, useBreadcrumbs } from "@/use/use-breadcrumbs"

import UsersEditDataTableServer from "@/components/users/UsersEditDataTableServer.vue"

const search = ref("")

const filters = computed(() => {
  if (isNil(search.value) || isEmpty(search.value)) return {}

  return {
    search: search.value,
  }
})

useBreadcrumbs("Users", [ADMIN_CRUMB])
</script>
