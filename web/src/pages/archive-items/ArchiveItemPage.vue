<template>
  <v-row>
    <v-col
      cols="12"
      md="8"
    >
      <ArchiveItemCard :archive-item-id="archiveItemIdAsNumber" />

      <v-card class="mt-5 border">
        <v-tabs
          slider-color="primary"
          grow
          bg-color="#ffffff77"
        >
          <v-tab
            :to="{
              name: 'archive-items/ArchiveItemInformationSharingAgreementsPage',
              params: {
                archiveItemId,
              },
            }"
          >
            Information Sharing Agreements
          </v-tab>
          <v-tab
            :to="{
              name: 'archive-items/ArchiveItemUsersWithAccessPage',
              params: {
                archiveItemId,
              },
            }"
          >
            Users with Access
          </v-tab>
        </v-tabs>
        <v-divider />
        <router-view></router-view>
      </v-card>
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <ArchiveItemQuickInfoCard :archive-item-id="archiveItemIdAsNumber" />

      <ArchiveItemAttachmentsCard
        :archive-item-id="archiveItemIdAsNumber"
        @accessed="reloadArchiveItemAuditCard"
      />

      <ArchiveItemAuditCard
        ref="archiveItemAuditCard"
        :item-id="archiveItemIdAsNumber"
        class="mt-5"
      />
    </v-col>
  </v-row>

  <PreviewDialog />
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue"

import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"

import ArchiveItemAttachmentsCard from "@/components/archive-items/ArchiveItemAttachmentsCard.vue"
import ArchiveItemAuditCard from "@/components/archive-items/ArchiveItemAuditCard.vue"
import ArchiveItemCard from "@/components/archive-items/ArchiveItemCard.vue"
import ArchiveItemQuickInfoCard from "@/components/archive-items/ArchiveItemQuickInfoCard.vue"
import PreviewDialog from "@/components/pdf/PreviewDialog.vue"

const props = defineProps<{
  archiveItemId: string
}>()

const archiveItemIdAsNumber = computed(() => parseInt(props.archiveItemId))

const archiveItemAuditCard =
  useTemplateRef<InstanceType<typeof ArchiveItemAuditCard>>("archiveItemAuditCard")

function reloadArchiveItemAuditCard() {
  archiveItemAuditCard.value?.reload()
}

useBreadcrumbs("View Archive Item", [
  BASE_CRUMB,
  {
    title: "Archive Items",
    to: {
      name: "archive-items/ArchiveItemListPage",
    },
  },
])
</script>
