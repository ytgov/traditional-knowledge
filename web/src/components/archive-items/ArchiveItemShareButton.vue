<template>
  <v-btn
    color="primary"
    variant="outlined"
    :loading="isLoading"
    :disabled="!canShare"
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
import { computed, toRefs, useTemplateRef } from "vue"
import { isNil } from "lodash"

import useArchiveItem from "@/use/use-archive-item"

import AddArchiveItemToInformationSharingAgreementDialog from "@/components/information-sharing-agreement-archive-items/AddArchiveItemToInformationSharingAgreementDialog.vue"

const props = defineProps<{
  archiveItemId: number
}>()

const emit = defineEmits<{
  shared: [archiveItemToInformationSharingAgreementId: number]
}>()

const { archiveItemId } = toRefs(props)
const { policy, isLoading, refresh } = useArchiveItem(archiveItemId)

const canShare = computed(() => policy.value?.update)

const addArchiveItemToInformationSharingAgreementDialog = useTemplateRef<
  InstanceType<typeof AddArchiveItemToInformationSharingAgreementDialog>
>("addArchiveItemToInformationSharingAgreementDialog")

function openGrantAccessDialog() {
  if (isNil(addArchiveItemToInformationSharingAgreementDialog.value)) return

  addArchiveItemToInformationSharingAgreementDialog.value.show(archiveItemId.value)
}

defineExpose({
  refresh,
})
</script>
