<template>
  <v-data-iterator
    v-model:items-per-page="perPage"
    v-model:page="page"
    :items="informationSharingAgreementAccessGrants"
    :items-length="totalCount"
    :loading="isLoading"
  >
    <template #loader>
      <v-skeleton-loader type="list-item-two-line" />
    </template>

    <template #default="{ items }">
      <v-list
        class="py-0 border rounded border-opacity-50"
        :loading="isLoading"
      >
        <template
          v-for="({ raw: item }, index) of items"
          :key="item.id"
        >
          <UserListItem
            :user-id="item.userId"
            class="py-2"
            :class="{
              'border-b border-opacity-50': index < items.length - 1,
            }"
            @click.stop="goToUserPage(item.userId)"
          />
        </template>
      </v-list>
    </template>

    <template #footer="{ pageCount }">
      <v-pagination
        v-model="page"
        :length="pageCount"
      />
    </template>

    <template #no-data>
      <p class="text-center pa-3">No users or groups have access to this item</p>
    </template>
  </v-data-iterator>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useRouteQuery } from "@vueuse/router"
import { useRouter } from "vue-router"

import useInformationSharingAgreementAccessGrants, {
  type InformationSharingAgreementAccessGrantWhereOptions,
  type InformationSharingAgreementAccessGrantFiltersOptions,
} from "@/use/use-information-sharing-agreement-access-grants"

import UserListItem from "@/components/users/UserListItem.vue"

const props = withDefaults(
  defineProps<{
    filters?: InformationSharingAgreementAccessGrantFiltersOptions
    where?: InformationSharingAgreementAccessGrantWhereOptions
    routeQuerySuffix?: string
  }>(),
  {
    filters: () => ({}),
    where: () => ({}),
    routeQuerySuffix: "",
  }
)

const page = useRouteQuery(`page${props.routeQuerySuffix}`, "1", { transform: Number })
const perPage = useRouteQuery(`perPage${props.routeQuerySuffix}`, "10", { transform: Number })

const informationSharingAgreementAccessGrantsQuery = computed(() => ({
  filters: props.filters,
  where: props.where,
  perPage: perPage.value,
  page: page.value,
}))

const { informationSharingAgreementAccessGrants, totalCount, isLoading, refresh } =
  useInformationSharingAgreementAccessGrants(informationSharingAgreementAccessGrantsQuery)

const router = useRouter()

function goToUserPage(userId: number) {
  // TODO: standardize this route to redirect to user read page
  return router.push({
    name: "users/UserEditPage",
    params: {
      userId,
    },
  })
}

defineExpose({
  refresh,
})
</script>

<style scoped></style>
