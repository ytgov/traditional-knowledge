<template>
  <v-date-input
    :model-value="date"
    @update:model-value="updateDateAndEmit"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { DateTime } from "luxon"
import { isNil } from "lodash"

/**
 * A date input accepts and returns a string.
 */
const props = withDefaults(
  defineProps<{
    modelValue: string | null | undefined
    returnFormat?: string
  }>(),
  {
    returnFormat: "yyyy-MM-dd",
  }
)

const emit = defineEmits<{
  "update:modelValue": [value: string | null]
}>()

const date = ref<Date | null>(null)

watch(
  () => props.modelValue,
  (newValue) => {
    if (isNil(newValue)) {
      date.value = null
      return
    }

    const newDate = DateTime.fromISO(newValue).toJSDate()
    date.value = newDate
  }
)

function updateDateAndEmit(value: unknown) {
  if (value instanceof Date) {
    date.value = value

    const stringValue = DateTime.fromJSDate(value).toFormat(props.returnFormat)
    if (isNil(stringValue)) {
      emit("update:modelValue", null)
      return
    }

    emit("update:modelValue", stringValue)
    return stringValue
  } else if (typeof value === "string") {
    date.value = DateTime.fromISO(value).toJSDate()
    emit("update:modelValue", value)
  } else {
    date.value = null
    emit("update:modelValue", null)
  }
}
</script>
