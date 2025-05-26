<template>
  <v-skeleton-loader
    v-if="isNil(archiveItem)"
    type="card"
  />
  <v-card v-else>
    <template #text>
      <div class="d-flex justify-end mb-4">
        <v-btn
          v-if="policy?.update"
          color="primary"
          variant="outlined"
          @click="openGrantAccessDialog"
        >
          Share
        </v-btn>
      </div>
      <div>
        <InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator
          ref="informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator"
          :where="informationSharingAgreementArchiveItemsWhereOptions"
          route-query-suffix="InformationSharingAgreementArchiveItems"
        />
      </div>
    </template>

    <AddArchiveItemToInformationSharingAgreementDialog
      ref="addArchiveItemToInformationSharingAgreementDialog"
      @created="refreshAll"
    />
  </v-card>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue"
import { isNil } from "lodash"

import useArchiveItem from "@/use/use-archive-item"

import AddArchiveItemToInformationSharingAgreementDialog from "@/components/information-sharing-agreement-archive-items/AddArchiveItemToInformationSharingAgreementDialog.vue"
import InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator from "@/components/information-sharing-agreement-archive-items/InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator.vue"

const props = defineProps<{
  archiveItemId: string
}>()

const archiveItemIdAsNumber = computed(() => parseInt(props.archiveItemId))
const { archiveItem, policy, refresh } = useArchiveItem(archiveItemIdAsNumber)

const informationSharingAgreementArchiveItemsWhereOptions = computed(() => ({
  archiveItemId: archiveItemIdAsNumber.value,
}))

const addArchiveItemToInformationSharingAgreementDialog = useTemplateRef<
  InstanceType<typeof AddArchiveItemToInformationSharingAgreementDialog>
>("addArchiveItemToInformationSharingAgreementDialog")

function openGrantAccessDialog() {
  if (isNil(addArchiveItemToInformationSharingAgreementDialog.value)) return

  addArchiveItemToInformationSharingAgreementDialog.value.show(archiveItemIdAsNumber.value)
}

const informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator =
  useTemplateRef<
    InstanceType<
      typeof InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator
    >
  >("informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator")

function refreshAll() {
  refresh()
  informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator.value?.refresh()
}
</script>
