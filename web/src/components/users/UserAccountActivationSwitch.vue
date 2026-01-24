<template>
  <v-switch
    :model-value="isActive"
    label="Account Active"
    @update:model-value="toggleUserActivation"
  >
    <template #append>
      <UserDeactivationDialog
        ref="userDeactivationDialogRef"
        @success="emitSuccess"
      />
      <UserActivationDialog
        ref="userActivationDialogRef"
        @success="emitSuccess"
      />
    </template>
  </v-switch>
</template>

<script lang="ts" setup>
import { isNil } from "lodash"
import { useTemplateRef } from "vue"

import UserActivationDialog from "@/components/users/UserActivationDialog.vue"
import UserDeactivationDialog from "@/components/users/UserDeactivationDialog.vue"

const props = defineProps<{
  isActive: boolean
  userId: number
}>()

const emit = defineEmits<{
  success: [void]
}>()

const userDeactivationDialogRef = useTemplateRef("userDeactivationDialogRef")
const userActivationDialogRef = useTemplateRef("userActivationDialogRef")

async function toggleUserActivation(isActive: boolean | null) {
  if (isNil(isActive)) return

  if (isActive) {
    userActivationDialogRef.value?.open(props.userId)
  } else {
    userDeactivationDialogRef.value?.open(props.userId)
  }
}

function emitSuccess() {
  emit("success")
}
</script>
