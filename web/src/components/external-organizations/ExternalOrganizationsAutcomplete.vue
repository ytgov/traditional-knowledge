<template>
  <v-autocomplete
    :items="Object.values(UserYukonFirstNations)"
    label="External Organizations"
  />
</template>

<script setup lang="ts">
import { UserYukonFirstNations } from "@/api/users-api"
</script>
