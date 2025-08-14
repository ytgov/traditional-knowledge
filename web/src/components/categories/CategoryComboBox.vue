<template>
  <v-combobox
    :model-value="props.modelValue"
    :items="items"
    item-value="id"
    item-title="name"
    :return-object="false"
    multiple
    chips
    clearable
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import useCategories from "@/use/use-categories"

const props = withDefaults(
  defineProps<{
    retentionId?: number | null
    modelValue: number[] | null
  }>(),
  {
    retentionId: null,
  }
)

const emit = defineEmits<{
  (e: "update:modelValue", value: number[]): void
}>()

const { items, list } = useCategories()

onMounted(async () => {
  await list({ perPage: 1000, page: 1 })
})
</script>
