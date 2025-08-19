<template>
  <v-select
    :items="categories"
    item-value="id"
    item-title="name"
  />
</template>

<script setup lang="ts">
import useCategories from "@/use/use-categories"

const { categories } = useCategories()

</script>
