<template>
  <v-skeleton-loader
    v-if="isNil(archiveItem)"
    type="card"
  />
  <v-card v-else>
    <template #title>Users with Access to this Item</template>
    <template
      v-if="
        !isNil(archiveItem.informationSharingAgreementAccessGrants) &&
        archiveItem.informationSharingAgreementAccessGrants.length > 0
      "
      #text
    >
      <v-list
        class="py-0"
        style="border: 1px solid rgba(0, 0, 0, 0.3); border-radius: 4px"
      >
        <template
          v-for="(
            informationSharingAgreementAccessGrant, index
          ) of archiveItem.informationSharingAgreementAccessGrants"
          :key="informationSharingAgreementAccessGrant.userId"
        >
          <UserListItem
            v-if="!isNil(informationSharingAgreementAccessGrant.userId)"
            :user-id="informationSharingAgreementAccessGrant.userId"
            class="py-2"
            :class="{
              'border-bottom':
                index < archiveItem.informationSharingAgreementAccessGrants.length - 1,
            }"
          />
          <GroupListItem
            v-else
            :group-id="informationSharingAgreementAccessGrant.groupId"
            class="py-2"
            :class="{
              'border-bottom':
                index < archiveItem.informationSharingAgreementAccessGrants.length - 1,
            }"
          />
        </template>
      </v-list>
    </template>
    <template
      v-else
      #text
    >
      No users have access to this item
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { toRefs } from "vue"
import { isNil } from "lodash"

import useArchiveItem from "@/use/use-archive-item"
import UserListItem from "@/components/users/UserListItem.vue"

const props = defineProps<{
  archiveItemId: number
}>()

// TODO: switch to using a query to /information-sharing-agreement-access-grants
const { archiveItemId } = toRefs(props)
const { archiveItem } = useArchiveItem(archiveItemId)
</script>

<style>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}
</style>
