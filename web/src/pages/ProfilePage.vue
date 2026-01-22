<template>
  <v-skeleton-loader v-if="isNil(currentUser)" />
  <v-container v-else>
    <div class="d-flex flex-column flex-md-row justify-space-between mb-3">
      <v-spacer />
      <div class="d-flex justify-space-between mt-4 mb-3 my-md-0">
        <v-btn
          color="primary"
          variant="outlined"
          :to="{
            name: 'users/UsersPage',
          }"
        >
          Back
        </v-btn>
        <v-btn
          class="ml-md-3"
          title="Refresh"
          color="primary"
          append-icon="mdi-sync"
          :loading="isSyncing"
          @click="sync"
        >
          Sync
        </v-btn>
      </div>
    </div>

    <UserEditForm
      class="mt-10"
      :user-id="currentUser.id"
      :cancel-button-options="{
        to: {
          name: 'users/UsersPage',
        },
      }"
      @saved="refresh"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { isNil } from "lodash"

import usersApi from "@/api/users-api"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"
import useSnack from "@/use/use-snack"

import UserEditForm from "@/components/users/UserEditForm.vue"

const { currentUser, refresh } = useCurrentUser<true>()

const isSyncing = ref(false)
const snack = useSnack()

async function sync() {
  try {
    isSyncing.value = true
    await usersApi.directorySync(currentUser.value.id)
    await refresh()
  } catch (error) {
    console.error(`Failed to sync user: ${error}`, { error })
    snack.error(`Failed to sync user: ${error}`)
  } finally {
    isSyncing.value = false
  }
}

useBreadcrumbs("My Profile")
</script>

<style scoped></style>
