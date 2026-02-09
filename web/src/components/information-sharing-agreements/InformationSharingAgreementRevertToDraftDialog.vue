<template>
  <v-dialog
    v-model="showDialog"
    max-width="500"
    persistent
    @keydown.esc="close"
  >
    <v-card>
      <v-card-title>Revert to Draft</v-card-title>

      <v-card-text>
        <p>
          Are you sure you want to revert this agreement to draft? The signed acknowledgement file
          will be removed.
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
          color="warning"
          :loading="isLoading"
          @click="revertToDraftAndClose"
        >
          Revert to Draft
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouteQuery } from "@vueuse/router"

import { booleanTransformer } from "@/utils/use-route-query-transformers"

import informationSharingAgreementsApi from "@/api/information-sharing-agreements-api"
import useSnack from "@/use/use-snack"

const props = defineProps<{
  informationSharingAgreementId: number
}>()

const emit = defineEmits<{
  success: [void]
}>()

const showDialog = useRouteQuery("showRevertToDraftDialog", "false", {
  transform: booleanTransformer,
})

const isLoading = ref(false)
const snack = useSnack()

async function revertToDraftAndClose() {
  isLoading.value = true
  try {
    await informationSharingAgreementsApi.revertToDraft(props.informationSharingAgreementId)
    snack.success("Agreement reverted to draft!")
    emit("success")
    close()
  } catch (error) {
    console.error(`Failed to revert agreement to draft: ${error}`, { error })
    snack.error(`Failed to revert agreement to draft: ${error}`)
  } finally {
    isLoading.value = false
  }
}

function close() {
  showDialog.value = false
}
</script>
