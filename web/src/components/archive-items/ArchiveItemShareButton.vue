<template>
  <v-btn
    color="primary"
    variant="outlined"
    @click="openGrantAccessDialog"
  >
    Share
    <AddArchiveItemToInformationSharingAgreementDialog
      ref="addArchiveItemToInformationSharingAgreementDialog"
      @created="emit('shared', $event)"
    />
  </v-btn>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue"
import { isNil } from "lodash"

import AddArchiveItemToInformationSharingAgreementDialog from "@/components/information-sharing-agreement-archive-items/AddArchiveItemToInformationSharingAgreementDialog.vue"

const props = defineProps<{
  archiveItemId: number
}>()

const emit = defineEmits<{
  shared: [archiveItemToInformationSharingAgreementId: number]
}>()

const addArchiveItemToInformationSharingAgreementDialog = useTemplateRef<
  InstanceType<typeof AddArchiveItemToInformationSharingAgreementDialog>
>("addArchiveItemToInformationSharingAgreementDialog")

function openGrantAccessDialog() {
  if (isNil(addArchiveItemToInformationSharingAgreementDialog.value)) return

  addArchiveItemToInformationSharingAgreementDialog.value.show(props.archiveItemId)
}
</script>
