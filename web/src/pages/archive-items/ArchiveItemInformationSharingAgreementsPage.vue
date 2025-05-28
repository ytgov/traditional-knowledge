<template>
  <v-card>
    <template #text>
      <div
        v-if="canShare"
        class="d-flex justify-end mb-4"
      >
        <ArchiveItemShareButton
          :archive-item-id="archiveItemIdAsNumber"
          :loading="isLoading"
          @shared="
            refreshInformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator
          "
        />
      </div>
      <div>
        <InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator
          ref="informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator"
          :where="informationSharingAgreementArchiveItemsWhereOptions"
          route-query-suffix="InformationSharingAgreementArchiveItems"
          @deleted="refreshArchiveItem"
        />
      </div>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue"

import useArchiveItem from "@/use/use-archive-item"

import ArchiveItemShareButton from "@/components/archive-items/ArchiveItemShareButton.vue"
import InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator from "@/components/information-sharing-agreement-archive-items/InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator.vue"

const props = defineProps<{
  archiveItemId: string
}>()

const archiveItemIdAsNumber = computed(() => parseInt(props.archiveItemId))
const { policy, isLoading, refresh: refreshArchiveItem } = useArchiveItem(archiveItemIdAsNumber)

const canShare = computed(() => policy.value?.update)

const informationSharingAgreementArchiveItemsWhereOptions = computed(() => ({
  archiveItemId: archiveItemIdAsNumber.value,
}))

const informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator =
  useTemplateRef<
    InstanceType<
      typeof InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator
    >
  >("informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator")

function refreshInformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator() {
  refreshArchiveItem()
  informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator.value?.refresh()
}
</script>
