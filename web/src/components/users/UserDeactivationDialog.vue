<template>
  <v-dialog
    v-model="showDialog"
    max-width="500"
    persistent
    @keydown.esc="close"
    @input="closeIfFalse"
  >
    <v-form
      ref="form"
      @submit.prevent="deactivateUserAndEmitSuccess"
    >
      <v-card>
        <v-card-title>Deactivate User</v-card-title>

        <v-skeleton-loader
          v-if="isNil(user)"
          type="card"
        />
        <v-card-text v-else>
          <p class="mb-4">
            Are you sure you want to deactivate {{ user.displayName }}? They will no longer be able
            to log in to the system.
          </p>

          <v-textarea
            v-model.trim="deactivationReason"
            label="Reason"
            placeholder="Please provide a reason for deactivating this user..."
            :rules="[required]"
            required
            rows="3"
            auto-grow
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            :disabled="isLoading"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            type="submit"
            :loading="isLoading"
          >
            Deactivate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts" setup>
import { nextTick, ref, useTemplateRef, watch } from "vue"
import { isNil } from "lodash"
import { useRouteQuery } from "@vueuse/router"

import { required } from "@/utils/validators"

import usersApi from "@/api/users-api"
import { integerTransformer } from "@/utils/use-route-query-transformers"

import useUser from "@/use/use-user"
import useSnack from "@/use/use-snack"

const emit = defineEmits<{
  success: [void]
}>()

const userId = useRouteQuery<string | null, number | null>("deactivateUserId", null, {
  transform: integerTransformer,
})
const { user } = useUser(userId)

const showDialog = ref(false)
const deactivationReason = ref("")
const form = useTemplateRef("form")

watch(
  () => userId.value,
  (newUserId) => {
    if (isNil(newUserId)) {
      showDialog.value = false
      reset()
    } else {
      showDialog.value = true
      reset()
    }
  },
  {
    immediate: true,
  }
)

const isLoading = ref(false)
const snack = useSnack()

async function deactivateUserAndEmitSuccess() {
  if (isNil(user.value)) return
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) return

  isLoading.value = true
  try {
    await usersApi.deactivate(user.value.id, {
      deactivationReason: deactivationReason.value,
    })
    snack.success("User deactivated!")
    emit("success")

    await nextTick()
    close()
  } catch (error) {
    console.error(`Failed to deactivate user: ${error}`, { error })
    snack.error(`Failed to deactivate user: ${error}`)
  } finally {
    isLoading.value = false
  }
}

function reset() {
  deactivationReason.value = ""
  form.value?.resetValidation()
}

function open(newUserId: number) {
  userId.value = newUserId
}

function close() {
  userId.value = null
}

function closeIfFalse(value: boolean | null) {
  if (value !== false) return

  close()
}

defineExpose({
  open,
  close,
})
</script>
