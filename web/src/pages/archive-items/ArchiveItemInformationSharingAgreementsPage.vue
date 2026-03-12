<template>
  <v-card>
    <template #text>
      <div
        v-if="canShare && !hasExistingLink"
        class="d-flex justify-end mb-4"
      >
        <ArchiveItemShareButton
          :archive-item-id="archiveItemIdAsNumber"
          :loading="isLoading"
          @shared="refreshAll"
        />
      </div>
      <div>
        <InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator
          ref="informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator"
          :where="informationSharingAgreementArchiveItemsWhereOptions"
          route-query-suffix="InformationSharingAgreementArchiveItems"
          @deleted="refreshArchiveAndLinks"
        />
      </div>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue"
import { isEmpty } from "lodash"

import useArchiveItem from "@/use/use-archive-item"
import useInformationSharingAgreementArchiveItems from "@/use/use-information-sharing-agreement-archive-items"

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

const informationSharingAgreementArchiveItemsQuery = computed(() => ({
  where: {
    archiveItemId: archiveItemIdAsNumber.value,
  },
  perPage: 1,
}))
const {
  informationSharingAgreementArchiveItems,
  refresh: refreshInformationSharingAgreementArchiveItems,
} = useInformationSharingAgreementArchiveItems(informationSharingAgreementArchiveItemsQuery)
const hasExistingLink = computed(() => !isEmpty(informationSharingAgreementArchiveItems.value))

const informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator =
  useTemplateRef<
    InstanceType<
      typeof InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator
    >
  >("informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator")

async function refreshAll() {
  await Promise.all([
    refreshArchiveItem(),
    refreshInformationSharingAgreementArchiveItems(),
    informationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator.value?.refresh(),
  ])
}

async function refreshArchiveAndLinks() {
  await Promise.all([refreshArchiveItem(), refreshInformationSharingAgreementArchiveItems()])
}
</script>
