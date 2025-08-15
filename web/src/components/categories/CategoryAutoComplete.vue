<template>
  <v-autocomplete
    v-model="selectedCategoryIds"
    :items="categories"
    item-value="id"
    item-title="name"
    :return-object="false"
    multiple
    chips
    clearable
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"

import { CategoryWhereOptions } from "@/api/categories-api"
import useCategories from "@/use/use-categories"

const props = defineProps<{
  retentionId?: number | null
}>()

const selectedCategoryIds = defineModel<number[] | null>()

const retentionQuery = computed<CategoryWhereOptions>(() => ({
  retentionId: props.retentionId ?? undefined,
}))

const { items: categories, list } = useCategories()

onMounted(async () => {
  await list({ perPage: 1000, page: 1, where: retentionQuery.value })
})
</script>
