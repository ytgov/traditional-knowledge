<template>
  <v-skeleton-loader v-if="isNil(user)" />
  <div v-else>
    <UserExternalEditForm
      :user-id="user.id"
      :cancel-button-options="{ to: { name: 'users/UsersPage' } }"
      @saved="refresh"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isNil } from "lodash"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import useUser from "@/use/use-user"

import UserExternalEditForm from "@/components/users/UserExternalEditForm.vue"

const props = defineProps<{
  userId: string
}>()

const userId = computed(() => parseInt(props.userId))
const { user, refresh } = useUser(userId)

useBreadcrumbs("Edit External User", [
  ADMIN_CRUMB,
  {
    title: "Users",
    to: { name: "users/UsersPage" },
  },
])
</script>
