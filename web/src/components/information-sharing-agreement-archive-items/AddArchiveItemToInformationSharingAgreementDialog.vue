<template>
  <v-dialog
    :model-value="showDialog"
    max-width="600px"
    @keydown.esc="hide"
    @update:model-value="hideIfFalse"
  >
    <v-form
      ref="form"
      v-model="isValid"
      @submit.prevent="createAndHide"
    >
      <v-card :loading="isLoading">
        <template #title> Grant Access </template>

        <template #text>
          <v-row>
            <v-col>
              <InformationSharingAgreementSearchableAutocomplete
                v-model="
                  informationSharingAgreementArchiveItemAttributes.informationSharingAgreementId
                "
                :filters="informationSharingAgreementFilters"
              />
            </v-col>
          </v-row>
        </template>

        <template #actions>
          <v-btn
            :loading="isLoading"
            type="submit"
            variant="flat"
          >
            Save
          </v-btn>
          <v-spacer />
          <v-btn
            :loading="isLoading"
            color="error"
            variant="outlined"
            @click="hide"
          >
            Cancel
          </v-btn>
        </template>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue"
import { useRouteQuery } from "@vueuse/router"
import { isNil } from "lodash"

import { type VForm } from "vuetify/components"

import { integerTransformer } from "@/utils/use-route-query-transformers"
import informationSharingAgreementArchiveItemsApi, {
  type InformationSharingAgreementArchiveItem,
} from "@/api/information-sharing-agreement-archive-items-api"
import useSnack from "@/use/use-snack"

import InformationSharingAgreementSearchableAutocomplete from "@/components/information-sharing-agreements/InformationSharingAgreementSearchableAutocomplete.vue"

const emit = defineEmits<{
  created: [informationSharingAgreementArchiveItemId: number]
}>()

const archiveItemId = useRouteQuery<string | undefined, number | undefined>(
  "showAddArchiveItemToInformationSharingAgreementDialog",
  undefined,
  {
    transform: integerTransformer,
  }
)

function hide() {
  archiveItemId.value = undefined
}

function show(newArchiveItemId: number) {
  archiveItemId.value = newArchiveItemId
}

const showDialog = computed(() => !isNil(archiveItemId.value))

const informationSharingAgreementArchiveItemAttributes = ref<
  Partial<InformationSharingAgreementArchiveItem>
>({
  archiveItemId: undefined,
  informationSharingAgreementId: undefined,
})

const informationSharingAgreementFilters = computed(() => ({
  notAssociatedWithArchiveItem: archiveItemId.value,
}))

const form = ref<InstanceType<typeof VForm> | null>(null)

watch(
  () => archiveItemId.value,
  (newArchiveItemId) => {
    if (isNil(newArchiveItemId)) {
      informationSharingAgreementArchiveItemAttributes.value = {
        archiveItemId: undefined,
        informationSharingAgreementId: undefined,
      }
      form.value?.resetValidation()
    } else {
      informationSharingAgreementArchiveItemAttributes.value = {
        archiveItemId: newArchiveItemId,
        informationSharingAgreementId: undefined,
      }
    }
  },
  { immediate: true }
)

const isLoading = ref(false)
const isValid = ref(false)

const snack = useSnack()

async function createAndHide() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  isLoading.value = true
  try {
    const { informationSharingAgreementArchiveItem } =
      await informationSharingAgreementArchiveItemsApi.create(
        informationSharingAgreementArchiveItemAttributes.value
      )
    hide()

    await nextTick()
    emit("created", informationSharingAgreementArchiveItem.id)
    snack.success("Archive item added to information sharing agreement")
  } catch (error) {
    snack.error(`Failed to add archive item to information sharing agreement ${error}`)
  } finally {
    isLoading.value = false
  }
}

function hideIfFalse(value: boolean) {
  if (value !== false) return

  hide()
}

defineExpose({
  show,
})
</script>
