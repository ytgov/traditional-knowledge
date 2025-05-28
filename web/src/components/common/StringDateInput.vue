<template>
  <v-date-input
    v-bind="$attrs"
    v-model="formattedDate"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
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
  "update:modelValue": [value: string]
}>()

const formattedDate = computed({
  get() {
    if (isNil(props.modelValue)) return undefined

    const date = DateTime.fromISO(props.modelValue).toJSDate()
    return date
  },
  set(value) {
    if (value instanceof Date) {
      const stringValue = DateTime.fromJSDate(value).toFormat(props.returnFormat)
      if (isNil(stringValue)) {
        emit("update:modelValue", "")
        return ""
      }

      emit("update:modelValue", stringValue)
      return stringValue
    }

    emit("update:modelValue", "")
    return ""
  },
})
</script>
