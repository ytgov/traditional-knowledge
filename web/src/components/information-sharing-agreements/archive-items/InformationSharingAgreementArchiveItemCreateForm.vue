<template>
  <v-form
    v-if="archiveItemAttributes"
    ref="form"
    @submit.prevent="saveAndRedirect"
  >
    <v-card class="border">
      <FileDrop @files-dropped="attachDroppedFiles">
        <v-card-title> Categories and Tags </v-card-title>
        <v-card-text>
          <p class="mb-4">
            Categories and Tags are used as filter criteria to find items. You can select as many of
            each as are applicable to this item.
          </p>
          <CategorySelect
            v-model="categoryIds"
            label="Categories *"
            :rules="[required]"
            hide-selected
            multiple
            chips
            :closable-chips="categoryIds.length > 1"
          />
          <v-combobox
            v-model="archiveItemAttributes.tags"
            label="Tags"
            class="mt-3"
            multiple
            chips
            clearable
          />
        </v-card-text>

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

          <v-btn
            type="submit"
            class="mt-5"
            :loading="isLoading"
            text="Create"
          />
        </v-card-text>
      </FileDrop>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watchEffect } from "vue"
import { useRouter } from "vue-router"
import { isNil } from "lodash"

import { required } from "@/utils/validators"

import Api from "@/api"
import { type ArchiveItemCreationAttributes } from "@/api/information-sharing-agreements/archive-items-api"
import { SecurityLevel } from "@/api/archive-items-api"
import {
  InformationSharingAgreementAccessLevels,
  type InformationSharingAgreementAsShow,
} from "@/api/information-sharing-agreements-api"

import useExternalOrganizations from "@/use/use-external-organizations"
import useSnack from "@/use/use-snack"

import EnhancedFileInput from "@/components/common/EnhancedFileInput.vue"
import FileDrop from "@/components/common/FileDrop.vue"

import CategorySelect from "@/components/categories/CategorySelect.vue"

const props = defineProps<{
  informationSharingAgreement: InformationSharingAgreementAsShow
}>()

const archiveItemAttributes = ref<Partial<ArchiveItemCreationAttributes>>({
  title: "",
  securityLevel: SecurityLevel.LOW,
  description: null,
  sharingPurpose: null,
  confidentialityReceipt: false,
  yukonFirstNations: [],
  tags: [],
  archiveItemCategoriesAttributes: [],
})

const ACCESS_LEVEL_TO_SECURITY_LEVEL = {
  [InformationSharingAgreementAccessLevels.INTERNAL]: SecurityLevel.LOW,
  [InformationSharingAgreementAccessLevels.PROTECTED_AND_LIMITED]: SecurityLevel.MEDIUM,
  [InformationSharingAgreementAccessLevels.CONFIDENTIAL_AND_RESTRICTED]: SecurityLevel.HIGH,
}

watchEffect(() => {
  const { accessLevel, purpose, authorizedApplication, title } = props.informationSharingAgreement

  const accessLevelOrDefault = accessLevel ?? InformationSharingAgreementAccessLevels.INTERNAL

  archiveItemAttributes.value.securityLevel = ACCESS_LEVEL_TO_SECURITY_LEVEL[accessLevelOrDefault]
  archiveItemAttributes.value.sharingPurpose = authorizedApplication
  archiveItemAttributes.value.description = purpose
  archiveItemAttributes.value.title = title
})

const NULL_USER_ID = -1
const externalGroupContactId = computed(
  () => props.informationSharingAgreement.externalGroupContactId
)
const externalOrganizationsQuery = computed(() => ({
  filters: {
    withUserId: externalGroupContactId.value ?? NULL_USER_ID,
  },
}))
const { externalOrganizations } = useExternalOrganizations(externalOrganizationsQuery, {
  skipWatchIf: () => isNil(externalGroupContactId.value),
})
const externalGroupContactOrganization = computed(() => externalOrganizations.value[0])

watchEffect(() => {
  if (isNil(externalGroupContactOrganization.value)) return

  archiveItemAttributes.value.yukonFirstNations = [externalGroupContactOrganization.value.name]
})

const files = ref<File[]>([])

function attachDroppedFiles(droppedFiles: File[]) {
  files.value = droppedFiles
}

const categoryIds = ref<number[]>([])

watchEffect(() => {
  archiveItemAttributes.value.archiveItemCategoriesAttributes = categoryIds.value.map(
    (categoryId) => ({
      categoryId,
    })
  )
})

const isLoading = ref(false)
const form = useTemplateRef("form")
const snack = useSnack()
const router = useRouter()

async function saveAndRedirect() {
  if (isNil(form.value)) return

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
    await router.push({
      name: "archive-items/ArchiveItemInformationSharingAgreementsPage",
      params: {
        archiveItemId: archiveItem.id,
      },
    })
  } catch (error) {
    snack.error("Save failed!")
    throw error
  } finally {
    isLoading.value = false
  }
}
</script>
