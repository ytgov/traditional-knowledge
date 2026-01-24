<template>
  <v-dialog
    v-model="showDialog"
    max-width="500"
    persistent
    @keydown.esc="close"
    @input="closeIfFalse"
  >
    <v-form @submit.prevent="activateUserAndEmitSuccess">
      <v-card>
        <v-card-title>Activate User</v-card-title>

        <v-skeleton-loader
          v-if="isNil(user)"
          type="card"
        />
        <v-card-text v-else>
          <p class="mb-4">
            Are you sure you want to activate {{ user.displayName }}? They will now be able to log
            in to the system.
          </p>
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
            color="success"
            type="submit"
            :loading="isLoading"
          >
            Activate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from "vue"
import { isNil } from "lodash"
import { useRouteQuery } from "@vueuse/router"

import usersApi from "@/api/users-api"
import { integerTransformer } from "@/utils/use-route-query-transformers"

import useUser from "@/use/use-user"
import useSnack from "@/use/use-snack"

const emit = defineEmits<{
  success: [void]
}>()

const userId = useRouteQuery<string | null, number | null>("activateUserId", null, {
  transform: integerTransformer,
})
const { user } = useUser(userId)

const showDialog = ref(false)

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

async function activateUserAndEmitSuccess() {
  if (isNil(user.value)) return

  isLoading.value = true
  try {
    await usersApi.activate(user.value.id)
    snack.success("User activated!")
    emit("success")

    await nextTick()
    close()
  } catch (error) {
    console.error(`Failed to activate user: ${error}`, { error })
    snack.error(`Failed to activate user: ${error}`)
  } finally {
    isLoading.value = false
  }
}

function reset() {
  // No form fields to reset for activation
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
