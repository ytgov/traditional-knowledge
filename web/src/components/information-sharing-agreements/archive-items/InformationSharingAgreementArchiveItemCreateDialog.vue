<template>
  <v-dialog
    v-model="showDialog"
    max-width="600"
    persistent
    @keydown.esc="close"
  >
    <v-form
      v-if="archiveItemAttributes"
      ref="form"
      @submit.prevent="saveAndClose"
    >
      <v-card elevation="10">
        <v-card-text>
          <FileDrop @files-dropped="attachDroppedFiles">
            <v-card-title>Knowledge Item</v-card-title>
            <v-card-text>
              <v-checkbox
                v-model="archiveItemAttributes.confidentialityReceipt"
                label="I confirm that I have received and agreed to the confidentiality terms."
                class="mt-3"
                :rules="[required]"
                required
                hide-details
              />
            </v-card-text>

            <v-divider
              thickness="2"
              class="mb-4"
            />

            <v-card-title>Attachments</v-card-title>

            <v-card-text>
              <p class="mb-4">Drag and drop files or click the box below</p>
              <EnhancedFileInput
                v-model="files"
                multiple
                chips
                clearable
                label="Attachments"
              />
            </v-card-text>

            <v-card-actions>
              <v-btn
                type="submit"
                color="primary"
                variant="elevated"
                size="large"
                :loading="isLoading"
                text="Create"
              />
              <v-spacer />
              <v-btn
                variant="outlined"
                color="secondary"
                size="large"
                :disabled="isLoading"
                text="Cancel"
                @click="close"
              />
            </v-card-actions>
          </FileDrop>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue"
import { useRouteQuery } from "@vueuse/router"

import { booleanTransformer } from "@/utils/use-route-query-transformers"
import { required } from "@/utils/validators"

import Api from "@/api"
import { type ArchiveItemCreationAttributes } from "@/api/information-sharing-agreements/archive-items-api"
import { type InformationSharingAgreementAsShow } from "@/api/information-sharing-agreements-api"

import useSnack from "@/use/use-snack"

import EnhancedFileInput from "@/components/common/EnhancedFileInput.vue"
import FileDrop from "@/components/common/FileDrop.vue"

const props = defineProps<{
  informationSharingAgreement: InformationSharingAgreementAsShow
}>()

const emit = defineEmits<{
  created: [archiveItemId: number]
}>()

const showDialog = useRouteQuery("showCreateArchiveItemDialog", "false", {
  transform: booleanTransformer,
})

const archiveItemAttributes = ref<Partial<ArchiveItemCreationAttributes>>({})

const files = ref<File[]>([])

function attachDroppedFiles(droppedFiles: File[]) {
  files.value = droppedFiles
}

const isLoading = ref(false)
const form = useTemplateRef("form")
const snack = useSnack()

async function saveAndClose() {
  if (form.value === null) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  isLoading.value = true
  try {
    const { archiveItem } = await Api.InformationSharingAgreements.archiveItemsApi.create(
      props.informationSharingAgreement.id,
      archiveItemAttributes.value,
      files.value
    )
    snack.success("Item created.")
    emit("created", archiveItem.id)
  } catch (error) {
    snack.error("Save failed!")
    throw error
  } finally {
    isLoading.value = false
  }
}

function open() {
  showDialog.value = true
}

function close() {
  showDialog.value = false
}

defineExpose({ open })
</script>
