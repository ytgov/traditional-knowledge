<template>
  <v-select
    :items="retentions"
    item-value="id"
    item-title="name"
  />
</template>

<script setup lang="ts">
import useRetentions from "@/use/use-retentions"

const { retentions } = useRetentions()

</script>
