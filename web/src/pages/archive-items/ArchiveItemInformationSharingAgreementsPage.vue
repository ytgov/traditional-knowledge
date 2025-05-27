<template>
  <v-card>
    <template #text>
      <div class="d-flex justify-end mb-4">
        <ArchiveItemShareButton
          ref="archiveItemShareButton"
          :archive-item-id="archiveItemIdAsNumber"
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
          @deleted="refreshArchiveItemShareButton"
        />
      </div>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue"

import ArchiveItemShareButton from "@/components/archive-items/ArchiveItemShareButton.vue"
import InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator from "@/components/information-sharing-agreement-archive-items/InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator.vue"

const props = defineProps<{
  archiveItemId: string
}>()

const archiveItemIdAsNumber = computed(() => parseInt(props.archiveItemId))

const informationSharingAgreementArchiveItemsWhereOptions = computed(() => ({
  archiveItemId: archiveItemIdAsNumber.value,
}))

const archiveItemShareButton =
  useTemplateRef<InstanceType<typeof ArchiveItemShareButton>>("archiveItemShareButton")

function refreshArchiveItemShareButton() {
  archiveItemShareButton.value?.refresh()
}

const informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator =
  useTemplateRef<
    InstanceType<
      typeof InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator
    >
  >("informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator")

function refreshInformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator() {
  informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator.value?.refresh()
}
</script>
