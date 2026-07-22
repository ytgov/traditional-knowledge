<template>
  <v-card>
    <template #text>
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
import { computed } from "vue"

import useArchiveItem from "@/use/use-archive-item"
import useInformationSharingAgreementArchiveItems from "@/use/use-information-sharing-agreement-archive-items"

import InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator from "@/components/information-sharing-agreement-archive-items/InformationSharingAgreementArchiveItemsAsInformationSharingAgreementsEditDataIterator.vue"

const props = defineProps<{
  archiveItemId: string
}>()

const archiveItemIdAsNumber = computed(() => parseInt(props.archiveItemId))
const { refresh: refreshArchiveItem } = useArchiveItem(archiveItemIdAsNumber)

const informationSharingAgreementArchiveItemsWhereOptions = computed(() => ({
  archiveItemId: archiveItemIdAsNumber.value,
}))

const informationSharingAgreementArchiveItemsQuery = computed(() => ({
  where: {
    archiveItemId: archiveItemIdAsNumber.value,
  },
  perPage: 1,
}))
const { refresh: refreshInformationSharingAgreementArchiveItems } =
  useInformationSharingAgreementArchiveItems(informationSharingAgreementArchiveItemsQuery)

async function refreshArchiveAndLinks() {
  await Promise.all([refreshArchiveItem(), refreshInformationSharingAgreementArchiveItems()])
}
</script>
