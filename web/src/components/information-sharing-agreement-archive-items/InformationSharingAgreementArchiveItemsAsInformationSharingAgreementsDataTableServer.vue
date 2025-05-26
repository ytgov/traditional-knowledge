<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    v-model:page="page"
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="informationSharingAgreementArchiveItems"
    :items-length="totalCount"
    :loading="isLoading"
    class="border-radius-4"
    density="compact"
    @click:row="
      (_event: unknown, { item }: InformationSharingAgreementArchiveItemTableRow) =>
        goToInformationSharingAgreementPage(item.informationSharingAgreementId)
    "
  >
    <template #item.informationSharingAgreementId="{ item }">
      <InformationSharingAgreementChip
        :information-sharing-agreement-id="item.informationSharingAgreementId"
      />
    </template>
    <template #item.creatorId="{ item }">
      <UserChip :user-id="item.creatorId" />
    </template>
    <template #item.createdAt="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>
    <template #no-data>
      <p class="text-center pa-3">No information sharing agreements for this item</p>
    </template>
  </v-data-table-server>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useRouteQuery } from "@vueuse/router"

import { formatDate } from "@/utils/formatters"

import useVuetifySortByToSafeRouteQuery from "@/use/utils/use-vuetify-sort-by-to-safe-route-query"
import useVuetifySortByToSequelizeSafeOrder from "@/use/utils/use-vuetify-sort-by-to-sequelize-safe-order"
import useInformationSharingAgreementArchiveItems, {
  type InformationSharingAgreementArchiveItem,
  type InformationSharingAgreementArchiveItemWhereOptions,
  type InformationSharingAgreementArchiveItemFiltersOptions,
} from "@/use/use-information-sharing-agreement-archive-items"

import InformationSharingAgreementChip from "@/components/information-sharing-agreements/InformationSharingAgreementChip.vue"
import UserChip from "@/components/users/UserChip.vue"

type InformationSharingAgreementArchiveItemTableRow = {
  item: InformationSharingAgreementArchiveItem
}

const props = withDefaults(
  defineProps<{
    filters?: InformationSharingAgreementArchiveItemFiltersOptions
    where?: InformationSharingAgreementArchiveItemWhereOptions
    routeQuerySuffix?: string
  }>(),
  {
    filters: () => ({}),
    where: () => ({}),
    routeQuerySuffix: "",
  }
)

const headers = ref([
  {
    title: "Agreement",
    key: "informationSharingAgreementId",
  },
  {
    title: "Added By",
    key: "creatorId",
  },
  {
    title: "Date Added",
    key: "createdAt",
  },
])

const page = useRouteQuery(`page${props.routeQuerySuffix}`, "1", { transform: Number })
const perPage = useRouteQuery(`perPage${props.routeQuerySuffix}`, "10", { transform: Number })
const sortBy = useVuetifySortByToSafeRouteQuery(`sortBy${props.routeQuerySuffix}`, [
  {
    key: "createdAt",
    order: "desc",
  },
])
const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const informationSharingAgreementArchiveItemsQuery = computed(() => ({
  filters: props.filters,
  where: props.where,
  order: order.value,
  perPage: perPage.value,
  page: page.value,
}))

const { informationSharingAgreementArchiveItems, totalCount, isLoading, refresh } =
  useInformationSharingAgreementArchiveItems(informationSharingAgreementArchiveItemsQuery)

const router = useRouter()

function goToInformationSharingAgreementPage(informationSharingAgreementId: number) {
  return router.push({
    name: "information-sharing-agreements/InformationSharingAgreementPage",
    params: {
      informationSharingAgreementId,
    },
  })
}

defineExpose({
  refresh,
})
</script>

<style scoped>
.border-radius-4 {
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}
</style>
