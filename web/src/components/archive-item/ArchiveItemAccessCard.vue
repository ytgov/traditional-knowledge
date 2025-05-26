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
        <InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsDataTableServer
          ref="informationSharingAgreementArchiveItemsAsInformationSharingAgreementsDataTableServer"
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
import { computed, toRefs, useTemplateRef } from "vue"
import { isNil } from "lodash"

import useArchiveItem from "@/use/use-archive-item"

import AddArchiveItemToInformationSharingAgreementDialog from "@/components/information-sharing-agreement-archive-items/AddArchiveItemToInformationSharingAgreementDialog.vue"
import InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsDataTableServer from "@/components/information-sharing-agreement-archive-items/InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsDataTableServer.vue"

const props = defineProps<{
  archiveItemId: number
}>()

const { archiveItemId } = toRefs(props)
const { archiveItem, policy, refresh } = useArchiveItem(archiveItemId)

const informationSharingAgreementArchiveItemsWhereOptions = computed(() => ({
  archiveItemId: props.archiveItemId,
}))

const addArchiveItemToInformationSharingAgreementDialog = useTemplateRef<
  InstanceType<typeof AddArchiveItemToInformationSharingAgreementDialog>
>("addArchiveItemToInformationSharingAgreementDialog")

function openGrantAccessDialog() {
  if (isNil(addArchiveItemToInformationSharingAgreementDialog.value)) return

  addArchiveItemToInformationSharingAgreementDialog.value.show(props.archiveItemId)
}

const informationSharingAgreementArchiveItemsAsInformationSharingAgreementsDataTableServer =
  useTemplateRef<
    InstanceType<
      typeof InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsDataTableServer
    >
  >("informationSharingAgreementArchiveItemsAsInformationSharingAgreementsDataTableServer")

function refreshAll() {
  refresh()
  informationSharingAgreementArchiveItemsAsInformationSharingAgreementsDataTableServer.value?.refresh()
}
</script>

<style>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}
</style>
