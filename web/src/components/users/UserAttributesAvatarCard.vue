<template>
  <v-card
    v-if="user.isExternal"
    :title="user.displayName || `${user.firstName} ${user.lastName}`"
  >
    <template #prepend>
      <v-avatar
        size="32"
        color="primary"
        variant="tonal"
      >
        <v-icon size="16"> mdi-earth </v-icon>
      </v-avatar>
    </template>
    <template #subtitle>
      <div v-if="!isEmpty(user.title)">{{ user.title }}</div>
      <div v-if="!isEmpty(user.phoneNumber)">{{ user.phoneNumber }}</div>
    </template>
  </v-card>
  <v-card
    v-else
    :title="user.displayName || `${user.firstName} ${user.lastName}`"
  >
    <!-- // -->
    <template #prepend>
      <v-avatar
        size="32"
        color="secondary"
        variant="tonal"
      >
        <v-icon size="16"> mdi-account </v-icon>
      </v-avatar>
    </template>
    <template #subtitle>
      <div v-if="!isEmpty(user.title)">{{ user.title }}</div>
      <div v-if="!isEmpty(user.department)">{{ user.department }}</div>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import { isEmpty } from "lodash"

import { type User } from "@/api/users-api"

defineProps<{
  user: User
}>()
</script>

<style scoped></style>
