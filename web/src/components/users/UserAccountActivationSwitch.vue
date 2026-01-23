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
      <UserActivatationDialog
        ref="userActivatationDialogRef"
        @success="emitSuccess"
      />
    </template>
  </v-switch>
</template>

<script lang="ts" setup>
import { isNil } from "lodash"
import { useTemplateRef } from "vue"

import UserActivatationDialog from "@/components/users/UserActivatationDialog.vue"
import UserDeactivationDialog from "@/components/users/UserDeactivationDialog.vue"

const props = defineProps<{
  isActive: boolean
  userId: number
}>()

const emit = defineEmits<{
  success: [void]
}>()

const userDeactivationDialogRef = useTemplateRef("userDeactivationDialogRef")
const userActivatationDialogRef = useTemplateRef("userActivatationDialogRef")

async function toggleUserActivation(isActive: boolean | null) {
  console.log("toggleUserActivation", { isActive })
  console.log(`userActivatationDialogRef.value:`, userActivatationDialogRef.value)
  if (isNil(isActive)) return

  if (isActive) {
    userActivatationDialogRef.value?.open(props.userId)
  } else {
    userDeactivationDialogRef.value?.open(props.userId)
  }
}

function emitSuccess() {
  emit("success")
}
</script>
