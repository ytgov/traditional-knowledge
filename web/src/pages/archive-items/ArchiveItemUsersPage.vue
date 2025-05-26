<template>
  <!-- TODO: move some or all of this into an information sharing agreement access grants card component -->
  <v-card>
    <template
      v-if="!isEmpty(informationSharingAgreementAccessGrants)"
      #text
    >
      <v-list
        class="py-0"
        style="border: 1px solid rgba(0, 0, 0, 0.3); border-radius: 4px"
        :loading="isAccessGrantsLoading"
      >
        <template
          v-for="(accessGrant, index) of informationSharingAgreementAccessGrants"
          :key="accessGrant.userId || accessGrant.groupId"
        >
          <UserListItem
            v-if="!isNil(accessGrant.userId)"
            :user-id="accessGrant.userId"
            class="py-2"
            :class="{
              'border-bottom': index < informationSharingAgreementAccessGrants.length - 1,
            }"
          />
          <GroupListItem
            v-else
            :group-id="accessGrant.groupId"
            class="py-2"
            :class="{
              'border-bottom': index < informationSharingAgreementAccessGrants.length - 1,
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
import { computed } from "vue"
import { isNil, isEmpty } from "lodash"

import useInformationSharingAgreementAccessGrants from "@/use/use-information-sharing-agreement-access-grants"

import GroupListItem from "@/components/groups/GroupListItem.vue"
import UserListItem from "@/components/users/UserListItem.vue"

const props = defineProps<{
  archiveItemId: string
}>()

const informationSharingAgreementAccessGrantsQuery = computed(() => ({
  filters: {
    forArchiveItemId: parseInt(props.archiveItemId),
  },
}))
const { informationSharingAgreementAccessGrants, isLoading: isAccessGrantsLoading } =
  useInformationSharingAgreementAccessGrants(informationSharingAgreementAccessGrantsQuery)
</script>
